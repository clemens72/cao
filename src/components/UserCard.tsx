import Image from 'next/image'

const UserCard = ({type}:{type:string}) => {
  return (
    <div className='rounded-2xl even:bg-orange odd:bg-lightorange p-4 flex-1 min-w-[130px]'>
        <div className='flex justify-between items-center'>
            <span></span>
          <Image src="/more.png" alt="more" width={20} height={20}/>
        </div>
        <h1 className='text-2xl font-semibold my-4'>1,234</h1>
        <h2 className='capitalize text-sm font-medium'>{type}</h2>
    </div>
  )
}

export default UserCard