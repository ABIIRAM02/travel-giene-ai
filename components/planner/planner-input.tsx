
export const PlannerInput = ({
  icon,
  label,
  error,
  ...registerProps
}: {
  icon: string;
  label: string;
  error?: string;
  [key: string]: any;
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="text-stone-500 text-xs font-medium flex gap-2 items-center">
        <span>{icon}</span>
        <label className="capitalize" htmlFor={label}>
          {label}
        </label>
      </div>
      <input
        id={label}
        className="border border-gray-300 outline-none text rounded-[10px] p-2.5 text-base"
        {...registerProps}
      />
      {error && <p className="pl-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};