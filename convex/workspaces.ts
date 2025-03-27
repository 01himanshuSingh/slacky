import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const generatedCode = ()=>{
  const code = Array.from(
    {length:6},()=> "0123456789abcdefghijklmnpqrstuvwxyz"[Math.floor(Math.random()*36)]
  ).join("");
  return code;
}

export const create  = mutation({
    args:{
        name:v.string()
    },
    handler:async(ctx, args)=> {
          const userId = await getAuthUserId(ctx);
        if(!userId){
            throw new Error('Unauthaurized')
        }
         const joincode = '123456' 
         const workspaceId = await ctx.db.insert('workspaces', {
            name:args.name,
            userId,
            joinCode:generatedCode()
         })

         // sath sath creator by admin ki id bhi bna do 
         await ctx.db.insert('members',{
            userId, // user ki _id
            workspaceId,   // workspace ki _id
            role:'admin'
         })   
         //  sath sath channel bhi bnao 
         await ctx.db.insert('channels',{
          name:'generals',
          workspaceId
         })
         return workspaceId
    },
})

export const get = query({
    args: {}, // No arguments from frontend
    handler: async (ctx) => {
      const userId = await getAuthUserId(ctx); // Get currently logged-in user ID
  
      if (!userId) {
        return []; // If no user ID found, return empty array
      }
  
      // Get all memberships for the current user
      const members = await ctx.db
        .query("members")
        .withIndex("by_user_id", (q) => q.eq("userId", userId))
        .collect(); // ✅ Converts async iterator to an array
  
      // Extract workspace IDs from the member records
      const workspaceIds = members.map((member) => member.workspaceId);
  
      // Fetch all workspaces that match the extracted IDs
      const workspaces = await Promise.all(
        workspaceIds.map((workspaceId) => ctx.db.get(workspaceId))
      );
  
      // Filter out any `null` workspaces in case some don't exist
      return workspaces.filter((workspace) => workspace);
    },
  });
  
export const getId = query({
    args:{id:v.id("workspaces")},
    handler: async(ctx, args)=> {
        const userId = await getAuthUserId(ctx);
        if(!userId){  
            throw new Error('Unauthorized')
        }

        const member = await ctx.db.query("members")
        .withIndex('by_workspace_id_by_user_id', (q) => q.eq("userId", userId).eq("workspaceId", args.id)).unique()

        if(!member){
          return null;
        }

        return await ctx.db.get(args.id)
    },

})

export const update = mutation({
  args: {
    id: v.id('workspaces'),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const member = await ctx.db
      .query("members")
      .withIndex('by_workspace_id_by_user_id', (q) => 
        q.eq("userId", userId).eq("workspaceId", args.id)
      )
      .unique();

    if (!member || member.role.toLowerCase() !== 'admin') {
      throw new Error('Unauthorized');
    }

    const workspace = await ctx.db.get(args.id);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const updatedWorkspace = await ctx.db.patch(args.id, { name: args.name });
    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id('workspaces'), // Workspace ID to delete
  },

  handler: async (ctx, args) => {
    // Step 1: Authenticate user
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized: User not authenticated');
    }

    // Step 2: Check if the user is an admin of the workspace
    const member = await ctx.db.query("members")
      .withIndex('by_workspace_id_by_user_id', (q) => 
        q.eq("userId", userId).eq("workspaceId", args.id)
      ).unique();

    if (!member || member.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can delete workspaces');
    }

    // Step 3: Fetch all members connected to this workspace
    const members = await ctx.db.query('members')
      .withIndex('by_workspace_id', (q) => q.eq('workspaceId', args.id))
      .collect();

    // Step 4: Delete all members associated with this workspace
    await Promise.all(members.map(member => ctx.db.delete(member._id)));

    // Step 5: Delete the workspace itself
    await ctx.db.delete(args.id);

    return args.id;
  },
});

export const newJoiCode = mutation({
  //new code gegnrate krane ke lie 
  args:
  {workspaceId:v.id('workspaces')
  },
  handler:async(ctx, args)=> {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized: User not authenticated');
    }
    const member = await ctx.db.query("members")
    .withIndex('by_workspace_id_by_user_id', (q) => 
      q.eq("userId", userId).eq("workspaceId", args.workspaceId)
    ).unique();
    if(!member || member.role !== 'admin' ){
      throw new Error('Unauthorized')
    }
        const joinCode = generatedCode()
  await ctx.db.patch(args.workspaceId,{
    joinCode
  })
  return args.workspaceId
      },
})



export const join = mutation({
  args:{
    joinCode:v.string(),
    workspaceId:v.id('workspaces')
  },
  handler:async(ctx, args) =>{
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized: User not authenticated');
    }
    const workspace = await ctx.db.get(args.workspaceId);
    // check from database that id of workspace is present or not 
    if(!workspace){
      throw new Error('workspace is not found')
    }
    // Now compare nvite Code 
    if(workspace.joinCode !== args.joinCode.toLowerCase()){
      throw new Error('Join Code is not match')
    }

    // Agar join code bhi sahi nil gaya then check ap phele se is workspace ke member to nahi 
    const exitingMember = await ctx.db.query("members")
    .withIndex('by_workspace_id_by_user_id', (q) => 
      q.eq("userId", userId).eq("workspaceId", args.workspaceId)
    ).unique();

    if(exitingMember){
      throw new Error('You Already is an active member of this workspace')
    }
    // Agar phlele ke joined nahi ho to new joined cration
    await ctx.db.insert('members',{
      userId,
      workspaceId:workspace._id,
      role:'member'
    })
    return workspace._id
  },
})

export const getInfoId = query({
args:{
  id:v.id('workspaces')
},
handler:async(ctx, args) =>{
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error('Unauthorized: User not authenticated');
  }
  // member check kra ha new bnda phele se exist member to nahi 
  const Member = await ctx.db.query("members")
  .withIndex('by_workspace_id_by_user_id', (q) => 
    q.eq("userId", userId).eq("workspaceId", args.id)
  ).unique();

  const workspace = await ctx.db.get(args.id)
  return{
    name:workspace?.name,
    isMember:!!Member
  }
}
})