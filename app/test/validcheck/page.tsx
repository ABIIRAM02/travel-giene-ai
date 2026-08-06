import { registerSchema } from "@/validators/auth.schema";
import PasswordCheck from "./password-check";

export default function TestValidatorPage() {
  const result = registerSchema.safeParse({
    name: "Abiram",
    email: "abiram@gmail.com",
    password: "password123",
    confirmPassword: "password123",
  });

  return (
    <>
      <pre>{JSON.stringify(result, null, 2)}</pre>
      <PasswordCheck />
    </>
  );
}
