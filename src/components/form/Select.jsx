/* eslint-disable react/prop-types */

import { Controller } from 'react-hook-form'
import { FormControl, InputLabel, Select, FormHelperText } from '@mui/material'

const SelectInput = ({ name, control, label, children, ...props }) => (
  <FormControl fullWidth variant='outlined' margin='normal'>
    <InputLabel id={`${name}-label`}>{label}</InputLabel>
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Select
          labelId={`${name}-label`}
          id={name}
          value={value}
          onChange={onChange}
          label={label}
          error={!!error}
          {...props}
        >
          {children}
        </Select>
      )}
    />
    {props.error ? (
      <FormHelperText error>{props.error.message}</FormHelperText>
    ) : (
      <FormHelperText>What framework are you using?</FormHelperText>
    )}
  </FormControl>
)

export default SelectInput
