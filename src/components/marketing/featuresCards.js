import exercise from './exercise.jpg'
import game from './games.jpg'
const data = [
  {
    image: exercise,
    title: 'Workouts',
    description:
      'Front-end workouts with an in-browser code editor. Each workout has a video of me completing the challenge.',
    buttonText: 'GO TO WORKOUTS',
    to: '/workouts',
  },
  {
    image: game,
    title: 'Games',
    description:
      'Thought you knew how weird JavaScript was? Think again. These games will make you question your profession.',
    buttonText: 'GO TO GAMES',
    to: '/games',
  },
]

export default data
