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

    return workspaceId;
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      // For queries, I won't throw an error, just return an empty array
      return [];
    }

    // We want to get all the workspaces that the current user is a member of
    // To do this, we query the members table with the index by_user_id
    // and the current user's id. This will give us all the rows in the members table
    // that have the user's id in the userId field
    // We then map over the resulting array of objects and pull out the workspaceId
    // from each one, giving us an array of workspace ids that the user is a member of
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
  handler: async (ctx, args) => {
    // TODO: Restrict this endpoint to only workspace members
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
