import Box from '@mui/material/Box'
import { Fade, Typography, colors } from '@mui/material'
import { YouTube } from '@mui/icons-material'
import Card from '../components/Card'
import featureCards from '../components/marketing/featuresCards'
import jungle from '../components/marketing/jungle.jpg'

const Home = () => {
  return (
    <Fade in timeout={1000}>
      <div className='fit-wrapper'>
        <div
          style={{
            borderRadius: '10px',
            padding: '40px 0px',
            backgroundImage: jungle,
          }}
        >
          <Typography variant='h3' textAlign='center' color={'grey.500'}>
            Welcome to WDI.
          </Typography>
          <Typography variant='h5' textAlign='center' color={'grey.300'}>
            We've got fun and games.
          </Typography>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '50px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {featureCards.map((card) => (
            <Card card={card} />
          ))}
        </div>
      </div>
    </Fade>
  )
}

export default Home
