import { Link } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { forwardRef } from 'react'

const LinkBehavior = forwardRef(function NL(props, ref) {
  return <NavLink ref={ref} {...props} />
})

const TextLink = ({ to, text, end = true, icon, target }) => (
  <Link
    component={LinkBehavior}
    underline='hover'
    color={'text.secondary'}
    end={end}
    to={to}
    target={target ? target : ''}
    sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}
  >
    {icon && icon}
    {text}
  </Link>
)

export default TextLink
