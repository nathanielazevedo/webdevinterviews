import useFetch from '../../hooks/useFetch'
import Alert from '@mui/material/Alert'
import Header from '../../components/Header'
import Item from '../../components/Item'

const Workouts = () => {
  const url = `/workouts`
  const { data: workouts, loading, error } = useFetch(url)

  const renderBodyContent = () => {
    if (loading) {
      return (
        <div className='items-container'>
          {[1, 2, 3, 4, 5].map((index) => (
            <Item key={index} skeleton={true} />
          ))}
        </div>
      )
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
      <div className='items-container'>
        {sortedWorkouts.map((item) => (
          <Item key={item.id} item={item} basePath={'/workouts/'} />
        ))}
      </div>
    )
  }

  return (
    <div className='fit-wrapper'>
      <Header
        title='Workouts'
        subtext='A programmer is an athlete of the mind. These workouts will train your abilities with React, JavaScript, HTML, CSS and DSA.'
      />
      <Alert severity='info' className='workout-alert'>
        There is no value in these workouts being mobile friendly. Therefore,
        there is currenly no intention to do so.
      </Alert>
      {renderBodyContent()}
    </div>
  )
}

export default Workouts
