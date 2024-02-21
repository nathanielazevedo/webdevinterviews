import { Button, Typography } from '@mui/material'
import Header from '../components/Header'

const HelpPage = () => {
  return (
    <div className='fit-wrapper'>
      <Header
        title='Contact'
        subtext='You can contact me in a few different ways.'
      />
      <Typography sx={{ color: 'grey.500' }}>
        Email: webdevinterviews@gmail.com
      </Typography>
      <a href='https://discord.gg/wjH8W9JFY6' target='_blank'>
        <Button fullWidth variant='outlined' color='primary'>
          Discord
        </Button>
      </a>
      <a href='https://www.linkedin.com/in/nateazevedo/' target='_blank'>
        <Button fullWidth variant='outlined' color='primary'>
          LinkedIn
        </Button>
      </a>
    </div>
  )
}

export default HelpPage
