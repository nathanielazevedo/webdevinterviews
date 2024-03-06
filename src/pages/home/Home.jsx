import { Divider } from '@mui/material'
import Footer from '../../components/Footer'
import Modal from '../../components/Modal'
import { useState, useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import Item from '../../components/Item'
import HomeHeader from './components/HomeHeader'
import workouts from './workouts'
import HomeButton from './components/HomeButton'
import Game from '../games/components/Game'
import trueOrFalseStructuredDecks from '../games/trueOrFalse/data/structured.json'
import willItThrowRandomDecks from '../games/willItThrow/data/random.json'
import cccRandomDecks from '../games/ccc/data/random.json'

const Home = () => {
  const { displayName } = useContext(AuthContext)
  const [bannerOpen, setBannerOpen] = useState(displayName ? false : true)

  return (
    <>
      <div className='fit-wrapper'>
        <div className='marketing-section'>
          <HomeHeader
            title={'WEB DEV INTERVIEWS'}
            subtext={
              'Learning hinges on capturing your brains interest. Through the use of games, dynamic workouts, and engaging contests, I strive to inspire continuous exploration and learning.'
            }
          />
          <div className='home-buttons'>
            <HomeButton text='15+ WORKOUTS' to='/workouts' />
            <HomeButton text='50+ GAMES' to='/games' />
            <HomeButton
              text='50+ VIDEOS'
              to='https://www.youtube.com/channel/UC-4Ij6StciJgYzbxLyxHMPw/join'
              outside={true}
            />
          </div>
        </div>
        <Divider />
        <div className='marketing-section'>
          <HomeHeader
            title={'TRUE OR FALSE'}
            subtext={
              'Exercise your understanding of JavaScript comparison operators, type coercion and so much more.'
            }
          />
          <HomeButton
            text='Play True or False'
            to='/games/true-or-false'
            oneLine={true}
          />
          <Game
            deck={trueOrFalseStructuredDecks[0]}
            pastFreeDecks={true}
            goNextDeck={() => {}}
            isLastDeck={true}
            gameName='true-or-false'
            playSound={false}
          />
        </div>
        <Divider />
        <div className='marketing-section'>
          <HomeHeader
            title={'WILL IT THROW'}
            subtext={
              'JavaScript does not like to throw errors but it is very important to know when it will. This game will test your understanding of JavaScript error handling.'
            }
          />
          <HomeButton
            text='Play Will It Throw'
            to='/games/will-it-throw'
            oneLine={true}
          />
          <Game
            deck={willItThrowRandomDecks[0]}
            pastFreeDecks={true}
            goNextDeck={() => {}}
            isLastDeck={true}
            gameName='will-it-throw'
            playSound={false}
          />
        </div>
        <div className='marketing-section'>
          <HomeHeader
            title={'CHOOSE CORRECT COMPARISON OPERATOR'}
            subtext={
              'JavaScript does not like to throw errors but it is very important to know when it will. This game will test your understanding of JavaScript error handling.'
            }
          />
          <HomeButton text='Play CCC' to='/games/ccc' oneLine={true} />
          <Game
            deck={cccRandomDecks[0]}
            pastFreeDecks={true}
            goNextDeck={() => {}}
            isLastDeck={true}
            gameName='ccc'
            playSound={false}
          />
        </div>
        <Divider />
        <div className='marketing-section'>
          <HomeHeader
            title={'WORKOUTS'}
            subtext={
              'A programmer is an athlete of the mind. An athlete workouts out their body; a programmer workouts out their mind.'
            }
          />
          <HomeButton text='Go to Workouts' to='/workouts' oneLine={true} />
          <div>
            {workouts.map((workout) => {
              return <Item key={workout.id} item={workout} />
            })}
          </div>
        </div>
        <Divider />
        <div className='marketing-section'>
          <HomeHeader
            title={'BECOME A MEMBER'}
            subtext={
              'Members of my YouTube channel get all access to workouts, True or False, and Will It Throw games. It costs 0.99 cents / month. Your support allows me to improve my content and continue to produce cool stuff.'
            }
          />
          <HomeButton
            text='Become a member'
            to='https://www.youtube.com/channel/UC-4Ij6StciJgYzbxLyxHMPw/join'
            outside={true}
            oneLine={true}
          />
        </div>
      </div>
      <Modal bannerOpen={bannerOpen} setBannerOpen={setBannerOpen} />
      <Footer bannerOpen={bannerOpen} />
    </>
  )
}

export default Home
