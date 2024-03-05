import { Link, Paper, Typography } from '@mui/material'
import { Link as routerLink } from 'react-router-dom'
import AddToHomeScreenIcon from '@mui/icons-material/AddToHomeScreen'

const Footer = ({ bannerOpen = false }) => {
  return (
    <Paper
      elevation={2}
      className='footer-wrapper'
      style={{
        marginBottom: bannerOpen ? '120px' : 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        <AddToHomeScreenIcon sx={{ fontSize: '45px', color: 'grey.400' }} />
        <div>
          <Typography variant='caption' sx={{ color: 'grey.400' }}>
            Make this site feel native.
          </Typography>
          <Typography sx={{ color: 'grey.400' }}>
            Add it to your homescreen.
          </Typography>
        </div>
      </div>
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
    </Paper>
  )
}

export default Footer
