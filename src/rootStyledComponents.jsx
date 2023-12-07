import { styled } from '@mui/system'
import { Box } from '@mui/material'
import List from '@mui/material/List'

const OuterBox = styled(Box)(() => ({
  height: '100vh',
  width: '100%',
}))

const RootFrame = styled(Box)(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}))

const StyledTopNav = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: theme.variables.topNavHeight,
  padding: '0px 20px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  borderBottom: `0.5px solid ${theme.palette.divider}`,
}))

const MiddleContent = styled(Box)(() => ({
  height: '100%',
  display: 'flex',
}))

const SideNavContainer = styled(Box)(({ theme }) => ({
  width: theme.variables.sideNavWidth,
  borderRight: `0.5px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
}))

const SideNavList = styled(List)(() => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
}))

const OutletContainer = styled(Box)(() => ({
  flexGrow: 1,
}))

export {
  OuterBox,
  RootFrame,
  StyledTopNav,
  MiddleContent,
  SideNavContainer,
  SideNavList,
  OutletContainer,
}
