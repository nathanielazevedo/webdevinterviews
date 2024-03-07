import ScoreCircles from './ScoreCircles'

const GameHead = ({ length, scores }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        paddingTop: '10px',
      }}
    >
      <ScoreCircles length={length} scores={scores} />
    </div>
  )
}

export default GameHead
