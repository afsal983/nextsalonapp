import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const baseUSRL = process.env.NEXT_PUBLIC_HOST_API;

export async function DELETE(request: NextRequest, response: NextResponse) {
  const cookieStore = cookies();

  console.log("sssAA");
  // Set the cookie with an expiry date in the past to delete it
  cookieStore.set("session", "", {
    httpOnly: true,
    secure: true,
    expires: new Date("Thu, 01 Jan 1970 00:00:00 GMT"), // Set to past date
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.json({ message: "Cookie deleted" });
}
