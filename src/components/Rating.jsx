import SignalCellularAlt1BarIcon from '@mui/icons-material/SignalCellularAlt1Bar'
import SignalCellularAlt2BarIcon from '@mui/icons-material/SignalCellularAlt2Bar'
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt'
import Tooltip from '@mui/material/Tooltip'

// eslint-disable-next-line react/prop-types
const Rating = ({ rating }) => {
  const getIcon = (rating) => {
    switch (rating) {
      case 1:
        return (
          <Tooltip title='Easy' placement='top' fontSize='large'>
            <SignalCellularAlt1BarIcon color='success' />
          </Tooltip>
        )
      case 2:
        return (
          <Tooltip title='Medium' placement='top'>
            <SignalCellularAlt2BarIcon color='warning' fontSize='large' />
          </Tooltip>
        )
      case 3:
        return (
          <Tooltip title='Hard' placement='top'>
            <SignalCellularAltIcon color='error' fontSize='large' />
          </Tooltip>
        )
      default:
        return null
    }
  }

  return getIcon(rating)
}

export default Rating
