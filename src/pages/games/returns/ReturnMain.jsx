import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

import TextLink from '../../../components/TextLink'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Tabs from '../components/Tabs'

import random from './data/random.json'

const Games = () => {
  localStorage.setItem('gameTab', 0)
  return (
    <>
      <div className='fit-wrapper'>
        <TextLink
          to='/games'
          text='Back to games'
          icon={<ArrowBackIosIcon fontSize='5px' />}
        />
        <Header
          title='Returns What?'
          subtext='Predict what the code will return.'
        />

        <Tabs
          labels={['Random']}
          listsInfo={[
            {
              basePath: '/games/returns/random/',
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
