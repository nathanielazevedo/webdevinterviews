/* eslint-disable react/prop-types */
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { useSandpack } from '@codesandbox/sandpack-react'
import { useContext } from 'react'
import ReactDiffViewer from 'react-diff-viewer'
import { Close } from '@mui/icons-material'
import { WorkoutContext } from '../../../../contexts/WorkoutContext'

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
  const { workout } = useContext(WorkoutContext)

  const localFile = sandpack.files[selectedFile]?.code
  let serverFile
  if (selectedFile === '/package.json') {
    try {
      serverFile = workout?.package[selectedFile]?.code
    } catch {
      serverFile = ''
    }
  } else if (selectedFile.split('/')[1] === 'shared') {
    try {
      serverFile = workout.shared[selectedFile]?.code
    } catch {
      serverFile = ''
    }
  } else if (isSolution) {
    try {
      serverFile = workout.solution[selectedFile]?.code
    } catch {
      serverFile = ''
    }
  } else {
    try {
      serverFile = workout.template[selectedFile]?.code
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
