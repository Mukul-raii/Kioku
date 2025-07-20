'use client';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { ButtonColorful } from './ui/button-colorful';
import Link from 'next/link';
import { useEffect } from 'react';
import { signIn } from '@/app/actions/auth';
import { SidebarLayout } from './sidebar';
import { useSidebar } from '@/contexts/SidebarContext';

export default function Navbar() {
  const { isSignedIn, user, isLoaded } = useUser();
  const pathName = usePathname();
  const { isCollapsed } = useSidebar();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const createUser = async () => {
        try {
          console.log('Calling signIn action...');
          await signIn({
            email: user.emailAddresses[0]?.emailAddress || '',
            name: user.fullName || '',
            imgUrl: user.imageUrl || '',
            userId: user.id,
          });
        } catch (error) {
          console.error('Error creating user:', error);
        }
      };

      createUser();
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) {
    return (
      <div className="fixed top-0 left-0 w-full h-16 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 md:px-8 lg:px-12">
        <div className="animate-pulse flex space-x-4">
          <div className="h-8 w-24 bg-gray-300 rounded"></div>
        </div>
        <div className="animate-pulse flex space-x-2">
          <div className="h-8 w-20 bg-gray-300 rounded"></div>
          <div className="h-8 w-20 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Only show sidebar on dashboard pages */}
      {pathName.startsWith('/userdashboard') && <SidebarLayout />}
      
      <div className={`fixed top-0 w-full h-16 ${(pathName !== '/' ) && 'bg-white/80' } backdrop-blur-sm border-b border-gray-200 z-30 transition-all duration-300 ${
        pathName.startsWith('/userdashboard') ? (isCollapsed ? 'pl-16' : 'pl-64') : ''
      }`}>
        <div className="h-full flex items-center justify-between px-6 md:px-8 lg:px-12">
          {/* Logo for non-dashboard pages */}
          {!pathName.startsWith('/userdashboard') && (
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Kioku
              </h1>
            </Link>
          )}

          {/* Navigation links for landing page */}
          {pathName === '/' && (
            <div className="hidden md:flex items-center gap-8 text-base font-medium text-gray-700">
              <button className="hover:text-indigo-600 transition-colors">Product</button>
              <button className="hover:text-indigo-600 transition-colors">How it works</button>
              <button className="hover:text-indigo-600 transition-colors">Testimonials</button>
            </div>
          )}

          {/* Auth buttons and user menu */}
          <div className="flex items-center gap-3 ml-auto">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm text-gray-700 hover:text-indigo-600 transition-colors">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                  Sign up
                </button>
              </SignUpButton>
            </SignedOut>

            {pathName === '/' && isSignedIn ? (
              <Link href="/userdashboard">
                <ButtonColorful className="rounded-lg cursor-pointer" label="Dashboard" />
              </Link>
            ) : (
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: 'w-10 h-10',
                    },
                  }}
                />
              </SignedIn>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
