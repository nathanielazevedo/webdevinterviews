/* eslint-disable react/prop-types */
import Item from './Item'

const Cart = ({ data, cartNumber }) => {
  return (
    <div className='cart'>
      <h2 className='cart-title'>Cart {cartNumber}</h2>
      <ul>
        {data.map((item, index) => (
          <Item key={index} item={item} index={index} />
        ))}
      </ul>
    </div>
  )
}

export default Cart
