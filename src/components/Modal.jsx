import * as React from 'react'
import Stack from '@mui/material/Stack'
import TrapFocus from '@mui/material/Unstable_TrapFocus'
import Paper from '@mui/material/Paper'
import Fade from '@mui/material/Fade'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function CookiesBanner({ bannerOpen, setBannerOpen }) {
  const closeBanner = () => {
    setBannerOpen(false)
  }

  return (
    <React.Fragment>
      <TrapFocus open disableAutoFocus disableEnforceFocus>
        <Fade appear={false} in={bannerOpen}>
          <Paper
            role='dialog'
            aria-modal='false'
            aria-label='Cookie banner'
            square
            variant='outlined'
            tabIndex={-1}
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              m: 0,
              p: 2,
              borderWidth: 0,
              borderTopWidth: 1,
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent='space-between'
              gap={2}
            >
              <Box
                sx={{
                  flexShrink: 1,
                  alignSelf: { xs: 'flex-start', sm: 'center' },
                }}
              >
                <Typography fontWeight='bold'>
                  This site relies on its members.
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  They pay the server and coffee fees. 0.99&#162; / month
                </Typography>
              </Box>
              <Stack
                gap={2}
                direction={{
                  xs: 'row-reverse',
                  sm: 'row',
                }}
                sx={{
                  flexShrink: 0,
                  alignSelf: { xs: 'flex-end', sm: 'center' },
                }}
              >
                <Button size='small' onClick={closeBanner}>
                  Close
                </Button>
                <Button
                  size='small'
                  onClick={closeBanner}
                  variant='outlined'
                  href='https://www.youtube.com/channel/UC-4Ij6StciJgYzbxLyxHMPw/join'
                  target='_blank'
                >
                  Become a member
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Fade>
      </TrapFocus>
    </React.Fragment>
  )
}
