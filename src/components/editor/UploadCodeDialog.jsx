import PropTypes from 'prop-types'
import { useSandpack } from '@codesandbox/sandpack-react'
import { ObjectInspector, chromeDark } from 'react-inspector'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  DialogContentText,
  DialogActions,
} from '@mui/material'
import { useContext, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import WorkoutContext from '../../pages/workout/root/WorkoutContext'
import { AuthContext } from '../../pages/AuthContext'
import { LogContext } from '../../pages/LogContext'

const UploadCodeDialog = ({ open, setOpen, isSolution }) => {
  const { sandpack } = useSandpack()
  const [loading, setLoading] = useState(false)
  const { workoutData } = useContext(WorkoutContext)
  const { API } = useContext(AuthContext)
  const { addLog } = useContext(LogContext)

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = async () => {
    setLoading(true)
    try {
      // console.log(typeof sandpack.files)
      if (isSolution) {
        await API.put(
          `/workouts/${workoutData.id}/upload-solution`,
          JSON.stringify(sandpack.files)
        )
      } else {
        await API.put(
          `/workouts/${workoutData.id}/upload-template`,
          JSON.stringify(sandpack.files)
        )
      }
      setLoading(false)
      setOpen(false)
      // return redirect(`/workouts/${params.id}`)
    } catch (error) {
      // Handle the error here, e.g., by showing an error message to the user
      addLog({ method: 'log', data: ['Code uploaded.'] })
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        Upload Files
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText mb='20px'>
          You will be uploading the following files to your workout:
        </DialogContentText>
        <form onSubmit={onSubmit} id='upload-code-form'>
          <Box
            sx={{
              padding: '10px 20px 20px 20px',
            }}
          >
            <ObjectInspector
              data={sandpack.files}
              // name='files'
              theme={{
                ...chromeDark,
                ...{
                  TREENODE_PADDING_LEFT: 15,
                  BASE_FONT_SIZE: '15px',
                  BASE_FONT_FAMILY: 'Bai jamjuree',
                  BASE_BACKGROUND_COLOR: 'transparent',
                  TREENODE_FONT_FAMILY: 'Bai jamjuree',
                  TREENODE_LINE_HEIGHT: 1.5,
                  ARROW_FONT_SIZE: 10,
                  OBJECT_NAME_COLOR: 'white',
                  OBJECT_PREVIEW_OBJECT_MAX_PROPERTIES: 3,
                  OBJECT_VALUE_STRING_COLOR: '#19e4ff',
                },
              }}
              expandLevel={1}
            />
            {/* Display errors */}
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onSubmit} variant='outlined' disabled={loading}>
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
      </DialogActions>
    </Dialog>
  )
}

UploadCodeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
}

export default UploadCodeDialog
