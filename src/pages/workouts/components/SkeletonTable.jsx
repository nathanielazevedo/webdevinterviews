import Skeleton from '@mui/material/Skeleton'

const SkeletonTable = () => {
  const getRandomWidth = () => `${Math.floor(Math.random() * 10) + 40}%`
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <tr key={item} index={item}>
          <td align='center' id='type'>
            <Skeleton variant='text' width='30%' />
          </td>
          <td align='left' id='template'>
            <Skeleton variant='text' width={getRandomWidth()} />
          </td>
          <td align='center' id='difficulty'>
            <Skeleton variant='text' width='50%' />
          </td>
          <td align='center' id='creator'>
            <Skeleton variant='text' width='90%' />
          </td>
        </tr>
      ))}
    </>
  )
}

export default SkeletonTable
