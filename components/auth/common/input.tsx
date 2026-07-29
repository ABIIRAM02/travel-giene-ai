import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = ({ label, type = "text", id, error, ...rest }: InputProps) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={id} className="pl-1">
        {label}
      </label>

      <input
        id={id}
        type={type}
        className={`px-4 py-3 w-full rounded-full border shadow ${
          error ? "border-red-500" : "border-gray-200"
        }`}
        {...rest}
      />


      {error && (
        <p className="pl-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;