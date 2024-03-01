// components
import { NavLink } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import TextLink from '../../../components/TextLink'
import Header from '../../../components/Header'
import { useNavigate } from 'react-router-dom'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Footer from '../../../components/Footer'
import LockIcon from '@mui/icons-material/Lock'
import { useContext } from 'react'
import { AuthContext } from '../../../contexts/AuthContext'
import Tabs from './Tabs'

const Games = () => {
  const navigate = useNavigate()
  const { displayName } = useContext(AuthContext)

  return (
    <>
      <div className='fit-wrapper'>
        <TextLink
          to='/games'
          text='Back to games'
          icon={<ArrowBackIosIcon fontSize='5px' />}
        />
        <Header
          title='Will It Throw'
          subtext='Determine if the code provided will throw an error. Remember, strict mode is on. Choose the structure or random path.'
        />
        <Tabs displayName={displayName} />
      </div>
      <Footer />
    </>
  )
}

export default Games
