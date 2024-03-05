import { useContext } from 'react'
import { WorkoutContext } from '../../contexts/WorkoutContext'

import CodeIcon from '@mui/icons-material/Code'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import CloseIcon from '@mui/icons-material/Close'

import { Link } from '@mui/material'
import { NavLink } from 'react-router-dom'
import Typography from '@mui/material/Typography'

const WorkoutSideNav = () => {
  const { workout } = useContext(WorkoutContext)

  const links = [
    {
      name: '',
      icon: <CloseIcon sx={{ color: 'inherit' }} />,
      path: `/workouts`,
      end: true,
      replace: true,
    },
    {
      name: 'EDITOR',
      icon: <CodeIcon sx={{ color: 'inherit' }} />,
      path: `/workouts/${workout.id}`,
      end: true,
      replace: true,
    },
    {
      name: 'SOLUTION',
      icon: <VisibilityOutlinedIcon sx={{ color: 'inherit' }} />,
      path: `/workouts/${workout.id}/solution`,
      end: true,
      replace: true,
    },
  ]

  return (
    <div className='side-nav-wrapper'>
      {links.map((link) => (
        <Link
          component={NavLink}
          key={link.path}
          end={link.end}
          to={link.path}
          color={'text.secondary'}
          replace={link.replace}
          className={({ isActive }) => (isActive ? 'active' : 'not-active')}
          underline='hover'
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {link.icon}
          <Typography sx={{ fontSize: '8px', color: 'inherit' }}>
            {link.name}
          </Typography>
        </Link>
      ))}
    </div>
  )
}

export default WorkoutSideNav
