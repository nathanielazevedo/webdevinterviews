const ScoreCircles = ({ deck, scores }) => {
  return (
    <div className='score-circles-container'>
      {Array(deck.questions.length)
        .fill()
        .map((_, index) => {
          return (
            <div
              key={index}
              className={
                'score-circle ' +
                (scores[index] === undefined
                  ? ''
                  : scores[index]
                  ? 'correct-score-circle'
                  : 'incorrect-score-circle')
              }
            ></div>
          )
        })}
    </div>
  )
}

export default ScoreCircles