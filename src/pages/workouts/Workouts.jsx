import { useNavigate } from 'react-router'
import useFetch from '../../hooks/useFetch'
import { Typography, Backdrop, Alert } from '@mui/material'

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
        <Alert severity='info' className='workout-alert' icon={false}>
          There is no value in these workouts being mobile friendly. Therefore,
          there is currenly no intention to do so.
        </Alert>
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
                <Typography sx={{ color: 'grey.500' }} variant='subtitle2'>
                  {workout.description}
                </Typography>
                <div className='skills-wrapper'>
                  {workout?.skills?.map((skill) => {
                    return (
                      <Typography
                        key={skill}
                        sx={{ color: 'grey.500' }}
                        variant='subtitle2'
                      >
                        #{skill}
                      </Typography>
                    )
                  })}
                </div>
              </div>
              <ArrowForwardIosIcon sx={{ color: 'grey.400' }} />
            </div>
          ) : (
            <div className='hidden-item-wrapper' key={workout.id}>
              <div className='hidden-item-overlay'></div>
              <div className='item-container'>
                <div>
                  <div className='item-text-wrapper'>
                    <Typography>{workout.title}</Typography>
                    <Rating rating={workout.difficulty} />
                  </div>
                  <Typography sx={{ color: 'grey.500' }} variant='subtitle2'>
                    {workout.description}
                  </Typography>
                  <div className='skills-wrapper'>
                    {workout?.skills?.map((skill) => {
                      return (
                        <Typography
                          key={skill}
                          sx={{ color: 'grey.500' }}
                          variant='subtitle2'
                        >
                          #{skill}
                        </Typography>
                      )
                    })}
                  </div>
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
          subtext='A programmer is an athlete of the mind. These workouts will train your abilities 
          with React, JavaScript, HTML, CSS and DSA.'
        />
        {renderBodyContent()}
      </div>
      <Footer />
    </>
  )
}

export default Workouts
