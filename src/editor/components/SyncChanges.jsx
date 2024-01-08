/* eslint-disable react/prop-types */
import { Button } from '@mui/material'
import { useSandpack } from '@codesandbox/sandpack-react'
import { useContext, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { WorkoutContext } from '../../pages/workout/root/WorkoutContext'
import { LogContext } from '../../pages/LogContext'
import { AuthContext } from '../../pages/AuthContext'
import { separateFiles } from '../utils'

const SyncChanges = ({ changedFiles, isSolution }) => {
  const [loading, setLoading] = useState(false)
  const { sandpack } = useSandpack()
  const { workoutData, setData } = useContext(WorkoutContext)
  const { addLog } = useContext(LogContext)
  const { API } = useContext(AuthContext)

  const onSubmit = async () => {
    const { sharedFiles, otherFiles, packageJson } = separateFiles(
      sandpack.files
    )
    setLoading(true)
    try {
      if (isSolution) {
        await API.put(
          `/workouts/${workoutData.id}/upload-solution`,
          JSON.stringify(otherFiles)
        )
        setData((prev) => ({
          ...prev,
          dynamo_data: {
            ...prev.dynamo_data,
            solution: otherFiles,
          },
        }))
      } else {
        await API.put(
          `/workouts/${workoutData.id}/upload-template`,
          JSON.stringify(otherFiles)
        )
        setData((prev) => ({
          ...prev,
          dynamo_data: {
            ...prev.dynamo_data,
            template: otherFiles,
          },
        }))
      }
      await API.put(
        `/workouts/${workoutData.id}/upload-shared`,
        JSON.stringify(sharedFiles)
      )
      setData((prev) => ({
        ...prev,
        dynamo_data: {
          ...prev.dynamo_data,
          shared: sharedFiles,
        },
      }))
      if (changedFiles.indexOf('/package.json')) {
        await API.put(
          `/workouts/${workoutData.id}/upload-package`,
          JSON.stringify(packageJson)
        )
        setData((prev) => ({
          ...prev,
          dynamo_data: {
            ...prev.dynamo_data,
            packageJson,
          },
        }))
      }
      addLog({ method: 'log', data: ['Code uploaded.'] })
      setLoading(false)
      // return redirect(`/workouts/${params.id}`)
    } catch (error) {
      console.log(error)
      // Handle the error here, e.g., by showing an error message to the user
      addLog({ method: 'error', data: ['Error uploading code.'] })
      setLoading(false)
    }
  }

  return (
    <Button
      variant='contained'
      onClick={() => onSubmit()}
      size='small'
      fullWidth
      sx={{ mt: 1 }}
      disabled={changedFiles?.length === 0 || loading}
    >
      {loading ? (
        <CircularProgress
          size={24}
          sx={{
            color: 'primary.main',
          }}
        />
      ) : (
        'Upload'
      )}
    </Button>
  )
}

export default SyncChanges
