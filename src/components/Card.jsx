import * as React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router'

export default function MediaCard({ card }) {
  const to = card.to
  const navigate = useNavigate()
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia sx={{ height: 140 }} image={card.image} title='green iguana' />
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          {card.title}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {card.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size='small' onClick={() => navigate(to)}>
          {card.buttonText}
        </Button>
      </CardActions>
    </Card>
  )
}
