export function StatCard({ 
  title, 
  value, 
  icon = '📊',
  color = 'blue'
}: { 
  title: string
  value: number
  icon?: string
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow'
}) {
  const colorClasses = {
    blue: 'border-blue-500 bg-blue-50',
    green: 'border-green-500 bg-green-50',
    purple: 'border-purple-500 bg-purple-50',
    red: 'border-red-500 bg-red-50',
    yellow: 'border-yellow-500 bg-yellow-50',
  }

  return (
    <div className={`bg-white p-6 rounded-xl shadow-lg border-t-4 ${colorClasses[color]} hover:shadow-xl transition-shadow`}>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm font-medium text-gray-600 mb-1'>{title}</p>
          <p className='text-3xl font-bold text-gray-900'>{value.toLocaleString()}</p>
        </div>
        <div className='text-3xl opacity-80'>{icon}</div>
      </div>
    </div>
  )
}
