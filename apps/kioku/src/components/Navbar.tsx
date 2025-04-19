"use client";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useEffect } from "react";
import { signIn } from "@/app/actions/auth";
import Image from "next/image";
import logo from "../../public/logo.webp";

export default function Navbar() {
  const { user } = useUser();

  useEffect(() => {
    const checkUser = async () => {
      if (user) {
        try {
          const res = await signIn(user);
        } catch (error) {
          console.error("Error checking user:", error);
        }
      }
    };
    checkUser();
  }, [user]);

  return (
    <div className="flex justify-between gap-2 ">
      <h1 className="text-2xl p-1 font-sans font-bold">Kioko</h1>
      <div className="flex p-1 flex-row justify-around gap-16">
        <p>Product</p>
        <p>How it works</p>
        <p>Testimonials</p>
      </div>
      <div className="flex justify-between gap-3 px-4">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}
