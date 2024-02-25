import * as React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionActions from '@mui/material/AccordionActions'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'
import { Typography } from '@mui/material'
import displayNameImage from '../assets/display_name.png'
import accessCode from '../assets/access_code.png'

export default function AccordionUsage() {
  return (
    <div>
      <Typography variant='h3' mb={'20px'} color='grey.500'>
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
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel2-content'
          id='panel2-header'
        >
          How to find the access code
        </AccordionSummary>
        <AccordionDetails>
          <img src={accessCode} width={'100%'} />
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
