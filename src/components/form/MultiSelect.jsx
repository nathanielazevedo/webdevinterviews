/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
import { useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import { Controller } from 'react-hook-form'
import { reactRouterDom, reactRedux } from '../../assets/dependencies'

const templateIcons = {
  'react-router-dom': reactRouterDom,
  'react-redux': reactRedux,
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName && personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  }
}

const MultipleSelectChip = ({ name, control, options, label, error }) => {
  const theme = useTheme()

  return (
    <div>
      <FormControl fullWidth sx={{ mt: 1.5 }}>
        <InputLabel id='demo-multiple-chip-label'>{label}</InputLabel>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <>
              <Select
                labelId='demo-multiple-chip-label'
                id='demo-multiple-chip'
                multiple
                value={field.value || []}
                onChange={field.onChange}
                input={
                  <OutlinedInput id='select-multiple-chip' label={label} />
                }
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const option = options.find(
                        (option) => option.id === value
                      )
                      return (
                        <Chip
                          key={value}
                          label={option ? option.name : ''}
                          icon={
                            <img
                              alt=''
                              src={templateIcons[option?.name]}
                              width='15px'
                            />
                          }
                        />
                      )
                    })}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {options.map((option) => (
                  <MenuItem
                    key={option.id}
                    value={option.id}
                    style={getStyles(option.name, field.value, theme)}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                      }}
                    >
                      <img
                        alt=''
                        src={templateIcons[option.name]}
                        width='15px'
                      />
                      <Typography>{option.name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {error ? (
                <FormHelperText error>{error.message}</FormHelperText>
              ) : (
                <FormHelperText>
                  Dependency options will change based on the template you
                  select.
                </FormHelperText>
              )}
            </>
          )}
        />
      </FormControl>
    </div>
  )
}

export default MultipleSelectChip
