"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearUser, setLoading, setUser } from "@/redux/slices/auth.slice";
import { getCurrentUser } from "@/services/auth.client";
import { ReactNode, useEffect } from "react";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const dispatch = useAppDispatch();

  async function initializeAuth() {
    try {
      const data = await getCurrentUser();
      console.log({data})
      dispatch(setUser(data));
    } catch (err) {
      console.log({ authProviderErr: err });
      dispatch(clearUser());
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
