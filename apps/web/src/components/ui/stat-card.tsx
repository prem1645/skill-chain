export function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className='bg-white p-6 rounded-lg shadow-lg border-t-4 border-blue-500'>
      <p className='text-sm font-medium text-gray-500'>{title}</p>
      <p className='text-4xl font-extrabold text-gray-900 mt-1'>{value}</p>
    </div>
  )
}
