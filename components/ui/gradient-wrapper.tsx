import { ButtonHTMLAttributes } from "react"

interface WrapperProp extends ButtonHTMLAttributes<HTMLButtonElement> {
    selected?: boolean
    option: {
        name?: string
        icon?: any
    },
    classname? : string
}
const GradintWrapper = ({ option, selected = true, classname, ...rest} : WrapperProp) => {


  return (
    <button className={`${selected ? 'bg-gradient-primary text-background' : 'text-foreground'} rounded-full py-2.5 px-5 flex items-center gap-2 cursor-pointer ${classname}`} {...rest}>
        <span>{option.icon}</span>
        <span className="font-semibold" >{option.name}</span>
    </button>
  )
}

export default GradintWrapper