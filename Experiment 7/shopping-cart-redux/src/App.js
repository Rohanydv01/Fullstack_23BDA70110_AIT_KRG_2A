// App.js
import React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './shopping-cart-redux/src/store';
import { addItem, removeItem, clearCart } from './shopping-cart-redux/src/cartSlice';

const products = [
  { id: 1, name: 'T-Shirt', price: 500 },
  { id: 2, name: 'Muffler', price: 300 },
  { id: 3, name: 'Cap', price: 250 },
];

function Cart() {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalPrice } = useSelector(state => state.cart);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>🛒 Shopping Cart</h2>
      <div>
        {products.map(p => (
          <div key={p.id} style={{ margin: '10px' }}>
            <span>{p.name} - ₹{p.price}</span>
            <button onClick={() => dispatch(addItem(p))} style={{ marginLeft: '10px' }}>Add</button>
            <button onClick={() => dispatch(removeItem(p.id))} style={{ marginLeft: '5px' }}>Remove</button>
          </div>
        ))}
      </div>

      <hr style={{ margin: '20px' }} />
      <h3>Total Items: {totalQuantity}</h3>
      <h3>Total Price: ₹{totalPrice}</h3>
      <button onClick={() => dispatch(clearCart())}>Clear Cart</button>

      <div style={{ marginTop: '20px' }}>
        <h4>🧾 Cart Details</h4>
        {items.map(item => (
          <div key={item.id}>
            {item.name} x {item.quantity} = ₹{item.totalPrice}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Cart />
    </Provider>
  );
}
