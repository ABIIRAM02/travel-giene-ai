import { ButtonHTMLAttributes } from "react";
import { IconWrapper } from "./icon-wrapper";

interface WrapperProp extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  isBig?: boolean;
  option: {
    name?: string;
    icon?: any;
  };
  classname?: string;
}
const GradintWrapper = ({
  option,
  selected = true,
  isBig = false,
  classname,
  ...rest
}: WrapperProp) => {
  return (
    <button
      className={`${selected ? "bg-gradient-primary text-background " : "text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"} rounded-full py-2.5 px-5 flex items-center gap-2 cursor-pointer ${classname}`}
      {...rest}
    >
      {option.icon && (
        <IconWrapper
          IconName={option.icon}
          style={{
            color: selected ? "var(--accent)" : "var(--sidebar-foreground)",
            height:isBig ? "21px" :  "17px",
            width: isBig ? "21px" : "17px",
          }}
        />
      )}
      <span className="font-semibold">{option.name}</span>
    </button>
  );
};

export default GradintWrapper;
