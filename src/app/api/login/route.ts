import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { encrypt } from "src/utils/encrypt";

const baseUSRL = process.env.NEXT_PUBLIC_HOST_API;

export async function POST(request: NextRequest, response: NextResponse) {
  // Get the credetials
  const body = await request.json();
  const { email, password } = body;

  // POST data preparation
  const logincred = {
    username: email,
    password,
  };

  // Send the API request to backend
  const data = await fetch(`${baseUSRL}/secretkeeper/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(logincred),
  });

  // Get the data in JSON format
  const responseData = await data.json();

  if (responseData?.status !== 200) {
    const res = {
      Title: "NOK",
      status: 400,
      message: responseData?.message,
    };

    // Set encrypted cookies for the browser
    cookies().delete("session");
    return NextResponse.json(res, { status: 400 });
  }

  const { token, refresh_token } = responseData;

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
  console.log("ss");

  return NextResponse.json(responseData, { status: 200 });
}
