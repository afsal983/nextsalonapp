import { NextRequest, NextResponse } from "next/server";

import { decrypt } from "src/utils/encrypt";



const baseUSRL = process.env.NEXT_PUBLIC_HOST_API

export async function GET(request: NextRequest, response: NextResponse) {

  const { pathname } = new URL(request.url);
  const invoiceId = pathname.split('/')[4]

  // Get the cookies
  const cookieStore = request.cookies
  const sessionCookie  = cookieStore?.get('session')?.value

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
      status: 9001,
      message: "Cookie missing"
    }
    return NextResponse.json(res, { status: 401 });
  }

  const { token } = cookiedata


  // Make an HTTP request to your API route with the token in the headers
  const data = await fetch( `${baseUSRL}/apiserver/invoice/${invoiceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });


  // Get the data in JSON format 
  const apiResponse = await data.json();

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

export async function DELETE(request: NextRequest, response: NextResponse) {

  console.log("sdddd")
  const { pathname } = new URL(request.url);
  const serviceId = pathname.split('/')[4]

  // Get the cookies
  const cookieStore = request.cookies
  const sessionCookie  = cookieStore?.get('session')?.value

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
      status: 9001,
      message: "Cookie missing"
    }
    return NextResponse.json(res, { status: 401 });
  }

  const { token } = cookiedata


  // Make an HTTP request to your API route with the token in the headers
  const data = await fetch( `${baseUSRL}/apiserver/product/${serviceId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });


  // Get the data in JSON format 
  const apiResponse = await data.json();

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