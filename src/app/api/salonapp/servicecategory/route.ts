import { NextRequest, NextResponse } from "next/server";

import { decrypt } from "src/utils/encrypt";

const baseUSRL = process.env.NEXT_PUBLIC_HOST_API

export async function GET(request: NextRequest) {

  // Get the cookies
  const cookieStore = request.cookies
  const sessionCookie  =cookieStore.get('session')?.value
  
  if (sessionCookie === undefined) {
    const res = {
      Title: 'NOK',
      status: 401,
      message: "Cookie missing"
    }
    return NextResponse.json(res, { status: 401 });
  } 

  const cookiedata  = await decrypt(sessionCookie)
  
  if(cookiedata === undefined) {
    const res = {
      Title: 'NOK',
      status: 401,
      message: "Cookie missing"
    }
    return NextResponse.json(res, { status: 401 });
  }
  
  const { token } = cookiedata

  // Make an HTTP request to your API route with the token in the headers
  const response = await fetch( `${baseUSRL}/apiserver/productcategories?type=1`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Get the data in JSON format 
  const apiResponse = await response.json();

  if(apiResponse?.status === 401) {
    const res = {
      Title: 'NOK',
      status: 401,
      message: apiResponse?.message
    }
    return NextResponse.json(res, { status: 401 });
  }

  return NextResponse.json(apiResponse, { status: 201 });
}