
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

    if (!privateKey || !publicKey) {
      return NextResponse.json(
        { error: 'ImageKit keys not configured' },
        { status: 500 }
      );
    }

    // Generate authentication parameters
    const token = crypto.randomBytes(20).toString('hex');
    const expire = Math.floor(Date.now() / 1000) + 2400; // Valid for 40 minutes
    
    // Create signature using HMAC-SHA1
    const signature = crypto
      .createHmac('sha1', privateKey)
      .update(token + expire)
      .digest('hex');

    return NextResponse.json({
      token,
      expire,
      signature
    });
  } catch (error) {
    console.error('ImageKit auth error:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth parameters' },
      { status: 500 }
    );
  }
}
