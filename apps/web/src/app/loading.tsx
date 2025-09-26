import { Loader } from '@/components/ui/loader'

export default function Loading() {
  return (
    <>
      <div className='flex h-screen w-screen items-center justify-center'>
        <div className='flex flex-col items-center justify-center'>
          <Loader size={'lg'} />
        </div>
      </div>
    </>
  )
}
