"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const Navbar = ({ isRegister }: { isRegister: boolean }) => {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const loginLink = redirect
    ? `/login?redirect=${encodeURIComponent(redirect)}`
    : "/login";

  const registerLink = redirect
    ? `/register?redirect=${encodeURIComponent(redirect)}`
    : "/register";

  return (
    <main className="py-4">
      <div className="flex justify-between items-center">
        <p>TravelGenie</p>
        {isRegister ? (
          <p>
            Have account?{" "}
            <Link href={loginLink} className="text-blue-500">
              Sign in
            </Link>
          </p>
        ) : (
          <p>
            New to TravelGenie?{" "}
            <Link href={registerLink} className="text-blue-500">
              Create an account
            </Link>
          </p>
        )}
      </div>
    </main>
  );
};

export default Navbar;
