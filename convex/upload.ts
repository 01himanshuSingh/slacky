import { mutation } from "./_generated/server";

export const generateUrl = mutation(async (ctx)=>{
    return await ctx.storage.generateUploadUrl();
})