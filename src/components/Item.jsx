import { Paper, Skeleton, Typography } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useNavigate } from 'react-router-dom'
import Rating from './Rating'
import LockIcon from '@mui/icons-material/Lock'

const Item = ({ item, basePath, skeleton = false }) => {
  const navigate = useNavigate()
  return (
    <Paper
      elevation={item?.visible || skeleton ? 1 : 0.5}
      className='item-container'
      onClick={item?.visible ? () => navigate(basePath + item.id) : null}
    >
      <div>
        <div className='item-text-wrapper'>
          {skeleton ? (
            <Skeleton width='100px' />
          ) : (
            <>
              <Typography variant='subtitle1'>{item.title}</Typography>
              <Rating rating={item.difficulty} />
            </>
          )}
        </div>
        <Typography color='text.secondary' variant='subtitle2'>
          {skeleton ? <Skeleton width='150px' /> : item.description}
        </Typography>
        <div className='skills-wrapper'>
          {item?.skills?.map((skill) => {
            return (
              <Typography key={skill} color='text.secondary' variant='caption'>
                #{skill}
              </Typography>
            )
          })}
        </div>
      </div>
      {!skeleton && item?.visible ? <ArrowForwardIosIcon /> : <LockIcon />}
    </Paper>
  )
}

export default Item
