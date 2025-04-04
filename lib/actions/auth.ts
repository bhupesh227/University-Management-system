// server action file

'use server';
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";
import { headers } from "next/headers";
import ratelimit from "@/lib/ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "@/lib/workflow";
import config from "@/lib/config";


export async function signUp(params : AuthCredentails) {
    const {fullName, email, password, universityId, universityCard} = params;

    const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
    const {success} = await ratelimit.limit(ip);
    if(!success) return redirect("/too-fast");

    const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
    if(existingUser.length > 0){
        return {success: false, error: "User already exists"};
    }

    const hashedPassword = await hash(password, 10);

    try {
        await db.insert(users).values({
            fullName,
            email,
            password: hashedPassword,
            universityId,
            universityCard,
        });

        await workflowClient.trigger({
            url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
            body: {
                email,
                fullName,
            },
        });
        
        await signInWithCredentials({ email, password });
        return {success: true};
    } catch (error) {
        console.log(error, "signup error");
        return {success: false, error: "Something went wrong in signup"};
    }
}

export async function signInWithCredentials(params: Pick<AuthCredentails, "email" | "password">,) {
    const {email, password} = params;

    const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
    const {success} = await ratelimit.limit(ip);
    if(!success) return redirect("/too-fast");

    const NotExistingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
    if(NotExistingUser.length === 0){
        return {success: false, error: "User does not exists, please sign up"};
    }

    try {
        const result = await signIn("credentials",{
            email,
            password,
            redirect: false,
        });
        if (result?.error){
            return{success: false, error: "Invalid email or password" }
        }
        return{ success: true};
    } catch (error) {
        console.log(error, "error in signin");
        return{success:false, error: "signIn error"};
    }
}

