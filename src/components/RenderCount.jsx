/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef } from 'react'

export const RenderCounter = ({ name }) => {
  const renderCounter = useRef(0)
  renderCounter.current = renderCounter.current + 1
  // console.log(name, renderCounter.current)
  return <></>
}
