/* eslint-disable react/prop-types */
import Box from '@mui/material/Box'
// import Select from '@mui/material/Select'
import { IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
// import InputLabel from '@mui/material/InputLabel'
// import FormControl from '@mui/material/FormControl'
// import { Form, useLocation } from 'react-router-dom'
const isDev = import.meta.env.DEV
import PropTypes from 'prop-types'

// Inside TopNav component file

const TopNav = ({ open, setOpenDialog }) => {
  // const { difficulty } = useLoaderData()
  // const location = useLocation()

  return (
    <Box
      sx={{
        width: '100%',
        height: '35px',
        display: 'flex',
        padding: '0px 25px',
        alignItems: 'center',
        borderBottom: '0.5px solid var(--color-solid-resize-bar-handle)',
      }}
    >
      {isDev && (
        <IconButton size='small' onClick={() => setOpenDialog(!open)}>
          <AddIcon
            size='small'
            sx={{
              color: 'primary.main',
            }}
          />
        </IconButton>
      )}
      <div style={{ flexGrow: '1' }} />
      {/* <Box
        sx={{
          minWidth: 120,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          height: '35px',
          paddingBottom: '0px',
        }}
      >
        <Form
          id='search-form'
          role='search'
          style={{ width: '100%' }}
          action={location.pathname}
        >
          <FormControl fullWidth>
            <InputLabel
              size='small'
              id='demo-simple-select-label'
              sx={{
                fontSize: '10px',
              }}
            >
              Difficulty
            </InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              label='Difficulty'
              native
              name='difficulty'
              type='search'
              onChange={() => {
                document.getElementById('submit-button').click()
              }}
              defaultValue={difficulty ?? 'all'}
              size='small'
              sx={{ fontSize: '10px', height: '20px' }}
            >
              <option value='all'>All</option>
              <option value='1'>JUNIOR</option>
              <option value='2'>MID</option>
              <option value='3'>SENIOR</option>
            </Select>
            <button type='submit' hidden id='submit-button'></button>
          </FormControl>
        </Form>
      </Box> */}
    </Box>
  )
}

export default TopNav

TopNav.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpenDialog: PropTypes.func.isRequired,
}
