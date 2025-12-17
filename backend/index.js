
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Tymczasowa lista produktów
const pelmeni = [
  { id: 1, name: 'Пельмени klasyczne', price: 15, description: 'Z mięsem wieprzowo-wołowym', category: 'meat' },
  { id: 2, name: 'Пельмени z kurczakiem', price: 18, description: 'Lekkie i smaczne', category: 'meat' },
  { id: 3, name: 'Пельмени z grzybami', price: 20, description: 'Wege opcja z leśnymi grzybami', category: 'vege' },
  { id: 4, name: 'Пельмени z indykiem', price: 22, description: 'Duże z indykiem', category: 'meat' },
  { id: 5, name: 'Пельмени z dziczą', price: 16, description: 'Soczyste z dziczą', category: 'vege' },
  { id: 6, name: 'Пельмени z losiem', price: 14, description: 'Z nutami lasu', category: 'vege' },
  { id: 7, name: 'Пельмени z lososiem', price: 28, description: 'Z prawdziwym lososiem', category: 'meat' },
];

// Endpoint zwracający listę
app.get('/api/pelmeni', (req, res) => {
  res.json(pelmeni);
});

let orders = []; // Tymczasowe przechowywanie zamówień

app.post('/api/order', (req, res) => {
  const order = {
    orderId: Date.now(),
    ...req.body,
    date: new Date()
  };
  
  orders.push(order);
  console.log('Nowe zamówienie:', order);
  
  res.json({ 
    success: true, 
    orderId: order.orderId,
    message: 'Zamówienie przyjęte!' 
  });
});

app.listen(5000, () => {
  console.log('Backend działa na http://localhost:5000');
});
