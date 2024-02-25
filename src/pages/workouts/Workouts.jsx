import { useNavigate } from 'react-router'
import useFetch from '../../hooks/useFetch'
import { Typography, Backdrop } from '@mui/material'

import WorkoutsSkeleton from './WorkoutsSkeleton'
import Header from '../../components/Header'
import Rating from '../../components/Rating'
import YouTube from '../../components/YouTubeIcon'
import Footer from '../../components/Footer'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import LockIcon from '@mui/icons-material/Lock'

const Workouts = () => {
  const navigate = useNavigate()

  const url = `/workouts`
  const { data: workouts, loading, error } = useFetch(url)

  const renderBodyContent = () => {
    if (loading) {
      return <WorkoutsSkeleton />
    }

    if (error || !workouts) {
      return 'Error. Refresh the page.'
    }

    if (workouts.length === 0) {
      return 'No workouts found.'
    }

    const sortedWorkouts = workouts.sort((a, b) =>
      a.difficulty.localeCompare(b.difficulty)
    )

    return (
      <div>
        {sortedWorkouts.map((workout) => {
          return workout.visible ? (
            <div
              key={workout.id}
              className='item-container'
              onClick={() => navigate(`/workouts/${workout.id}`)}
            >
              <div>
                <div className='item-text-wrapper'>
                  <Typography>{workout.title}</Typography>
                  <Rating rating={workout.difficulty} />
                </div>
                <Typography sx={{ color: 'grey.500' }}>
                  {workout.description}
                </Typography>
              </div>
              <ArrowForwardIosIcon sx={{ color: 'grey.400' }} />
            </div>
          ) : (
            <div className='hidden-item-wrapper'>
              <div className='hidden-item-overlay'></div>
              <div key={workout.id} className='item-container'>
                <div>
                  <div className='item-text-wrapper'>
                    <Typography>{workout.title}</Typography>
                    <Rating rating={workout.difficulty} />
                  </div>
                  <Typography sx={{ color: 'grey.500' }}>
                    {workout.description}
                  </Typography>
                </div>
                <LockIcon sx={{ color: 'grey.400' }} />
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <>
      <div className='fit-wrapper'>
        <Header
          title='Workouts'
          subtext='React coding challenges to sharpen your skills.'
        />
        {renderBodyContent()}
      </div>
      <Footer />
    </>
  )
}

export default Workouts
