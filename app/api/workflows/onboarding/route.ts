import { serve } from "@upstash/workflow/nextjs";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/workflow";
import { emailTemplate } from "@/lib/emailTemplate";

type UserState = "non-active" | "active";

type InitialData = {
  email: string;
  fullName: string;
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const THREE_DAYS_IN_MS = 3 * ONE_DAY_IN_MS;
const THIRTY_DAYS_IN_MS = 30 * ONE_DAY_IN_MS;

const getUserState = async (email: string): Promise<UserState> => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length === 0) return "non-active";

  const lastActivityDate = new Date(user[0].lastActivityDate!);
  const now = new Date();
  const timeDifference = now.getTime() - lastActivityDate.getTime();

  if (timeDifference > THREE_DAYS_IN_MS && timeDifference <= THIRTY_DAYS_IN_MS) {
    return "non-active";
  }

  return "active";
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload;

  await context.run("new-signup", async () => {
    await sendEmail({
      email,
      subject: "Welcome to Our Platform",
      message: emailTemplate(
        fullName, 
        "Welcome to Our Platform", 
        `<p>Dear ${fullName},</p>
         <p>Thank you for joining our platform. We are delighted to have you. Explore our features and learn more about how we can support your goals.</p>`
      ),
    });
  });

  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3); 

  const stateAfter3Days = await context.run("check-user-state", async () => {
    return await getUserState(email);
  });

  if (stateAfter3Days === "non-active") {
    await context.run("send-email-non-active", async () => {
      await sendEmail({
        email,
        subject: "We Value Your Presence",
        message: emailTemplate(
          fullName,
          "We Value Your Presence",
          `<p>Dear ${fullName},</p>
           <p>We noticed you haven’t been active recently. If you need any assistance or have questions, please let us know. We’re here to help!</p>`
        ),
      });
    });
  } else if (stateAfter3Days === "active") {
    await context.run("send-email-active", async () => {
      await sendEmail({
        email,
        subject: "Thank You for Your Engagement",
        message: emailTemplate(
          fullName,
          "Thank You for Your Engagement",
          `<p>Dear ${fullName},</p>
           <p>Thank you for being active on our platform. We're thrilled to see your engagement and are here to support you every step of the way.</p>`
        ),
      });
    });
  }

  await context.sleep("wait-for-10-days", 60 * 60 * 24 * 7);

  const stateAfter10Days = await context.run("check-user-state", async () => {
    return await getUserState(email);
  });

  if (stateAfter10Days === "non-active") {
    await context.run("send-email-non-active-10days", async () => {
      await sendEmail({
        email,
        subject: "We’ve Missed You",
        message: emailTemplate(
          fullName,
          "We’ve Missed You",
          `<p>Dear ${fullName},</p>
           <p>It’s been a while since we last saw you on our platform. We would love to have you back—please reach out if there is anything we can do to assist.</p>`
        ),
      });
    });
  } else if (stateAfter10Days === "active") {
    await context.run("send-email-active-10days", async () => {
      await sendEmail({
        email,
        subject: "Thank You for Staying Active",
        message: emailTemplate(
          fullName,
          "Thank You for Staying Active",
          `<p>Dear ${fullName},</p>
           <p>Thank you for your continued engagement. We appreciate your loyalty and look forward to bringing you more value in the coming days.</p>`
        ),
      });
    });
  }
});