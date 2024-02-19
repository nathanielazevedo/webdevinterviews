import Rating from '../../components/Rating'
import YouTube from '../../components/YouTubeIcon'
import TextLink from '../../components/TextLink'
import Workout from '../../models/workout'
import TemplateToSvg from './components/TemplateToSvg'

const WorkoutsTable = ({ workoutsData }) => {
  return workoutsData.map((workoutData, index) => {
    const workout = new Workout(workoutData)
    return (
      <tr key={workout.id}>
        <td align='left' width={'100px'}>
          <TemplateToSvg template={workout.type} />
        </td>
        <td align='left'>
          <TextLink to={`/workouts/${workout.id}`} text={workout.title} />
        </td>
        <td align='center'>
          <Rating rating={workout.difficulty} />
        </td>
        <td align='center'>
          {workout.youtubeLink && <YouTube workout={workout} />}
        </td>
      </tr>
    )
  })
}

export default WorkoutsTable
