/* eslint-disable react/prop-types */
import Box from '@mui/material/Box'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { TreeView } from '@mui/x-tree-view/TreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const SideNav1 = () => {
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        width: '200px',
        borderRight: '0.5px solid var(--divider)',
        transition: 'width 0.3s ease-in-out',
        padding: '0px 0px',
      }}
    >
      <Box
        sx={{
          height: '35px',
          borderBottom: '0.5px solid var(--divider)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '0px 15px',
        }}
      >
        <Typography
          sx={{
            fontSize: '12px',
            color: 'grey.600',
          }}
        >
          EXPLORER
        </Typography>
      </Box>
      <Box sx={{ minHeight: 180, flexGrow: 1 }}>
        <TreeView
          aria-label='file system navigator'
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          defaultExpanded={['8']}
          defaultSelected={['8']}
          sx={{
            color: 'grey.200',
            marginTop: '15px',
            padding: '0 5px',
          }}
        >
          <TreeItem
            nodeId='8'
            label='WORKOUTS'
            onClick={() => {
              navigate('/workouts')
            }}
          >
            <TreeItem
              nodeId='7'
              label='html'
              onClick={() => {
                navigate('/workouts/html')
              }}
            />
            <TreeItem
              nodeId='9'
              label='css'
              onClick={() => {
                navigate('/workouts/css')
              }}
            />
            <TreeItem
              nodeId='1'
              label='react'
              onClick={() => {
                navigate('/workouts/react')
              }}
            >
              <TreeItem
                nodeId='2'
                label='router'
                onClick={() => {
                  navigate('/workouts/react/router')
                }}
              />
              <TreeItem
                nodeId='10'
                label='pure react'
                onClick={() => {
                  navigate('/workouts/react/pure')
                }}
              />
            </TreeItem>
          </TreeItem>
        </TreeView>
      </Box>
    </Box>
  )
}

export default SideNav1
