import { Card, Typography } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useNavigate } from 'react-router-dom'
import LockIcon from '@mui/icons-material/Lock'

const Item = ({ item, basePath, className }) => {
  const navigate = useNavigate()
  return item.public ? (
    <Card
      elevation={1}
      className={`item-container ` + className}
      onClick={() => navigate(basePath + item.id)}
    >
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            // gap: '5px',
            alignItems: 'flex-start',
          }}
        >
          <Typography>{item.title}</Typography>
          <Typography color={'text.secondary'}>{item?.description}</Typography>
          <Typography variant='caption' color={'text.secondary'}>
            {item?.questions?.length && item?.questions?.length + ' Questions'}
          </Typography>
        </div>
      </div>
      <ArrowForwardIosIcon fontSize='small' color={'text.icon'} />
    </Card>
  ) : (
    <div className='hidden-item-wrapper'>
      <div className='hidden-item-overlay'></div>
      <Card
        elevation={1}
        className={`item-container ` + className}
        onClick={() => navigate(basePath + item.id)}
      >
        <div>
          <div
            style={{
              display: 'flex',
              gap: '5px',
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
      </Card>
    </div>
  )
}

export default Item
