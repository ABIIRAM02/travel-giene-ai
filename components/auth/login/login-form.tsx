"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, LoginInput } from "@/validators/auth.schema";
import Input from "../common/input";
import { login } from "@/services/client/auth.client";
import { useRouter, useSearchParams } from "next/navigation";
import { redirectDestination } from "@/utils/login-helper";

const Loginform = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data);
      redirectDestination(searchParams, router);
    } catch (err) {
      console.log({ loginErr: err });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full gap-2 pt-2"
    >
      <Input
        placeholder="abii@gmail.com"
        label="Email"
        type="email"
        id="login-email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        placeholder="At least 8 characters"
        label="Password"
        type="password"
        id="login-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="flex text-gray-700 gap-2 mx-4 my-2 items-center">
        <input type="checkbox" />
        <p>Remember me for 30 days</p>
      </div>
      <button disabled={isSubmitting} className="w-full rounded-full bg-neutral-800 text-base py-3 text-white cursor-pointer">
        Sign in
      </button>
    </form>
  );
};

export default Loginform;
