"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearUser, setLoading, setUser } from "@/redux/slices/auth.slice";
import { getCurrentUser } from "@/services/client/auth.client";
import { ReactNode, useEffect } from "react";
import { appToastError } from "@/lib/errors/toast-error";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const dispatch = useAppDispatch();

  async function initializeAuth() {
    try {
      const { user } = await getCurrentUser();
      dispatch(setUser(user));
    } catch (err:any) {
      dispatch(clearUser());
      appToastError(err)
    } finally {
      dispatch(setLoading(false));
    }
  }

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <div>
      {isLoading ? <span>Loading</span> : children}
    </div>
  );
};

export default AuthProvider;
