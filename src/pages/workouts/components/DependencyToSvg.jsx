/* eslint-disable react/prop-types */
import { Box, Tooltip } from '@mui/material'
import { reactRedux, reactRouterDom } from '../../../assets/dependencies'

const TemplateToSvg = ({ template }) => {
  const getImage = (templateName) => {
    switch (templateName) {
      case 'react-router-dom':
        return reactRouterDom
      case 'react-redux':
        return reactRedux
      default:
        return null
    }
  }

  const image = getImage(template)

  return (
    <Tooltip title={template} placement='left'>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {image && <img src={image} alt={template} width='17px' height='17px' />}
      </Box>
    </Tooltip>
  )
}

export default TemplateToSvg
