import { Typography, Box } from '@mui/material'
import Rating from '../../components/Rating'
import SkeletonTable from './components/SkeletonTable'
import useFetch from '../../hooks/useFetch'
import YouTube from '../../components/YouTubeIcon'
import ErrorRow from './components/ErrorRow'
import TextLink from '../../components/TextLink'
import NoWorkouts from './components/NoWorkouts'
import Workout from '../../models/workout'
import TemplateToSvg from './components/TemplateToSvg'
import { TableHead as MuiTableHead } from '@mui/material'
import { useState } from 'react'
import Header from '../../components/Header'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useNavigate } from 'react-router'

const Workouts = () => {
  const url = `/workouts`
  const { data: workoutsData, loading, error, fetchData } = useFetch(url)
  const [createWorkoutDialogOpen, setCreateWorkoutDialogOpen] = useState(false)
  const navigate = useNavigate()

  const fetchWorkouts = () => fetchData(`/workouts`)

  const renderTableBodyContent = () => {
    if (loading) {
      return <SkeletonTable />
    }

    if (error || !workoutsData) {
      return null
    }

    if (workoutsData.length === 0) {
      return null
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {workoutsData.map((workoutData) => {
          const workout = new Workout(workoutData)
          return (
            <div
              className='item-container'
              onClick={() => navigate(`/workouts/${workout.id}`)}
            >
              <div>
                <div
                  style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
                >
                  {workout.title}
                  <Rating rating={workout.difficulty} />
                </div>
                <Typography sx={{ color: 'grey.500' }}>
                  {workout.description}
                </Typography>
              </div>
              <ArrowForwardIosIcon
                sx={{
                  color: 'grey.400',
                }}
              />
            </div>
          )
        })}
      </div>
    )
  }

  const renderFailedStateContent = () => {
    if (loading) return
    if (error || !workoutsData) {
      return <ErrorRow fetchWorkouts={fetchWorkouts} />
    }

    if (workoutsData.length === 0) {
      return <NoWorkouts />
    }

    return null
  }

  return (
    <div className='fit-wrapper'>
      <Header
        title='Workouts'
        subtext='React coding challenges to sharpen your skills.'
      />
      {renderTableBodyContent()}
      <Box>{renderFailedStateContent()}</Box>
      {createWorkoutDialogOpen && (
        <CreateWorkoutDialog
          open={createWorkoutDialogOpen}
          setOpen={setCreateWorkoutDialogOpen}
        />
      )}
    </div>
  )
}

export default Workouts
