import { Box, Tooltip } from '@mui/material'
import { react, vanilla } from '../../../assets/template'

const TemplateToSvg = ({ template }) => {
  const getImage = (templateName) => {
    switch (templateName) {
      case 'react':
        return react
      case 'vanilla':
        return vanilla
      default:
        return null
    }
  }

  const image = getImage(template)

  return (
    <Tooltip title={template} placement='bottom'>
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
