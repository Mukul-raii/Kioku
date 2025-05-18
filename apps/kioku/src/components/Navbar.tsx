"use client";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { ButtonColorful } from "./ui/button-colorful";
import Link from "next/link";

export default function Navbar() {
  const { isSignedIn, user, isLoaded } = useUser();
  const pathName = usePathname();
  const router = useRouter();




  if (!isLoaded) {
    return (
      <div className="fixed top-0 left-0 w-full h-16 flex items-center justify-between bg-gray-900 bg-opacity-95 backdrop-blur-sm">
        <div className="animate-pulse flex space-x-4">
          <div className="h-3 w-24 bg-gray-600 rounded"></div>
          <div className="h-3 w-24 bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 w-full h-16  bg-opacity-90 backdrop-blur-sm text-white shadow-lg z-50">
      <div className=" mx-auto h-full flex items-center justify-between px-6 md:px-8 lg:px-12">
        <h1
          onClick={() => router.push("/")}
          className="text-4xl  md:text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent cursor-pointer"
        >
          Kioko
        </h1>

        <div className="flex items-center gap-6">
          {pathName === "/" && (
            <div className="hidden md:flex items-center gap-8 text-base font-medium ">
              <button className="hover:text-white  transition-colors">
                Product
              </button>
              <button className="hover:text-white  transition-colors">
                How it works
              </button>
              <button className="hover:text-white  transition-colors">
                Testimonials
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm text-white hover:text-indigo-200 transition-colors">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors">
                  Sign up
                </button>
              </SignUpButton>
            </SignedOut>

            {pathName === "/" && isSignedIn ? (
              <Link href="/userdashboard">
                <div className="flex cursor-pointer items-center gap-2">
                  <ButtonColorful
                    className="rounded-4xl cursor-pointer"
                    label="Dashboard"
                  />
                </div>
              </Link>
            ) : (
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-12 h-12 ",
                    },
                  }}
                />
              </SignedIn>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
