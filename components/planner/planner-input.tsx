
export const PlannerInput = ({
  icon,
  label,
  error,
  disabled = false,
  containerClassName = "",
  inputClassName = "",
  ...registerProps
}: {
  icon: string;
  label: string;
  error?: string;
  disabled?: boolean;
  containerClassName? : string;
  inputClassName? : string;
  [key: string]: any;
}) => {
  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      <div className="text-stone-500 text-xs font-medium flex gap-2 items-center">
        <span>{icon}</span>
        <label className="capitalize" htmlFor={label}>
          {label}
        </label>
      </div>
      <input
        disabled={disabled}
        id={label}
        className={`${disabled ? "bg-gray-100 cursor-not-allowed border-none" : ""} border border-gray-300 rounded-[10px] p-2.5 text-base`}
        {...registerProps}
      />
      {error && <p className="pl-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};