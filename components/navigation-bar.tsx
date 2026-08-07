"use client";

import { useAppDispatch } from "@/redux/hooks";
import { clearUser } from "@/redux/slices/auth.slice";
import { logout } from "@/services/auth.client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface registerProp {
  isRegister?: boolean;
  isDashboard?: boolean;
}

const Navbar = ({ isRegister = false, isDashboard = false }: registerProp) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get("redirect");
  const dispatch = useAppDispatch();

  const loginLink = redirect
    ? `/login?redirect=${encodeURIComponent(redirect)}`
    : "/login";

  const registerLink = redirect
    ? `/register?redirect=${encodeURIComponent(redirect)}`
    : "/register";

  const handleLogout = async () => {
    try {
      await logout();

      dispatch(clearUser());

      router.replace("/login");
    } catch (error) {
      console.error({ logoutError: error });

      // Later:
      // toast.error("Unable to log out. Please try again.");
    }
  };

  return (
    <main className="py-4">
      <div className="flex justify-between items-center">
        <p>TravelGenie</p>
        {isDashboard ? (
          <button className="cursor-pointer" onClick={handleLogout}>
            Logout
          </button>
        ) : isRegister ? (
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
