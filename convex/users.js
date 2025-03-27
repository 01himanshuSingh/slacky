import { query } from './_generated/server';
import { getAuthUserId } from "@convex-dev/auth/server";  // Import getAuthUserId

export const getUserData = query({
  args: {},
  handler: async (ctx) => {
    // Use getAuthUserId instead of getUserId
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;  // If the user is not authenticated (no userId), return null
    }

    // Optionally, fetch user data from the database using the userId
    const userData = await ctx.db.get(userId);  // Assuming you have a `users` collection

    return userData;  // Return user data (e.g., name, email)
  },
});
