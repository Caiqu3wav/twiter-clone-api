import { NextResponse } from "next/server";
import prisma from "../../../../prisma";
import { connectDb } from "../../../../utils";

export const GET = async (req: Request) => {
        try { 
            await connectDb();
            const tweets = await prisma.tweets.findMany();
            return NextResponse.json({ tweets }, { status: 200 });
        } catch (error: any) {
            console.log(error);
            return NextResponse.json({ error: error.message }, { status: 500 })
        } finally {
            await prisma.$disconnect();
        }
};

export const POST = async (req: Request) => {
    try { 
        const {tweet, userId} = await req.json();

        if(!tweet && !userId){
            return NextResponse.json({ error: "Invalid Data" }, { status: 422 })
        }
        await connectDb();
        const user = await prisma.user.findFirst({ where: {id: userId} });
        if(!user){
            return NextResponse.json({ message: "Invalid User" }, { status: 401 })
        }
        const newTweet = await prisma.tweets.create({data:{tweet, userId}})
        return NextResponse.json({ tweet: newTweet }, { status: 201 })
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    } finally {
        await prisma.$disconnect();
    }
};