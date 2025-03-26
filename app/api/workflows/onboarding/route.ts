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
const SEVEN_DAYS_IN_MS = 7 * ONE_DAY_IN_MS; 

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


  if (timeDifference > THREE_DAYS_IN_MS && timeDifference <= 30 * ONE_DAY_IN_MS) {
    return "non-active";
  }

  return "active";
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload;

  await context.run("new-signup", async () => {
    await sendEmail({
      email,
      subject: "Welcome to the Platform!",
      message: emailTemplate(
        fullName, 
        "Welcome to the Platform!", 
        `<p>Hello ${fullName},</p><p>We're excited to have you with us. Explore our curated collections and enjoy an intuitive browsing experience.</p>`),
    });
  });

  // Wait for 3 days.
  await context.sleep("wait-for-3-days", THREE_DAYS_IN_MS);

  // Check user state after 3 days and send appropriate email.
  const stateAfter3Days = await context.run("check-user-state", async () => {
    return await getUserState(email);
  });

  if (stateAfter3Days === "non-active") {
    await context.run("send-email-non-active", async () => {
      await sendEmail({
        email,
        subject: "Are you still there?",
        message: emailTemplate(
          fullName,
          "Are you still there?",
          `<p>Hey ${fullName},</p><p>We miss you. Are you still active on our platform?</p>`
        ),
      });
    });
  } else if (stateAfter3Days === "active") {
    await context.run("send-email-active", async () => {
      await sendEmail({
        email,
        subject: "Welcome Back!",
        message: emailTemplate(
          fullName,
          "Welcome Back!",
          `<p>Welcome Back ${fullName}!</p><p>Thanks for staying active on our platform.</p>`
        ),
      });
    });
  }

  // Wait an additional 7 days (10 days since login).
  await context.sleep("wait-for-10-days", SEVEN_DAYS_IN_MS);

  // Check user state after 10 days and send another email.
  const stateAfter10Days = await context.run("check-user-state", async () => {
    return await getUserState(email);
  });

  if (stateAfter10Days === "non-active") {
    await context.run("send-email-non-active-10days", async () => {
      await sendEmail({
        email,
        subject: "We've Missed You!",
        message: emailTemplate(
          fullName,
          "We've Missed You!",
          `<p>Hey ${fullName},</p><p>It's been 10 days since we last saw you. We hope to see you back soon!</p>`
        ),
      });
    });
  } else if (stateAfter10Days === "active") {
    await context.run("send-email-active-10days", async () => {
      await sendEmail({
        email,
        subject: "Great to See You're Active!",
        message: emailTemplate(
          fullName,
          "Great to See You're Active!",
          `<p>Hi ${fullName},</p><p>Thanks for staying active with us!</p>`
        ),
      });
    });
  }


});