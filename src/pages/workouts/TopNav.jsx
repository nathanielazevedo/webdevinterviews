import Box from '@mui/material/Box'
// import { Form } from 'react-router-dom'
import FilterListIcon from '@mui/icons-material/FilterList'

import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import { useSearchParams } from 'react-router-dom'

const TopNav = () => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const [searchParams, setSearchParams] = useSearchParams()
  return (
    <Box
      sx={{
        height: '35px',
        width: '100%',
        borderBottom: '0.5px solid var(--color-solid-resize-bar-handle)',
        display: 'flex',
        alignItems: 'center',
        padding: '0px 25px',
        // justifyContent: 'center',
      }}
    >
      <Tooltip title='Account settings'>
        <IconButton
          onClick={handleClick}
          size='small'
          // sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
        >
          <FilterListIcon fontSize='small' sx={{ color: 'grey.500' }} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 1,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            // mt: 1.5,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <FormControl>
            <FormLabel id='demo-radio-buttons-group-label'>
              Difficulty
            </FormLabel>
            <RadioGroup
              aria-labelledby='demo-radio-buttons-group-label'
              name='radio-buttons-group'
              defaultValue={searchParams.get('difficulty')}
              value={searchParams.get('difficulty')}
              sx={{
                marginTop: '10px',
              }}
            >
              <FormControlLabel
                value='1'
                control={<Radio sx={{ fontSize: '10px' }} />}
                label='JUNIOR'
                slotProps={{ typography: { fontSize: '14px' } }}
                onClick={() => {
                  setSearchParams({ difficulty: 1 })
                }}
              />
              <FormControlLabel
                value='2'
                control={<Radio />}
                label='MID-LEVEL'
                slotProps={{ typography: { fontSize: '14px' } }}
                onClick={() => setSearchParams({ difficulty: 2 })}
              />
              <FormControlLabel
                value='3'
                control={<Radio />}
                label='SENIOR'
                slotProps={{ typography: { fontSize: '14px' } }}
                onClick={() => setSearchParams({ difficulty: 3 })}
              />
            </RadioGroup>
          </FormControl>
        </MenuItem>
      </Menu>
      {/* <Typography color='grey.500'>WORKOUTS</Typography> */}
      <div style={{ flexGrow: '1' }} />
      {/* <Form
        style={{
          marginLeft: '20px',
          borderBottom: '1px solid var(--color-solid-resize-bar-handle)',
          width: '230px',
        }}
      >
        <input
          placeholder='Search for workout by name'
          style={{
            backgroundColor: 'transparent',
            width: '100%',
            color: 'white',
            border: 'none',
          }}
        />
      </Form> */}
    </Box>
  )
}

export default TopNav
