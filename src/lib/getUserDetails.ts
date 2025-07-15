
"use server"
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Session } from "next-auth";

interface UserDetail {
  id?: number;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export async function getUserDetail(): Promise<UserDetail | null> {
  const session: Session | null = await getServerSession(authOptions);
  console.log("session", session);

  if (session?.user && session.user.email) {
    const { name, email, image } = session.user;

    const id = (session.user as any).id;

    return { id, name, email, image };
  }

  return null;
}
// now if you want user id anywhere toh use this function for eg :
//see this
