import { Link as routerLink } from 'react-router-dom'

import Alert from '@mui/material/Alert'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Link from '@mui/material/Link'

import TextLink from '../../../components/TextLink'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Tabs from '../components/Tabs'

import random from './data/random.json'
import structured from './data/structured.json'

const TrueOrFalseMain = () => {
  return (
    <>
      <div className='fit-wrapper'>
        <TextLink
          to='/games'
          text='Back to games'
          icon={<ArrowBackIosIcon fontSize='5px' />}
        />
        <Header
          title='True or False'
          subtext='Choose the structured path or get random questions.'
        />
        <Alert severity='info'>
          Want to challenge an explanation? &nbsp;
          <div style={{ display: 'inline-block' }}>
            <Link component={routerLink} to='/contact' className='nav-link'>
              Contact Us
            </Link>
          </div>
        </Alert>
        <Tabs
          labels={['Structured', 'Random']}
          listsInfo={[
            {
              basePath: '/games/true-or-false/structured/',
              headerText:
                'This is the structured path. This series of questions will slowly introduce you to the different JavaScript types and how they behave. Each series of questions builds upon the previous questions. This is a great place to start.',
              items: structured,
            },
            {
              basePath: '/games/true-or-false/random/',
              headerText:
                "You will receive random questions in no logical order. It's best to do this after completing the structured path.",
              items: random,
            },
          ]}
        />
      </div>
      <Footer />
    </>
  )
}

export default TrueOrFalseMain
