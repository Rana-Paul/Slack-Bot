import { NextRequest, NextResponse } from "next/server";
import { App } from "@slack/bolt";

// Initialize slack Instance
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const { message }: { message: string } = await request.json();
    await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: process.env.SLACK_CHANNEL!,
      text: message,
    });
    return NextResponse.json({ message: "ok" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
