import Skeleton from '@mui/material/Skeleton'

const SkeletonTable = () => {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((index) => {
        return (
          <div className='item-container' key={index}>
            <div>
              <div style={{ display: 'flex', gap: '10px' }}>
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
