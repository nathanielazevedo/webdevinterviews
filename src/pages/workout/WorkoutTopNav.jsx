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
        <Typography sx={{ color: 'grey.300' }}>{workout.title}</Typography>
        <TemplateToSvg template={workout.sp_template} />
        <Rating rating={workout.difficulty} />
        <YouTube workout={workout} />
      </div>
      {fromLocal && (
        <Alert icon={false} action={<ResetChanges />}>
          Files uploaded from local.
        </Alert>
      )}
    </div>
  )
}

export default WorkoutTopNav
