import { Paper, Skeleton, Typography } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useNavigate } from 'react-router-dom'
import Rating from './Rating'
import LockIcon from '@mui/icons-material/Lock'

const Item = ({ item, basePath, skeleton = false }) => {
  const navigate = useNavigate()
  return (
    <Paper
      elevation={2}
      className='item-container'
      onClick={item?.visible ? () => navigate(basePath + item.id) : null}
    >
      <div>
        <Rating rating={item?.difficulty} />
        {skeleton ? (
          <Skeleton width='100px' />
        ) : (
          <>
            <Typography variant='subtitle1' sx={{ flexGrow: 1 }}>
              {item.title}
            </Typography>
          </>
        )}
        <Typography color='text.secondary' variant='subtitle1'>
          {skeleton ? <Skeleton width='150px' /> : item.description}
        </Typography>
        <div className='skills-wrapper'>
          {item?.skills?.map((skill) => {
            return (
              <Typography key={skill} color='text.secondary'>
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
