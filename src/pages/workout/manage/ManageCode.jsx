import { useContext } from 'react'
import { Box, Typography } from '@mui/material'
import { ObjectInspector, chromeDark } from 'react-inspector'
import WorkoutContext from '../root/WorkoutContext'

const ManageCode = () => {
  const { workoutData: workout } = useContext(WorkoutContext)
  const templateFile = workout.dynamo_data.template
  const solutionFile = workout.dynamo_data.solution
  const sharedFile = workout.dynamo_data.shared

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '30px',
        gap: '30px',
        height: '100%',
      }}
    >
      <Box>
        <Typography variant='h4'>Code Viewer</Typography>
        <Typography variant='body2' sx={{ color: 'grey.400' }}>
          This is the code for both the template and solution files. This page
          just shows the code, you can't edit it here. <br /> To edit the code,
          go to the EDITOR and SOLUTION pages.
        </Typography>
      </Box>
      <Box
        sx={{
          width: '100%',
        }}
      >
        <Typography variant='h6'>Template Files</Typography>
        <ObjectInspector
          data={templateFile}
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
          expandLevel={2}
        />
      </Box>

      <Box
        sx={{
          width: '100%',
        }}
      >
        <Typography variant='h6'>Solution Files</Typography>
        <ObjectInspector
          data={solutionFile}
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
          expandLevel={2}
        />
      </Box>
      <Box
        sx={{
          width: '100%',
        }}
      >
        <Typography variant='h6'>Shared Files</Typography>
        <ObjectInspector
          data={sharedFile}
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
          expandLevel={2}
        />
      </Box>
    </Box>
  )
}

export default ManageCode
