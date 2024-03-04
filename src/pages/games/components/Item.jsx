import { Card, Typography } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useNavigate } from 'react-router-dom'
import LockIcon from '@mui/icons-material/Lock'

const Item = ({ item, basePath, className }) => {
  const navigate = useNavigate()
  return item.public ? (
    <Card
      elevation={0}
      className={`item-container ` + className}
      onClick={() => navigate(basePath + item.id)}
    >
      <div>
        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <Typography color='grey.400' textTransform={'uppercase'}>
            {item.title}
          </Typography>
        </div>
        <Typography color='grey.300' sx={{ fontSize: '14px' }}>
          {item?.description}
        </Typography>
        <Typography variant='caption' color={'grey.500'}>
          {item?.questions?.length && item?.questions?.length + ' Questions'}
        </Typography>
      </div>
      <ArrowForwardIosIcon fontSize='small' sx={{ color: 'grey.500' }} />
    </Card>
  ) : (
    <div className='hidden-item-wrapper'>
      <div className='hidden-item-overlay'></div>
      <div className='item-container'>
        <div>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <Typography color='grey.500'>{item.title}</Typography>
          </div>
          <Typography color='grey.300'>{item?.description}</Typography>
          <Typography variant='caption' color={'grey.500'}>
            {item?.questions?.length && item?.questions?.length + ' Questions'}
          </Typography>
        </div>
        <LockIcon
          fontSize='small'
          sx={{
            color: 'grey.400',
          }}
        />
      </div>
    </div>
  )
}

export default Item
