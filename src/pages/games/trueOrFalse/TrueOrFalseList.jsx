import { Link as routerLink } from 'react-router-dom'
import { Link } from '@mui/material'
import TextLink from '../../../components/TextLink'
import Header from '../../../components/Header'
import { useNavigate } from 'react-router-dom'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Footer from '../../../components/Footer'
import { useContext } from 'react'
import { AuthContext } from '../../../contexts/AuthContext'
import { Alert } from '@mui/material'
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
        <Tabs displayName={displayName} />
      </div>
      <Footer />
    </>
  )
}

export default Games
