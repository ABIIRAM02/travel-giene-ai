
import { SIDE_BAR_OPTIONS } from '@/utils/constants'
import GradintWrapper from '../ui/gradient-wrapper'

const Sidebar = () => {

    const defaultSelection = 'Dashboard'

  return (
    <main className='border-r w-1/6 ' >
        <div className='h-16 border-b px-4 flex justify-center flex-col' >
                <h2>TravelGenie</h2><span>AI</span>
        </div>
        <p className='uppercase font-semibold text-[11px] px-7 pt-6 pb-3 text-gray-500' >Workspace</p>
        <section className='px-4 flex flex-col gap-2'>
                {
                    SIDE_BAR_OPTIONS.map( option => (
                        <GradintWrapper key={option.name} option={option} selected={defaultSelection === option.name} />
                    ) )
                }
        </section>
    </main>
  )
}

export default Sidebar