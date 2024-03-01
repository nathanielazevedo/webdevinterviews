import { Link as routerLink, NavLink } from 'react-router-dom'
import { Link } from '@mui/material'

import { Box, Typography } from '@mui/material'
import TextLink from '../../../components/TextLink'
import Header from '../../../components/Header'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useNavigate } from 'react-router-dom'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Footer from '../../../components/Footer'
import { useContext } from 'react'
import { AuthContext } from '../../../contexts/AuthContext'
import LockIcon from '@mui/icons-material/Lock'
import { Alert } from '@mui/material'

const Deck = ({ deck, to }) => {
  const navigate = useNavigate()
  return deck.public ? (
    <div className='item-container' onClick={() => navigate(to)}>
      <div>
        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <Typography color='grey.500'>{deck.title}</Typography>
        </div>
        <Typography color='grey.300'>{deck?.description}</Typography>
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
      <div className='item-container' onClick={() => navigate(to)}>
        <div>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <Typography color='grey.500'>{deck.title}</Typography>
          </div>
          <Typography color='grey.300'>{deck?.description}</Typography>
        </div>
        <LockIcon
          sx={{
            color: 'grey.400',
          }}
        />
      </div>
    </div>
  )
}

export default Deck
