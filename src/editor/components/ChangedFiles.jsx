/* eslint-disable indent */
/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import { useEffect, useState, useContext } from 'react'
import { Box, Typography } from '@mui/material'
import { useSandpack } from '@codesandbox/sandpack-react'
import { sourceControlStyles } from '../editorStyles'
import { WorkoutContext } from '../../pages/workout/root/WorkoutContext'
import { checkCodeDifferences } from '../utils'
import SyncChanges from './SyncChanges'
import ResetChanges from './ResetChanges'
import DiffDialog from './DiffDialog'

const ChangedFiles = ({ isSolution }) => {
  const [changedFiles, setChangedFiles] = useState([])
  const { workoutData } = useContext(WorkoutContext)
  const { sandpack } = useSandpack()
  const [diffDialogOpen, setDiffDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState('')

  const serverFiles = isSolution
    ? {
        ...workoutData.dynamo_data.solution,
        ...workoutData.dynamo_data.shared,
        ...workoutData.dynamo_data.packageJson,
      }
    : {
        ...workoutData.dynamo_data.template,
        ...workoutData.dynamo_data.shared,
        ...workoutData.dynamo_data.packageJson,
      }

  const localFiles = sandpack?.files

  useEffect(() => {
    if (!sandpack?.files) return
    const _changedFiles = checkCodeDifferences(serverFiles, localFiles)
    setChangedFiles(_changedFiles)
  }, [sandpack?.files, workoutData])

  return (
    <Box sx={sourceControlStyles}>
      <Box
        sx={{
          padding: '10px 0',
          width: '100%',
        }}
      >
        <Typography
          sx={{
            fontSize: '13px',
            mb: '5px',
          }}
        >
          CHANGED FILES ({changedFiles?.length})
        </Typography>
        {changedFiles.map((file) => (
          <Box
            key={file}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: '3px',
            }}
          >
            <Typography
              sx={{
                fontSize: '13px',
                color: 'grey.400',
                cursor: 'pointer',
                '&:hover': { color: 'primary.main' },
              }}
              onClick={() => {
                setSelectedFile(file)
                setDiffDialogOpen(true)
              }}
            >
              {file}
            </Typography>
            {/* <Tooltip title='Undo Changes'>
              <IconButton size='small'>
                <ReplayIcon
                  sx={{
                    fontSize: '13px',
                    color: 'grey.400',
                  }}
                />
              </IconButton>
            </Tooltip> */}
          </Box>
        ))}
      </Box>
      <SyncChanges changedFiles={changedFiles} isSolution={isSolution} />
      <ResetChanges changedFiles={changedFiles} />
      {diffDialogOpen && (
        <DiffDialog
          onClose={() => setDiffDialogOpen(false)}
          selectedFile={selectedFile}
          isSolution={isSolution}
        />
      )}
    </Box>
  )
}

export default ChangedFiles
