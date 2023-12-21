import React from 'react'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import ManageTopNav from './ManageTopNav'

const ManageRoot = () => (
  <Box>
    <ManageTopNav />
    <Outlet />
  </Box>
)

export default ManageRoot
