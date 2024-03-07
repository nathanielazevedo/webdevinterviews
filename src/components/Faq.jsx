import * as React from 'react'
import Accordion from '@mui/material/Accordion'

import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Typography } from '@mui/material'
import displayNameImage from '../assets/display_name.png'

export default function AccordionUsage() {
  return (
    <div>
      <Typography variant='h3' mb={'20px'}>
        FAQ
      </Typography>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1-content'
          id='panel1-header'
        >
          How to find your display name
        </AccordionSummary>
        <AccordionDetails>
          <img src={displayNameImage} width={'100%'} />
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
