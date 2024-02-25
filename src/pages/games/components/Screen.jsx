import { Typography } from '@mui/material'

const Screen = ({ output, code }) => {
  return (
    <div className='code-container'>
      {output ? (
        <Typography
          variant='h4'
          className='output-container'
          dangerouslySetInnerHTML={{
            __html: output,
          }}
        ></Typography>
      ) : (
        <p
          style={{
            fontFamily: 'monospace',
          }}
          dangerouslySetInnerHTML={{
            __html: code,
          }}
        ></p>
      )}
    </div>
  )
}

export default Screen
