import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mailgun";
import configs from "@/config";

export async function POST(req: Request) {
  try {
    // extract the email content, subject and sender
    const formData = await req.formData();
    const sender = formData.get("From") as string | null;
    const subject = formData.get("Subject") as string | null;
    const html = formData.get("body-html") as string | null;

    // send email to the admin if forwardRepliesTo is set & emailData exists
    if (configs.mailgun.forwardRepliesTo && html && subject && sender) {
      await sendEmail({
        to: configs.mailgun.forwardRepliesTo,
        subject: `${configs?.appName} | ${subject}`,
        html: `<div><p><b>- Subject:</b> ${subject}</p><p><b>- From:</b> ${sender}</p><p><b>- Content:</b></p><div>${html}</div></div>`,
        replyTo: sender,
      });
    }

    return NextResponse.json({});
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e));
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
}
