/* eslint-disable react/prop-types */

const Panel = ({ children, currTab, index }) => {
  return (
    <div hidden={currTab !== index}>
      {currTab === index && <div>{children}</div>}
    </div>
  )
}

export default Panel
