/* eslint-disable react/prop-types */
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Button,
  DialogActions,
} from '@mui/material'
import * as yup from 'yup'

const schema = yup.object().shape({
  template: yup.string().required(),
  difficulty: yup.string().required(),
  dependencies: yup.array().of(yup.string().required()),
})

const FilterForm = ({ onFilter, open, setOpen }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data) => {
    onFilter(data)
  }

  return (
    <Dialog open={open} onClose={() => setOpen(!open)} fullWidth>
      <DialogTitle>Filters</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              marginBottom: 2,
              flexDirection: 'column',
            }}
          >
            <Controller
              name='template'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Template'
                  error={!!errors.template}
                  helperText={errors.template?.message}
                />
              )}
            />
            <Controller
              name='difficulty'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Difficulty'
                  error={!!errors.difficulty}
                  helperText={errors.difficulty?.message}
                />
              )}
            />
            <Controller
              name='dependencies'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Dependencies'
                  error={!!errors.dependencies}
                  helperText={errors.dependencies?.message}
                />
              )}
            />
            <DialogActions>
              <Button type='submit'>Filter</Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default FilterForm
