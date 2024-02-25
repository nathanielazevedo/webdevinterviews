import { Link, Paper, Typography } from '@mui/material'
import { Link as routerLink } from 'react-router-dom'
import TextLink from './TextLink'
import logo from '../assets/logo.png'

const Footer = () => {
  return (
    <div className='footer-wrapper'>
      <img src={logo} width='75px' style={{ borderRadius: '10px' }} />
      <div className='legal-wrapper'>
        <Link
          target='_blank'
          href='https://app.termly.io/document/privacy-policy/6d782f95-1dec-49a3-aca0-17e628b85bc0'
        >
          Privacy Policy
        </Link>
        <Link
          target='_blank'
          href='https://app.termly.io/document/terms-of-service/fc74560a-b49f-4bd6-9cfd-f230faa97b98'
        >
          Terms of Service
        </Link>
        <Link component={routerLink} to='/contact'>
          Contact
        </Link>
      </div>
    </div>
  )
}

export default Footer
