/* eslint-disable react/prop-types */
// Panel.js

const Panel = ({ panel, tab, index }) => {
  return <div hidden={tab === index ? false : true}>{panel}</div>
}

export default Panel
