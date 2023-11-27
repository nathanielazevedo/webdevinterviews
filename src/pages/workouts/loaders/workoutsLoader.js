import API from '../../../api'

export const workoutsLoader = async () => {
  try {
    const { data: workouts } = await API.get('/workouts')
    return { workouts }
  } catch (error) {
    console.error(`Failed to load workouts: ${error.message}`)
    throw error
  }
}
