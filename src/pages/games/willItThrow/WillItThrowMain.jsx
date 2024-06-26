import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

import TextLink from '../../../components/TextLink'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Tabs from '../components/Tabs'

import random from './data/random.json'
import structured from './data/structured.json'

const Games = () => {
  return (
    <>
      <div className='fit-wrapper'>
        <TextLink
          to='/games'
          text='Back to games'
          icon={<ArrowBackIosIcon fontSize='5px' />}
        />
        <Header
          title='Will It Throw?'
          subtext="Welcome to 'Will It Throw?' Can you predict if JavaScript code will throw an error? Test your skills by choosing 'Yes' or 'No' for each snippet. Explore JavaScript's nuances and error handling. Ready to play?"
        />

        <Tabs
          labels={['Structured', 'Random']}
          listsInfo={[
            {
              basePath: '/games/will-it-throw/structured/',
              headerText:
                'This is the structured path. This series of questions will introduce you to the different JavaScript error types and when they might be thrown. This is a great place to start.',
              items: structured,
            },
            {
              basePath: '/games/will-it-throw/random/',
              headerText:
                'Receive random questions from our question pool in no logical order.',
              items: random,
            },
          ]}
        />
      </div>
      <Footer />
    </>
  )
}

export default Games
