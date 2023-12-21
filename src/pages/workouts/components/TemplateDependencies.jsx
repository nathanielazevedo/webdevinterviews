/* eslint-disable react/prop-types */
import { useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { Box, Skeleton } from '@mui/material'
import Icon from '@mui/material/Icon'
import SelectInput from '../../../components/form/Select'
import MultiSelect from '../../../components/form/MultiSelect'
import { vanilla, react } from '../../../assets/template'

const templateIcons = {
  vanilla,
  react,
}

const TemplateDependencies = ({
  control,
  setValue,
  data,
  loading,
  error,
  errors,
  workout,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(
    workout ? workout?.sp_template : data[0]
  )
  const handleTemplateChange = (event) => {
    const selectedTemplatea = data.find(
      (item) => item.id === event.target.value
    )
    setSelectedTemplate(selectedTemplatea)
    setValue('sp_template_id', event.target.value)
    setValue('dependencies', []) // clear the dependencies selections
  }

  if (loading) {
    return (
      <>
        <Skeleton height='70px' />
        <Skeleton height='70px' />
      </>
    )
  }
  if (error) return `Error: ${error.message}`

  const selectedTemplateData = data.find(
    (item) => item.name === selectedTemplate?.name
  )

  return (
    <>
      <SelectInput
        name='sp_template_id'
        control={control}
        label='Template'
        onChange={handleTemplateChange}
        value={selectedTemplate.id}
        // error={errors.sp_template_id}
        // helperText={errors.sp_template_id?.message}
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
      {selectedTemplateData && (
        <MultiSelect
          name='dependencies'
          control={control}
          options={selectedTemplateData.dependencies.map((dep) => ({
            id: dep?.id,
            name: dep?.name,
          }))}
          label='Dependencies'
        />
      )}
    </>
  )
}

export default TemplateDependencies
