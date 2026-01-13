import { useState } from 'react';
import './Cart.css';

function Cart({ cart, setCart }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  // Dodaj te funkcje - brakowało ich!
  const increaseQuantity = (index) => {
    const newCart = [...cart];
    newCart[index].quantity += 1;
    setCart(newCart);
  };

  const decreaseQuantity = (index) => {
    const newCart = [...cart];
    if (newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
      setCart(newCart);
    } else {
      removeFromCart(index);
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

const handleOrder = (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    alert('Koszyk jest pusty!');
    return;
  }

  const productsForApi = cart.map(item => ({
    Id: item.id,
    Qty: item.quantity
  }));

  fetch('http://localhost:5000/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productsForApi)
  })
    .then(res => res.json())
    .then(data => {
      if (data === 'OK') {
        alert('Zamówienie złożone!');
        setCart([]);
        setName('');
        setAddress('');
        setPhone('');
      } else {
        alert('Błąd przy składaniu zamówienia');
      }
    })
    .catch(err => console.error('Błąd:', err));
};



  return (
    <div className="cart-page">
      <h2>🛒 Twój koszyk</h2>
      
      {cart.length === 0 ? (
        <p>Koszyk jest pusty</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <div>
                  <h3>{item.name}</h3>
                  <div className="quantity-controls">
                    <button onClick={() => decreaseQuantity(index)}>-</button>
                    <span>{item.quantity} szt.</span>
                    <button onClick={() => increaseQuantity(index)}>+</button>
                  </div>
                </div>
                <p><strong>{item.price * item.quantity} zł</strong></p>
                <button onClick={() => removeFromCart(index)} className="remove-btn">Usuń</button>
              </div>
            ))}
          </div>

          <h3>Suma: {totalPrice} zł</h3>

          <form onSubmit={handleOrder} className="order-form">
            <h3>Formularz zamówienia</h3>
            <input 
              type="text" 
              placeholder="Imię i nazwisko" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
            <input 
              type="text" 
              placeholder="Adres dostawy" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required 
            />
            <input 
              type="tel" 
              placeholder="Telefon" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required 
            />
            <button type="submit">Złóż zamówienie</button>
          </form>
        </>
      )}
    </div>
  );
}

export default Cart;
