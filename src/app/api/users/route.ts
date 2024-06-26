import { NextResponse } from "next/server";
import prisma from "../../../../prisma";
import { connectDb } from "../../../../utils"

export const GET = async (req: Request) => {
        try { 
            await connectDb();
            const users = await prisma.user.findMany({include:{tweets: true, _count: true}});
            return NextResponse.json({ users }, { status: 200 });
        } catch (error: any) {
            console.log(error);
            return NextResponse.json({ error: error.message }, { status: 500 })
        } finally {
            await prisma.$disconnect();
        }
};