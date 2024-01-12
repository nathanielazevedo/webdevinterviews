/* eslint-disable react/prop-types */
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
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

  const localFile = sandpack.files[selectedFile]?.code
  let serverFile
  if (selectedFile === '/package.json') {
    try {
      serverFile = workout?.dynamoData?.packageJson[selectedFile]?.code
    } catch {
      serverFile = ''
    }
  } else if (selectedFile.split('/')[1] === 'shared') {
    try {
      serverFile = workout.dynamoData.shared[selectedFile]?.code
    } catch {
      serverFile = ''
    }
  } else if (isSolution) {
    try {
      serverFile = workout.dynamoData.solution[selectedFile]?.code
    } catch {
      serverFile = ''
    }
  } else {
    try {
      serverFile = workout.dynamoData.template[selectedFile]?.code
    } catch {
      serverFile = ''
    }
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
