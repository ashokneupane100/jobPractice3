"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const getIntervieweeAppointments=async()=>{
const user=await currentUser();
if(!user)return[];

const dbUser=await db.user.findUnique({
    where:{clerkUserId:user.id}
    
});

if(!dbUser) return[];



}