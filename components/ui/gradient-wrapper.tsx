
interface WrapperProp {
    option: {
        name: string
        icon: any
    },
    selected? : boolean
    classname? : string
}

const GradintWrapper = ({ option, selected = true, classname} : WrapperProp) => {


  return (
    <div className={`${selected ? 'bg-gradient-primary text-background' : 'text-foreground'} rounded-full py-2.5 px-5 flex items-center gap-2 ${classname}`} >
        <span>{option.icon}</span>
        <span className="font-semibold" >{option.name}</span>
    </div>
  )
}

export default GradintWrapper