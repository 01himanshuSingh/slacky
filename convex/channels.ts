import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { error } from "console";

export const get = query({
    args:{
        workspaceId:v.id('workspaces'),  // jonsi workspace id daloge wo uska channel return krega
    },
    handler:async(ctx, args)=> {
         const userId = await getAuthUserId(ctx);
              if(!userId){
                  return []
              }  
            const member = await ctx.db.query('members').withIndex('by_workspace_id_by_user_id',(q)=>
            q.eq('userId',userId).eq('workspaceId',args.workspaceId)).unique();
            if(!member)
            {
                return [];
            }

            //us workspace id se channel extract kro jise mae conneted hu 
            const channels = await ctx.db.query('channels').withIndex('by_workspace_id',(q)=>q.eq('workspaceId',args.workspaceId),).collect(); 
            return channels
    },

})

export const create = mutation({
    args: {
        name: v.string(), // Channel name
      
        workspaceId:v.id('workspaces'), // Workspace ID where the channel will be created
    },
    handler: async (ctx, args) => {
        // 1. Get the authenticated user ID
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error('Unauthorized: User not authenticated');
        }

        // 2. Check if the user is a member of the workspace and has admin rights
        const member = await ctx.db.query('members')
            .withIndex('by_workspace_id_by_user_id', (q) =>
                q.eq('userId', userId).eq('workspaceId', args.workspaceId)
            ).unique();

        if (!member || member.role !== 'admin') {
            throw new Error('Unauthorized: You must be an admin to create a channel');
        }

        // 3. Clean and format the channel name
        const parsedName = args.name.trim().replace(/\s+/g, '-').toLowerCase(); 

        // 4. Check if a channel with the same name already exists in the workspace
        // const existingChannel = await ctx.db.query('channels')
        //     .withIndex('by_workspaceId_and_name', (q) =>
        //         q.eq('workspaceId', args.workspaceId).eq('name', parsedName)
        //     ).unique();

        // if (existingChannel) {
        //     throw new Error(`A channel with the name "${args.name}" already exists in this workspace`);
        // }

        // 5. Insert the new channel
        const channelId = await ctx.db.insert('channels', {
            name: parsedName,
            workspaceId: args.workspaceId
        });

        return channelId;
    },
});


export const getById = query({
    args:{
        id:v.id('channels')
    },
    handler:async(ctx, args)=> {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return null;
        }
        const channel = await ctx.db.get(args.id)
        if(!channel){
            return null;
        }
        // now check this id of channel is reated to you and workspace 
        const member = await ctx.db.query('members')
            .withIndex('by_workspace_id_by_user_id', (q) =>
                q.eq('userId', userId).eq('workspaceId', channel.workspaceId)
            ).unique();

            if(! member)
{
    return null
}
return channel
    },
})

export const update = mutation({
    args: {
        id: v.id("channels"),
        name: v.string(), // Channel name
    },
    handler: async (ctx, args) => {
        // Step 1️⃣: Get the authenticated user ID
        const userId = await getAuthUserId(ctx);
        console.log("🔍 User ID:", userId); // Debugging log

        if (!userId) {
            throw new Error("❌ Unauthorized - No User ID Found");
        }

        // Step 2️⃣: Fetch the channel
        const channel = await ctx.db.get(args.id);
        if (!channel) {
            throw new Error("❌ Channel not found");
        }

        // Step 3️⃣: Check if the user is a member of the workspace
        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_by_user_id", (q) =>
                q.eq("userId", userId).eq("workspaceId", channel.workspaceId)
            )
            .unique();

        console.log("🔍 Member details:", member); // Debugging log

        // Step 4️⃣: Permission check
        if (!member) {
            throw new Error("❌ Unauthorized - User is not a member of this workspace");
        }

        if (member.role !== "admin") {
            throw new Error("❌ Unauthorized - Only admins can update channels");
        }

        // Step 5️⃣: Update the channel
        await ctx.db.patch(args.id, {
            name: args.name,
        });

        console.log("✅ Channel updated successfully:", args.id); // Debugging log
        return args.id;
    },
});



export const remove =mutation({
    args:{
        
        id:v.id('channels'),
        
    },
    handler:async(ctx, args)=> {
        const userId = await getAuthUserId(ctx);
        console.log("🔍 User ID:", userId); // Debugging log

        if (!userId) {
            throw new Error("❌ Unauthorized - No User ID Found");
        }

        // Step 2️⃣: Fetch the channel
        const channel = await ctx.db.get(args.id);
        if (!channel) {
            throw new Error("❌ Channel not found");
        }

        // Step 3️⃣: Check if the user is a member of the workspace
        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_by_user_id", (q) =>
                q.eq("userId", userId).eq("workspaceId", channel.workspaceId)
            )
            .unique();

        console.log("🔍 Member details:", member); // Debugging log

        // Step 4️⃣: Permission check
        if (!member) {
            throw new Error("❌ Unauthorized - User is not a member of this workspace");
        }

        if (member.role !== "admin") {
            throw new Error("❌ Unauthorized - Only admins can update channels");
        }

 await ctx.db.delete(args.id)
// in future we delete message connected all to this channel 

//Now return channelId 
return args.id
    },
})