import { useNavigate } from 'react-router'
import useFetch from '../../hooks/useFetch'
import { Typography, Alert, Card } from '@mui/material'

import WorkoutsSkeleton from './WorkoutsSkeleton'
import Header from '../../components/Header'
import Rating from '../../components/Rating'
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
        <Alert severity='info' variant='standard'>
          There is no value in these workouts being mobile friendly. Therefore,
          there is currenly no intention to do so.
        </Alert>
        <div className='items-container'>
          {sortedWorkouts.map((workout) => {
            return workout.visible ? (
              <Card
                elevation={1}
                key={workout.id}
                className='item-container'
                onClick={() => navigate(`/workouts/${workout.id}`)}
              >
                <div>
                  <div className='item-text-wrapper'>
                    <Typography fontWeight='bold'>{workout.title}</Typography>
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
                <ArrowForwardIosIcon
                  fontSize='small'
                  sx={{ color: 'grey.400' }}
                />
              </Card>
            ) : (
              <div className='hidden-item-wrapper' key={workout.id}>
                <div className='hidden-item-overlay'></div>
                <div className='item-container'>
                  <div>
                    <div className='item-text-wrapper'>
                      <Typography fontWeight='bold'>{workout.title}</Typography>
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
                  <LockIcon sx={{ color: 'grey.400' }} fontSize='small' />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='fit-wrapper'>
        <Header
          title='Workouts'
          subtext='A programmer is an athlete of the mind. These workouts will train your abilities with React, JavaScript, HTML, CSS and DSA.'
        />
        {renderBodyContent()}
      </div>
      <Footer />
    </>
  )
}

export default Workouts
