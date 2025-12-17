"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "Invalid email or password" };
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return { error: "Invalid email or password" };
    }

    await createSession(user.id);
    redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    return { error: "An error occurred during login" };
  }
}

