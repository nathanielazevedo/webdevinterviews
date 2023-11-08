/* eslint-disable no-unused-vars */
const data = {
  a: 20,
  t: 20,
  c: 20,
  g: 10,
  q: 10,
}

const CIRCUMFERENCE = 360

const App = () => {
  const dataValues = Object.values(data)
  const total = dataValues.reduce((a, b) => a + b, 0)
  let startAngle = 0
  const radius = 100

  return (
    <div className='circle'>
      <svg viewBox='-110 -110 220 220'>
        {dataValues.map((value, i) => {
          const sliceAngle = (value / total) * CIRCUMFERENCE
          const endAngle = startAngle + sliceAngle
          const largeArcFlag = sliceAngle > 180 ? 1 : 0
          const x1 = radius * Math.sin((startAngle * Math.PI) / 180)
          const y1 = -radius * Math.cos((startAngle * Math.PI) / 180)
          const x2 = radius * Math.sin((endAngle * Math.PI) / 180)
          const y2 = -radius * Math.cos((endAngle * Math.PI) / 180)
          startAngle = endAngle

          return (
            <path
              key={i}
              d={`M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
              fill={`hsl(${i * (360 / dataValues.length)}, 100%, 50%)`}
            />
          )
        })}
      </svg>
    </div>
  )
}

export default App
