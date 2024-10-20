import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { encrypt, decrypt } from "src/utils/encrypt";

const baseUSRL = process.env.NEXT_PUBLIC_HOST_API;

export async function POST(request: NextRequest, response: NextResponse) {
  const cookieStore = request.cookies;
  const sessionCookie = cookieStore.get("session")?.value;

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

  const refreshtokendata = {
    refresh_token: cookiedata.refresh_token,
  };

  // Send the API request to backend
  const data = await fetch(`${baseUSRL}/secretkeeper/refreshtoken`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(refreshtokendata),
  });

  // Get the data in JSON format
  const userdata = await data.json();

  const { token, refresh_token } = userdata;

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Encryt the session data to use it in the cookie
  const sessionData = { token, refresh_token };
  const encryptedSessionData = await encrypt(sessionData);

  // Set encrypted cookies for the browser
  cookies().set("session", encryptedSessionData, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
  return NextResponse.json(userdata, { status: 201 });
}
