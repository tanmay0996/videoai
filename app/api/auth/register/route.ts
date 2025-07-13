import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "email and password are required" },
        { status: 400 }
      );
    }

    //Check db connection
    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          error: "user already exist",
        },
        {
          status: 500,
        }
      );
    }


    await User.create(
        {
            email,
            password
        }
    )

   return NextResponse.json(
    {message:"User is registered successfully"},
    {status:200}
   )

  } catch (error) {

    console.error("Registration error",error)
    return NextResponse.json(
        {
            error:"Registration failed"
        },
        {status:500}
    )
  }
}
