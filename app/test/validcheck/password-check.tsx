import { comparePassword, hashPassword } from "@/lib/password";

export default async function PasswordCheck() {
    
  const password = "password123";

  const hashedPassword = await hashPassword(password);

  const isValid = await comparePassword(password, hashedPassword);

  return (
    <pre>
      {JSON.stringify(
        {
          password,
          hashedPassword,
          isValid,
        },
        null,
        2
      )}
    </pre>
  );
}