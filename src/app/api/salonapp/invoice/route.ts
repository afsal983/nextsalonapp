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
  const data = await fetch( `${baseUSRL}/apiserver/invoices?startdate=2024-01-12T03:00:00Z&enddate=2024-07-30T03:45:00Z`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Get the data in JSON format 
  const response = await data.json();

  if(response?.status === 401) {
    const res = {
      Title: 'NOK',
      status: 401,
      message: response?.message
    }
    return NextResponse.json(res, { status: 401 });
  }

  // Send the sucessful response back
  return NextResponse.json(response, { status: 201 });

}

export async function POST(request: NextRequest, response: NextResponse) {

  const body = await request.json();


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
      status: 401,
      message: "Cookie missing"
    }
    return NextResponse.json(res, { status: 401 });
  }

  console.log("ddd")
  console.log(JSON.stringify(body))
  const { token } = cookiedata

    const data = await fetch(`${baseUSRL}/apiserver/instantinvoice?notify=1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    // Get the data in JSON format 
    const apiResponse = await data.json();

    console.log(apiResponse)

    if(apiResponse?.status === 401) {
      const res = {
        Title: 'NOK',
        status: 401,
        message: apiResponse?.message
      }
      return NextResponse.json(res, { status: 401 });
    }
  
    // Send the sucessful response back
    return NextResponse.json(apiResponse, { status: 201 });

}