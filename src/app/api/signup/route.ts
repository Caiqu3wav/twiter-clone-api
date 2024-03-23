import { NextResponse } from "next/server";
import prisma from "../../../../prisma";
import { connectDb } from "../../../../utils"

export const POST = async (req: Request) => {
        try { 
            const {name, email, password} = await req.json();
            await connectDb();
            const users = await prisma.user.create({data:{name, email, password}});
            return NextResponse.json({ users }, { status: 200 });
        } catch (error: any) {
            console.log(error);
            return NextResponse.json({ error: error.message }, { status: 400 })
        } finally {
            await prisma.$disconnect();
        }
};