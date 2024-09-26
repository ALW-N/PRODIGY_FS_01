import {connect} from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse} from 'next/server';

connect()

export async function POST(request:NextRequest){
    try {
        const reqBody = await request.json()
        const {token}   = reqBody
        console.log(token);


        const user = await User.findOne({verifyToken: token, verifyTokenExpiry: {$gt: Date.now()}})
        
        if(!user){
            return NextResponse.json({error: 'Invalid or expired token'}, {status: 400})
        }
        console.log(user)

        user.isVerified = true
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save()

        return NextResponse.json({message: "Email Verified sucessfully", sucess: true}, {status: 500})
   



    } catch (error: unknown) {
        let errorMessage = 'An unknown error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({error: errorMessage}, {status: 500})
    }
}
