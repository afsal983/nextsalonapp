import { NextRequest, NextResponse } from "next/server";

import { decrypt } from "src/utils/encrypt";

const baseUSRL = process.env.NEXT_PUBLIC_HOST_API;

export async function POST(request: NextRequest) {
  // Get the cookies
  const cookieStore = request.cookies;
  const sessionCookie = cookieStore.get("session")?.value;

  const filterData = await request.json();

  console.log(filterData);

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
    `${baseUSRL}/storyteller/reports/detailedsalesreport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(filterData),
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
