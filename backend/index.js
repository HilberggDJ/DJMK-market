const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { JSONFilePreset } = require('lowdb/node');

const dbAdapter = JSONFilePreset;

const app = express();
app.use(cors());
app.use(express.json());

// Tymczasowa lista produktów – zostaje
const pelmeni = [
  { id: 1, name: 'Пельмени klasyczne', price: 15, description: 'Z mięsem wieprzowo-wołowym', category: 'meat' },
  { id: 2, name: 'Пельмени z kurczakiem', price: 18, description: 'Lekkie i smaczne', category: 'meat' },
  { id: 3, name: 'Пельмeni z grzybami', price: 20, description: 'Wege opcja z leśnymi grzybami', category: 'vege' },
  { id: 4, name: 'Пельмeni z indykiem', price: 22, description: 'Duże z indykiem', category: 'meat' },
  { id: 5, name: 'Пельмeni z dziczą', price: 16, description: 'Soczyste z dziczą', category: 'vege' },
  { id: 6, name: 'Пельmeni z losiem', price: 14, description: 'Z nutami lasu', category: 'vege' },
  { id: 7, name: 'Пельmeni z lososiem', price: 28, description: 'Z prawdziwym lososiem', category: 'meat' },
];

// GET – bez zmian
app.get('/api/pelmeni', (req, res) => {
  res.json(pelmeni);
});

// NOWY endpoint
app.post('/orders', async (req, res) => {
  const products = req.body;

  const db = await dbAdapter('db.json', {
    products: [], orders: []
  });

  const databaseTables = db.data;
  const dbProducts = databaseTables.products;
  const dbOrders = databaseTables.orders;

  const id = crypto.randomUUID();

  for (let product of products) {
    const i = dbProducts.findIndex((pr) => pr.Id === product.Id);
    dbProducts[i].Qty -= Number(product.Qty);
  }

  dbOrders.push({
    id: id,
    date: new Date(),
    products: products.map((product) => ({
      id: product.Id,
      qty: product.Qty
    }))
  });

  await db.write();

  res.json('OK');
});

app.listen(5000, () => {
  console.log('Backend działa na http://localhost:5000');
});
