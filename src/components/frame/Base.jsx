import { styled } from '@mui/system'
import Box from '@mui/material/Box'

const MainFrame = styled(Box)(() => ({
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '& #containers': {
    height: '100%',
    width: '100%',
    display: 'flex',
    borderRadius: '10px',
    flexDirection: 'column',
  },
}))

export default MainFrame
