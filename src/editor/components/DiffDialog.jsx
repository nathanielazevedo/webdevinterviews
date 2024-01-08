/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Icon,
  IconButton,
} from '@mui/material'
import { useSandpack } from '@codesandbox/sandpack-react'
import { useContext } from 'react'
import ReactDiffViewer from 'react-diff-viewer'
import { Close } from '@mui/icons-material'
import { WorkoutContext } from '../../pages/workout/root/WorkoutContext'
import Workout from '../../models/workout'

const newStyles = {
  variables: {
    dark: {
      highlightBackground: '#fefed5',
      highlightGutterBackground: '#ffcd3c',
    },
  },
  line: {
    padding: '10px 2px',
    fontSize: '14px',
  },
}

const DiffDialog = ({ onClose, selectedFile, isSolution }) => {
  const { sandpack } = useSandpack()
  const { workoutData } = useContext(WorkoutContext)
  const workout = new Workout(workoutData)
  console.log(workout)

  const localFile = sandpack.files[selectedFile]?.code
  let serverFile
  if (selectedFile === '/package.json') {
    serverFile = workout.dynamoData.packageJson[selectedFile]?.code
  } else if (selectedFile.split('/')[1] === 'shared') {
    serverFile = workout.dynamoData.shared[selectedFile]?.code
  } else if (isSolution) {
    serverFile = workout.dynamoData.solution[selectedFile]?.code
  } else {
    serverFile = workout.dynamoData.template[selectedFile]?.code
  }

  return (
    <Dialog
      open
      fullWidth
      sx={{
        width: '100vw',
        maxWidth: '100vw',
      }}
      PaperProps={{
        style: {
          width: '80vw',
          maxWidth: '80vw',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {selectedFile}
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <ReactDiffViewer
          oldValue={serverFile}
          newValue={localFile}
          splitView
          showDiffOnly={false}
          useDarkTheme
          leftTitle='Server Files'
          rightTitle='Local Files'
          styles={newStyles}
        />
      </DialogContent>
    </Dialog>
  )
}

export default DiffDialog
