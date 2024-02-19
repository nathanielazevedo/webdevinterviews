import Drawer from '@mui/material/Drawer'
import RootSideNav from '../pages/RootSideNav'

const SideDrawer = ({ open, setOpen }) => {
  return (
    <Drawer
      anchor='right'
      open={true}
      onClose={() => setOpen(false)}
      elevation={1}
      onClick={() => setOpen(false)}
    >
      <RootSideNav />
    </Drawer>
  )
}

export default SideDrawer
