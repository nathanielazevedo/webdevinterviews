/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { Box, Button, Checkbox, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const Description = ({ challenge, showInstructions, setShowInstructions }) => {
  const [isVisible, setIsVisible] = useState(showInstructions)

  const handleHide = () => {
    setIsVisible(false)
    setTimeout(() => {
      setShowInstructions(false)
    }, 300)
  }

  useEffect(() => {
    setIsVisible(showInstructions)
  }, [showInstructions])

  return (
    <Box
      id='instructions'
      sx={{
        backgroundColor: 'grey.900',
        flexDirection: 'column',
        position: 'absolute',
        display: 'flex',
        left: isVisible ? 0 : '-35%',
        top: '35px',
        width: '500px',
        height: 'calc(100% - 35px)',
        transition: 'transform 0.3s ease-in-out, left 0.3s ease-in-out',
        transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
        borderRight: 'var(--color-solid-resize-bar) 0.5px solid',
        boxShadow: isVisible ? '5px 0px 5px rgba(0, 0, 0, 0.5)' : 'none',
        padding: '1rem',
        gap: '1rem',
        borderTopRightRadius: '10px',
        borderBottomRightRadius: '10px',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={handleHide}>
          <CloseIcon />
        </Button>
      </Box>
      <Typography variant='h4'>{challenge.title}</Typography>
      {/* {challenge.gif && (
        <img
          src={challenge.gif}
          alt={challenge.name}
          style={{ maxWidth: '30%' }}
        />
      )} */}
      <Typography>{challenge.description}</Typography>
      <Box>
        <Typography variant='h6' color='primary'>
          Checklist
        </Typography>
        {challenge.checkList.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Checkbox />
            <Typography key={index} variant='body1'>
              {item}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default Description
