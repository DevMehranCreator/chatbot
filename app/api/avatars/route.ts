import { NextResponse } from "next/server";

export async function GET() {
  // Static list for maximum compatibility (no fs, no path)
  // Make sure these files exist in public/avatars/
  const avatars = [
    "/avatars/avatar1.png",
    "/avatars/avatar2.png",
    "/avatars/avatar3.png",
    "/avatars/avatar4.png",
    "/avatars/avatar5.png",
    "/avatars/avatar6.png",
  ];
  return NextResponse.json({ avatars });
}
