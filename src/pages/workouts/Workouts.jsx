import { useNavigate } from 'react-router'
import useFetch from '../../hooks/useFetch'
import { Typography } from '@mui/material'
import Workout from '../../models/workout'

import WorkoutsSkeleton from './WorkoutsSkeleton'
import Header from '../../components/Header'
import Rating from '../../components/Rating'
import YouTube from '../../components/YouTubeIcon'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const Workouts = () => {
  const navigate = useNavigate()

  const url = `/workouts`
  const { data: workoutsData, loading, error } = useFetch(url)

  const renderBodyContent = () => {
    if (loading) {
      return <WorkoutsSkeleton />
    }

    if (error || !workoutsData) {
      return 'Error. Refresh the page.'
    }

    if (workoutsData.length === 0) {
      return 'No workouts found.'
    }

    const sortedWorkouts = workoutsData.sort((a, b) =>
      a.difficulty.localeCompare(b.difficulty)
    )

    return (
      <div>
        {sortedWorkouts.map((workoutData) => {
          const workout = new Workout(workoutData)
          return (
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
          )
        })}
      </div>
    )
  }

  return (
    <div className='fit-wrapper'>
      <Header
        title='Workouts'
        subtext='React coding challenges to sharpen your skills.'
      />
      {renderBodyContent()}
    </div>
  )
}

export default Workouts
