import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Cart from './Cart';
import './App.css';

import imgKlasyczne from './images/dempliong-removebg-preview.png';
import imgKurczak from './images/kura-removebg-preview.png';
import imgGrzyby from './images/grybb-removebg-preview.png';
import imgTurk from './images/turki-removebg-preview.png';
import imgDzicz from './images/dicz-removebg-preview.png';
import imgLos from './images/los-removebg-preview.png';
import imgLosos from './images/losos-removebg-preview.png';


function Products({ addToCart }) {
  const [pelmeni, setPelmeni] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState(''); 

  const [showCustom, setShowCustom] = useState(false);
  const [meat, setMeat] = useState('wołowina');
  const [dough, setDough] = useState('klasyczne');
  const [extra, setExtra] = useState('bez dodatków');

  useEffect(() => {
    fetch('http://localhost:5000/api/pelmeni')
      .then(res => res.json())
      .then(data => setPelmeni(data))
      .catch(err => console.error('Błąd:', err));
  }, []);

   const pelmeniWithImages = pelmeni.map(p => {
  switch (p.id) {
    case 1: return { ...p, image: imgKlasyczne };
    case 2: return { ...p, image: imgKurczak };
    case 3: return { ...p, image: imgGrzyby };
    case 4: return { ...p, image: imgTurk };
    case 5: return { ...p, image: imgDzicz };
    case 6: return { ...p, image: imgLos };
    case 7: return { ...p, image: imgLosos };
    default: return p;
  }
  });
  
  const filteredProducts = pelmeniWithImages.filter(item => {
  const matchesCategory = filter === 'all' || item.category === filter;
  const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
  return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <h1>🥟 Пельмени Marketplace</h1>
      
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="🔍 Szukaj produktu..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-buttons">
        <button onClick={() => setFilter('all')}>Wszystkie</button>
        <button onClick={() => setFilter('meat')}>Z mięsem</button>
        <button onClick={() => setFilter('vege')}>Vege</button>
      </div>

      <div className="products">
  {filteredProducts.length === 0 ? (
    <p>Nie znaleziono produktów</p>
  ) : (
    filteredProducts.map(item => (
      <div key={item.id} className="product-card">
        {item.image && (
          <img src={item.image} alt={item.name} style={{width: '100%', borderRadius: '8px'}} />
        )}
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <p><strong>{item.price} zł</strong></p>
        <button onClick={() => addToCart(item)}>Dodaj do koszyka</button>
      </div>
    ))
  )}

  <div className="product-card custom-pelmen-card">
    <h3>ZAMIKSUJ SWÓJ ПЕЛЬМЕНЬ</h3>

    {!showCustom ? (
      <>
        <p>Wybierz składniki i dodaj własny zestaw do koszyka.</p>
        <button onClick={() => setShowCustom(true)}>
          Otwórz kreator
        </button>
      </>
    ) : (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const customProduct = {
            id: Date.now(),
            name: `Пельмени: ${meat}, ciasto ${dough}`,
            description: `Mięso: ${meat}, ciasto: ${dough}, dodatki: ${extra}`,
            price: 25
          };
          addToCart(customProduct);
        }}
      >
        <div className="custom-row">
          <label>Mięso:</label>
          <select value={meat} onChange={e => setMeat(e.target.value)}>
            <option>wołowina</option>
            <option>wieprzowina</option>
            <option>kurczak</option>
            <option>mix mięs</option>
            <option>bez mięsa</option>
          </select>
        </div>

        <div className="custom-row">
          <label>Ciasto:</label>
          <select value={dough} onChange={e => setDough(e.target.value)}>
            <option>klasyczne</option>
            <option>cienkie</option>
            <option>pełnoziarniste</option>
          </select>
        </div>

        <div className="custom-row">
          <label>Dodatki:</label>
          <select value={extra} onChange={e => setExtra(e.target.value)}>
            <option>bez dodatków</option>
            <option>czosnek</option>
            <option>koperek</option>
            <option>ostra papryka</option>
          </select>
        </div>

        <button type="submit">Dodaj własny zestaw (25 zł)</button>
      </form>
    )}
  </div>
</div>

    </div>
  );
}

function App() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    
    alert(`Dodano: ${item.name}`);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
   <Router>
      <div className="App layout">
        <div className="side-banner">
          TUTAJ MOGLA BYĆ TWOJA REKLAMA<br/>
          TUTAJ MOGLA BYĆ TWOJA REKLAMA<br/>
          TUTAJ MOGLA BYĆ TWOJA REKLAMA<br/>
          TUTAJ MOGLA BYĆ TWOJA REKLAMA<br/>
          TUTAJ MOGLA BYĆ TWOJA REKLAMA
        </div>

        <div className="main-content">
          <nav className="navbar">
            <Link to="/">Produkty</Link>
            <Link to="/cart">Koszyk ({totalItems})</Link>
          </nav>

          <Routes>
            <Route path="/" element={<Products addToCart={addToCart} />} />
            <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
          </Routes>
        </div>

        <div className="side-banner">
            TUTAJ MOGLA BYĆ TWOJA REKLAMA<br/>
            TUTAJ MOGLA BYĆ TWOJA REKLAMA<br/>
            TUTAJ MOGLA BYĆ TWOJA REKLAMA<br/>
            TUTAJ MOGLA BYĆ TWOJA REKLAMA<br/>
            TUTAJ MOGLA BYĆ TWOJA REKLAMA
        </div>
      </div>
    </Router>
  );
}

export default App;
