import {age, name} from './data.js'
import hello from './hello.js'

export default function Cart() {
  return (
    <div>
      <h4 className="title">Cart</h4>
      <CartItem/>
      <CartItem/>
      <CartItem/>
      <Button color="red"/>
      <Button color="blue"/>
    </div>
  )
} 

function CartItem() {
  return (
      <div className="cart-item">
        <p>{hello}</p>
        <p>상품명 {age}</p>
        <p>$40</p>
        <p>1개</p>
      </div>
  )
}

function Button() {
  return (
    <button style={{ background : 'props.color' }}>Button</button>
  )
}
