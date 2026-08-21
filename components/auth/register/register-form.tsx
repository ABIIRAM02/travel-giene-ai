"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../common/input";
import { RegisterInput, registerSchema } from "@/validators/auth.schema";
import { useForm } from "react-hook-form";
import { registerAPI } from "@/services/client/auth.client";
import { useRouter, useSearchParams } from "next/navigation";
import { redirectDestination } from "@/utils/login-helper";

const RegisterForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await registerAPI(data);
      redirectDestination(searchParams, router);
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full gap-2 pt-2"
    >
      <Input
        placeholder="Abiram"
        label="Full name"
        type="text"
        id="register-name"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        placeholder="abii@gmail.com"
        label="Email"
        type="email"
        id="register-email"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        placeholder="At least 8 characters"
        label="Password"
        type="password"
        id="register-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Input
        placeholder="********"
        label="Confirm password"
        type="password"
        id="register-confirm-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <div className="flex text-gray-700 gap-2 mx-4 my-2 items-center">
        <input type="checkbox" />
        <p>
          I agree to the{" "}
          <span className="text-blue-400">tearms and condititons</span>
        </p>
      </div>
      <button
        disabled={isSubmitting}
        className="w-full rounded-full bg-neutral-800 text-base py-3 text-white"
      >
        Create Account
      </button>
    </form>
  );
};

export default RegisterForm;
