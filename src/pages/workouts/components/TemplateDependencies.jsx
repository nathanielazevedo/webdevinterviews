/* eslint-disable react/prop-types */
import { useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/material'
import SelectInput from '../../../components/form/Select'
import { vanilla, react } from '../../../assets/template'

const templateIcons = {
  vanilla,
  react,
}

const TemplateDependencies = ({ control, setValue, data, error, workout }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(
    workout ? workout?.sp_template : data[0]
  )
  const handleTemplateChange = (event) => {
    setValue('sp_template_id', event.target.value)
    setSelectedTemplate(data.find((item) => item.id === event.target.value))
  }

  if (error) return `Error: ${error.message}`

  return (
    <SelectInput
      name='sp_template_id'
      control={control}
      label='Template'
      onChange={handleTemplateChange}
      value={selectedTemplate.id}
    >
      {data.map((item) => (
        <MenuItem key={item.id} value={item.id}>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <img alt='' src={templateIcons[item?.name]} width='15px' />
            <Typography>{item?.name}</Typography>
          </Box>
        </MenuItem>
      ))}
    </SelectInput>
  )
}

export default TemplateDependencies
