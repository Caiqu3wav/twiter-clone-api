import { NextResponse } from "next/server";
import prisma from "../../../../prisma";
import { connectDb } from "../../../../utils"
import bcrypt from "bcrypt"
export const POST = async (req: Request) => {
        try { 
            const {email, password} = await req.json();

            if(!email && !password){
                return NextResponse.json({ error: "Invalid Data" }, { status: 422 })
            }
            await connectDb();
            const existingUser = await prisma.user.findFirst({ where: { email } });
            if (!existingUser) {
                return NextResponse.json({ message: "user not registered" },
                { status: 401 }
                );
            }
            const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordCorrect){
                return NextResponse.json({ error: "Invalid Password" }, { status: 403 })
            }
            return NextResponse.json({ message: "Logged In" }, { status: 200 });
        } catch (error: any) {
            console.log(error);
            return NextResponse.json({ error: error.message }, { status: 500 })
        } finally {
            await prisma.$disconnect();
        }
};