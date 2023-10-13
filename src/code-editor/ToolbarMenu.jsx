/* eslint-disable react/prop-types */
import * as React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import CheckIcon from '@mui/icons-material/Check'
import { useSandpack } from '@codesandbox/sandpack-react'

export default function BasicMenu({ autoSave, setAutoSave }) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const { sandpack } = useSandpack()
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Button
        id='basic-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Settings
      </Button>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem
          onClick={() => {
            setAutoSave(!autoSave)
            sandpack.runSandpack()
            sandpack.openFile('/package.json')
            localStorage.setItem('autoSave', !autoSave)
            handleClose()
          }}
        >
          {autoSave && <CheckIcon />}
          Auto Save
        </MenuItem>
      </Menu>
    </div>
  )
}
