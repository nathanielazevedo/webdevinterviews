import Drawer from '@mui/material/Drawer'
import RootSideNav from '../pages/RootSideNav'

const SideDrawer = ({ open, setOpen }) => {
  return (
    <Drawer
      anchor='left'
      open={true}
      onClose={() => setOpen(false)}
      elevation={0}
    >
      <RootSideNav />
    </Drawer>
  )
}

export default SideDrawer
