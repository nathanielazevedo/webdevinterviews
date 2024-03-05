import games from './games.json'
import Alert from '@mui/material/Alert'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Item from './components/Item'

const GamesList = () => {
  return (
    <>
      <div className='fit-wrapper'>
        <Header
          title='Games'
          subtext='Improve your understanding of JavaScript with games.'
        />
        <Alert severity='info'>
          Games are added, updated and audited daily!
        </Alert>
        <div className='items-container'>
          {games.map((game, index) => (
            <Item key={index} item={game} basePath={'/games/'} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default GamesList
