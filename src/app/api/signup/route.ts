import { NextResponse } from "next/server";
import prisma from "../../../../prisma";
import { connectDb } from "../../../../utils"
import bcrypt from "bcrypt"

export const POST = async (req: Request) => {
        try { 
            const {name, email, password} = await req.json();

            if(!name && !email && !password){
                return NextResponse.json({ error: "Invalid Data" }, { status: 422 })
            }
            await connectDb();
            const existingUser = await prisma.user.findFirst({ where: { email } });
            if (existingUser) return NextResponse.json({ message: "User already registered, please login" }, { status: 403 })
            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await prisma.user.create({data:{name, email, password: hashedPassword}});
            return NextResponse.json({ user }, { status: 200 });
        } catch (error: any) {
            console.log(error);
            return NextResponse.json({ error: error.message }, { status: 500 })
        } finally {
            await prisma.$disconnect();
        }
};