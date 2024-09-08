import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

/**
 * Generates a 6 character alphanumeric code
 * @returns a string like "Km3xdu6"
 */
const generateCode = () => {
  const code = Array.from(
    { length: 6 },
    () => "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]
  ).join("");

  return code;
};

export const create = mutation({
  args: {
    name: v.string(),
  },
  /**
   * Creates a new workspace with the given name and the current user as its admin.
   * @throws {Error} If the user is not logged in.
   * @returns The ID of the newly created workspace.
   */
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const joinCode = generateCode();

    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId,
      joinCode,
    });

    await ctx.db.insert("members", {
      userId,
      workspaceId,
      role: "admin",
    });

    await ctx.db.insert("channels", {
      name: "general",
      workspaceId,
    });

    return workspaceId;
  },
});

export const get = query({
  args: {},

  /**
   * Get all the workspaces that the current user is a member of.
   *
   * This function first gets the id of the current user, and if that fails
   * (i.e. the user is not logged in) it returns an empty array.
   *
   * Then, it queries the members table with the index by_user_id, and the current
   * user's id. This will give us all the rows in the members table that have the
   * user's id in the userId field.
   *
   * We then map over the resulting array of objects and pull out the workspaceId
   * from each one, giving us an array of workspace ids that the user is a member of.
   *
   * Finally, we loop over the array of workspace ids and get each workspace by its id.
   * If the workspace exists, we add it to the final array of workspaces.
   *
   * @returns An array of workspaces that the current user is a member of.
   */
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      // For queries, I won't throw an error, just return an empty array
      return [];
    }

    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const workspaceIds = members.map((member) => member.workspaceId);

    const workspaces = [];

    for (const wId of workspaceIds) {
      const workspace = await ctx.db.get(wId);

      if (workspace) {
        workspaces.push(workspace);
      }
    }

    return workspaces;
  },
});

export const getById = query({
  args: {
    id: v.id("workspaces"),
  },

  /**
   * Get a workspace by id if the current user is a member of that workspace
   * @throws Error if the user is not a member of the workspace
   */
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .unique();

    if (!member) {
      return null;
    }
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("workspaces"),
    name: v.string(),
  },

  /**
   * Updates the name of a workspace. Only the admin of the workspace can
   * do this.
   *
   * @throws {Error} If the user is not authenticated or is not an admin of
   * the workspace.
   */
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .unique();

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, { name: args.name });

    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("workspaces"),
  },

  /**
   * Deletes a workspace. Only the admin of the workspace can do this.
   *
   * @throws {Error} If the user is not authenticated or is not an admin of
   * the workspace.
   */
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .unique();

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const [members] = await Promise.all([
      ctx.db
        .query("members")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
        .collect(),
    ]);

    // Delete all members of the workspace
    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    // Finally, delete the workspace itself
    await ctx.db.delete(args.id);

    return args.id;
  },
});
