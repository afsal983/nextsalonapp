import { NextRequest, NextResponse } from "next/server";

import { decrypt } from "src/utils/encrypt";

const baseUSRL = process.env.NEXT_PUBLIC_HOST_API;

export async function GET(request: NextRequest) {
  // Get the cookies
  const cookieStore = request.cookies;
  const sessionCookie = cookieStore.get("session")?.value;

  const { searchParams } = new URL(request.url);

  // Accessing query parameters
  const startDate = searchParams.get("startdate");
  const endDate = searchParams.get("enddate");

  if (sessionCookie === undefined) {
    const res = {
      Title: "NOK",
      status: 401,
      message: "Cookie missing",
    };
    return NextResponse.json(res, { status: 401 });
  }

  const cookiedata = await decrypt(sessionCookie);
  if (cookiedata === undefined) {
    const res = {
      Title: "NOK",
      status: 401,
      message: "Cookie missing",
    };
    return NextResponse.json(res, { status: 401 });
  }

  const { token } = cookiedata;
  // Make an HTTP request to your API route with the token in the headers
  const data = await fetch(
    `${baseUSRL}/timekeeper/appointments?startdate=${startDate}&enddate=${endDate}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // Get the data in JSON format
  const response = await data.json();

  if (response?.status === 401) {
    const res = {
      Title: "NOK",
      status: 401,
      message: response?.message,
    };
    return NextResponse.json(res, { status: 401 });
  }

  // Send the sucessful response back
  return NextResponse.json(response, { status: 201 });
}

export async function POST(request: NextRequest, response: NextResponse) {
  const body = await request.json();

  // Get the cookies
  const cookieStore = request.cookies;
  const sessionCookie = cookieStore?.get("session")?.value;

  if (sessionCookie === undefined) {
    const res = {
      Title: "NOK",
      status: 401,
      message: "Cookie missing",
    };
    return NextResponse.json(res, { status: 401 });
  }

  const cookiedata = await decrypt(sessionCookie);

  if (cookiedata === undefined) {
    const res = {
      Title: "NOK",
      status: 401,
      message: "Cookie missing",
    };
    return NextResponse.json(res, { status: 401 });
  }

  const { token } = cookiedata;

  const data = await fetch(`${baseUSRL}/timekeeper/appointment?notify=0`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  // Get the data in JSON format
  const apiResponse = await data.json();

  if (apiResponse?.status === 401) {
    const res = {
      Title: "NOK",
      status: 401,
      message: apiResponse?.message,
    };
    return NextResponse.json(res, { status: 401 });
  }

  // Send the sucessful response back
  return NextResponse.json(apiResponse, { status: 201 });
}

export async function PUT(request: NextRequest, response: NextResponse) {
  const body = await request.json();

  // Get the cookies
  const cookieStore = request.cookies;
  const sessionCookie = cookieStore?.get("session")?.value;

  if (sessionCookie === undefined) {
    const res = {
      Title: "NOK",
      status: 401,
      message: "Cookie missing",
    };
    return NextResponse.json(res, { status: 401 });
  }

  const cookiedata = await decrypt(sessionCookie);

  if (cookiedata === undefined) {
    const res = {
      Title: "NOK",
      status: 401,
      message: "Cookie missing",
    };
    return NextResponse.json(res, { status: 401 });
  }

  console.log(body.id);
  console.log(body);
  const { token } = cookiedata;

  const data = await fetch(
    `${baseUSRL}/timekeeper/appointment/${body.id}?notify=0`,
    {
      method: "UPDATE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  );

  // Get the data in JSON format
  const apiResponse = await data.json();

  if (apiResponse?.status === 401) {
    const res = {
      Title: "NOK",
      status: 401,
      message: apiResponse?.message,
    };
    return NextResponse.json(res, { status: 401 });
  }

  // Send the sucessful response back
  return NextResponse.json(apiResponse, { status: 201 });
}