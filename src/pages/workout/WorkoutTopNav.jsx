import { useContext } from 'react'
import { WorkoutContext } from '../../contexts/WorkoutContext'
import { Typography, Alert } from '@mui/material'
import TemplateToSvg from '../../components/TemplateToSvg'
import YouTube from '../../components/YouTubeIcon'
import Rating from '../../components/Rating'
import ResetChanges from './editor/components/ResetChanges'

const WorkoutTopNav = () => {
  const { workout, fromLocal } = useContext(WorkoutContext)

  return (
    <div className='top-nav'>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <Typography>{workout.title}</Typography>
        <TemplateToSvg template={workout.sp_template} />
        <Rating rating={workout.difficulty} />
        <YouTube workout={workout} />
      </div>
      {fromLocal && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            height: '40px',
            overflow: 'hidden',
            borderRadius: '5px',
          }}
        >
          <Alert
            severity='info'
            action={<ResetChanges />}
            sx={{ margin: '10px 0', fontSize: 'small' }}
          >
            Files uploaded from local.
          </Alert>
        </div>
      )}
    </div>
  )
}

export default WorkoutTopNav
