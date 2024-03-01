// components
import { NavLink } from 'react-router-dom'
import decks from './ccc.json'
import transformed from './transformedData.json'
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

const Games = () => {
  const navigate = useNavigate()
  const { displayName } = useContext(AuthContext)

  function chunkArray(array) {
    const chunkedArray = []
    for (let i = 0; i < array.length; i += 5) {
      chunkedArray.push(array.slice(i, i + 5))
    }
    return chunkedArray
  }

  return (
    <>
      <div className='fit-wrapper'>
        <TextLink
          to='/games'
          text='Back to games'
          icon={<ArrowBackIosIcon fontSize='5px' />}
        />
        <Header
          title='Choose Correct Comparison Operator'
          subtext='Choose the correct comparison operator.'
        />
        <div>
          <div
            className='item-container'
            onClick={() => navigate(`/games/ccc/random`)}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                }}
              >
                Random Questions
              </div>
            </div>
            <ArrowForwardIosIcon
              sx={{
                color: 'grey.400',
              }}
            />
          </div>
          {chunkArray(transformed).map((deck, index) => {
            return displayName || index <= 4 ? (
              <div
                className='item-container'
                onClick={() => navigate(`/games/ccc/${index}`)}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                    }}
                  >
                    Deck #{index + 1}
                  </div>
                </div>
                <ArrowForwardIosIcon
                  sx={{
                    color: 'grey.400',
                  }}
                />
              </div>
            ) : (
              <div className='hidden-item-wrapper'>
                <div className='hidden-item-overlay'></div>
                <div className='item-container'>
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center',
                      }}
                    >
                      Deck #{index + 1}
                    </div>
                  </div>
                  <LockIcon
                    sx={{
                      color: 'grey.400',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Games
