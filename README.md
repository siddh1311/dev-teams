# DevTeams

**DevTeams** is a full-stack, real-time Slack clone that provides a complete communication platform for teams. It supports workspaces, channels, direct messaging, threads, reactions, editing and deleting messages, and more, offering a seamless and responsive user experience.

## **It is deployed! [DevTeams](https://dev-teams-one.vercel.app/)**

## Features

- **Real-time communication**: All messages and interactions happen instantly, providing a seamless chat experience across multiple devices.
- **Reactions to messages**: Users can react to messages with emojis, allowing for quick feedback and expression.

- **Threads / Replies system**: Conversations can be broken down into threads, helping users keep discussions organized within a channel or direct message.

- **Editing messages**: Users have the ability to edit sent messages, allowing them to correct errors or update content as needed.

- **Deleting messages**: Messages can be deleted by users, ensuring they have control over their communication history.

- **Role-based access control**: Admins can assign roles to members, giving them different permissions based on their role within the workspace or channel.

- **Image attachments**: Users can attach and send images directly within conversations, enhancing the communication with visual content.

- **Authentication with Next Auth v5**: Secure authentication system to manage user logins and protect sensitive data with OAuth providers and session management.

- **Channel creation**: Users can create dedicated channels to group conversations by topic, team, or project, facilitating more focused discussions.

- **Workspace creation**: Separate workspaces can be created for different teams or projects, helping users manage distinct areas of communication.

- **Invite system / Invite codes**: Workspaces and channels can be joined via invite links or codes, making it easy to onboard new members.

- **Direct messaging**: Users can send private 1:1 messages, allowing for confidential or personal conversations outside of group channels.

- **User profiles**: Each user has a profile that displays key information like their name, role, and contact details, making it easier to identify and connect with team members.

## In-progress Features:

- **Sidebar DMs** - All your DMs across different Channels in one place.
- **Sidebar Activity** - Get notifications when someone DMs you or you are added to a Workspace
- **Sidebar More** - Workspace / App preferences

## Technologies Used

- **Next.js 14**: Framework for server-side rendering and static site generation.
- **React**: Frontend JavaScript library for building user interfaces.
- **TypeScript**: Strongly-typed programming language that builds on JavaScript.
- **Convex**: For backend authentication and database management.
- **Jotai**: State management for React.
- **Lucid React**: Icon library for React components.
- **Shadcn UI & Tailwind CSS**: Styling framework for a highly customizable user interface.
- **Quill**: Rich text editor for chat input.
- **Sonner**: For creating smooth visual user experiences.
- **React-Verification-Input**: Handles joining workspaces via invite codes.

## Installation (Optional)

If you'd like to run DevTeams locally for development purposes, follow these steps.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [bun](https://bun.sh/) (v1 or higher)

### Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/siddh1311/dev-teams.git
   cd dev-teams
   ```

2. **Install dependencies**:

   ```bash
   bun install
   ```

3. **Set up environment variables**:

   Create a `.env.local` file in the root directory. You don't need to edit this file, just make sure it exists.

4. **[Set up a Convex Dev Environment](https://docs.convex.dev/quickstart/nextjs)**:

   ```bash
   bun x convex dev
   ```

   This will prompt you to log in with GitHub, create a project, and save your production and deployment URLs.

   The command will prompt you to for a few questions:

   ```bash
   ? What would you like to configure? # create a new project
   ? Project name: (dev-teams) # you can leave this default, just press enter
   ```

   If this was successful you should see a `Convex functions ready!` message in the terminal.
   Additionally, you should also see two new development environment variables stored in your `.env.local` file:

   ```bash
   CONVEX_DEPLOYMENT=...
   NEXT_PUBLIC_CONVEX_URL=...
   ```

   Now you can visit your newly created Convex project by clicking on the dashboard link in the terminal (it should be in the form of `https://dashboard.convex.dev/...`).

