import { NextRequest, NextResponse } from "next/server";

import { decrypt } from "src/utils/encrypt";


const baseUSRL = process.env.NEXT_PUBLIC_HOST_API

export async function GET(request: NextRequest) {

  console.log("dddsal")
  // Get the cookies
  const cookieStore = request.cookies
  const sessionCookie  =cookieStore.get('session')?.value
  console.log("ssss")
  const params = {
    "start" : "2024-01-05T00:30:00Z",
    "end": "2024-04-05T01:50:00Z",
    "filtername":"all",
    "filterid":1
  }
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
  console.log(token)
  // Make an HTTP request to your API route with the token in the headers
  const data = await fetch( `${baseUSRL}/storyteller/reports/newsalesreport`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });

  // Get the data in JSON format 
  const response = await data.json();
  console.log(response)
  console.log("CCC")

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
  const { token } = cookiedata

  if(body.id > 0 ) {
    const data = await fetch(`${baseUSRL}/apiserver/product/${body.id}`, {
      method: 'UPDATE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
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
  
    // Send the sucessful response back
    return NextResponse.json(apiResponse, { status: 201 });
  } 

  const data = await fetch(`${baseUSRL}/apiserver/product`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
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