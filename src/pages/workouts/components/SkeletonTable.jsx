import Skeleton from '@mui/material/Skeleton'

const SkeletonTable = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {[1, 2, 3, 4, 5].map((workoutData) => {
        return (
          <div className='item-container'>
            <div>
              <div
                style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
              >
                <Skeleton width='100px' />
                <Skeleton width='100px' />
              </div>
              <Skeleton />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SkeletonTable