5. **[Set up a Convex Auth](https://labs.convex.dev/auth/setup)**:

   ### Before continuing ensure that you close the `convex dev` instance running in your terminal by pressing `CTRL + C`. <br>

   Now we can run the command:

   ```bash
   bun x @convex-dev/auth
   ```

   Once you run the command you should see the following question:

   **You might see the following message "There are unstaged or uncommited changes in the working directory. Please commit or stash them before proceding."** <br>
   You can type `y` to continue anyway.

   ```bash
   Step 1: Configure SITE_URL
   Enter the URL of your local web server ('http://localhost:3000') # You can leave this default, just press enter
   ```

   **You should not need to override any of the convex files**

   This will set the following environment variables in your Convex Project:

   ```bash
   SITE_URL=...
   JWT_PRIVATE_KEY=...
   JWKS=...
   ```

   You can view these in your Convex Project under Settings -> Environment Variables.

   Besides these, you will also need to set up the Github and Google auth provider keys.

   ### First we can set up the Github Provider:

   Open your Github profile Settings, click on the Developer Settings in the sidebar, then click on OAuth Apps, and finally New OAuth App.

   Now, visit your Convex Dashboard Project -> Settings -> URL & Deploy Key, open the dropdown `Show development credentials` and copy the `HTTP Actions URL`.

   For the `Application name` you can name it whatever you wish, but for the sake of consistency I call mine `dev-teams`.

   For the `Homepage URL` field, you can paste the link you just copied into it.

   For the `Authorization callback URL` field you'll need to paste the `HTTP Actions URL` link you copied and add `/api/auth/callback/github`. <br>
   (E.g. if your HTTP Actions URL was `https://fast-horse-123.convex.site` you will need to type `https://fast-horse-123.convex.site/api/auth/callback/github`)

   Now you can click `Register application`.

   You can now copy your `Client ID`, and also click the button to generate a new `Client Secret`. Make note of both of these and run the following commands

   ```bash
   bun x convex env set AUTH_GITHUB_ID=your-github-client-id
   bun x convex env set AUTH_GITHUB_SECRET=your-github-client-secret
   ```

   You should now have your Github provider enabled!

   ### Finally we can set up the Google Provider:

   Open up your [Google Cloud Console](https://console.cloud.google.com/) and create a new project. Again, you can name it whatever you wish but for the sake of consistency I named mine `dev-teams`.

   Once your project is created, you can click `Select Project` and then access the `API & Services` menu.

   Now we need to set up the `OAuth consent screen`, which you can access from the sidebar.

   Go ahead and select the `External` option and click `Create`.

   Give your app a name, your own support email, and skip the App Logo and App domain sections.

   Under the `Authorized domains`, click ADD DOMAIN and paste your `HTTP Actions URL` from before without `https://`. So using the example from before it would be `fast-horse-123.convex.site`.

   For the `Developer contact information` you can repeat your own email address.

   Next, click `Save and Continue`. You can skip all of the remaining `Scopes` and `Test users` sections.

   Finally, you can go to the `Credentials` and click `Create Credentials` -> `OAuth client ID`.

   Inside the form, select `Web Application` for your Application Type, the name doesn't matter (I left it default), the Authorized JavaScript Origins will be `https://localhost:3000`, and the Authorized Redirect URIs will be your `HTTP Actions URL + /api/auth/callback/google`.
   (so using the example from before `https://fast-horse-123.convex.site/api/auth/callback/google`).

   Go ahead and click Create and copy the Client ID and Client Secret and run the following commands sequentially:

   ```bash
   bun x convex env set AUTH_GOOGLE_ID=your-google-client-id
   bun x convex env set AUTH_GOOGLE_SECRET=your-google-client-secret
   ```

   **Ensure that your Convex Dashboard has all the following environment variables:**

   ```bash
   AUTH_GITHUB_ID=...
   AUTH_GOOGLE_SECRET=...
   AUTH_GOOGLE_ID=...
   AUTH_GOOGLE_SECRET=...
   SITE_URL=...
   JWT_PRIVATE_KEY=...
   JWKS=...
   ```

6. **Run the development server**:

   Finally, you can run the development server!

   Open up a split terminal and run these commands in seperate terminals:

   ```bash
   bun x convex dev
   # and
   bun run dev --turbo
   ```

   Then, visit `http://localhost:3000`.

   To quote Walt Disney: _“The way to get started is to quit talking and begin doing.”_ This guide will get your project up and running smoothly—best of luck with it!

## Usage

1. **Login**: Start by loggin in with your choice of Google, Github, or regular email sign-in.
2. **Create a workspace**: If you havn't already made or joined a workspace, start by creating a new workspace and invite team members using invite codes.
3. **Channels**: Set up channels within the workspace to organize team conversations.
4. **Direct messaging**: Use 1:1 direct messaging for private communication.
5. **Threads & Reactions**: Engage with messages through replies and reactions.
6. **Roles and Permissions**: Assign roles to team members and manage permissions.
