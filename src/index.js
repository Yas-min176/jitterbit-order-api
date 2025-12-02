const express = require('express');
const orderRoutes = require('./routes/orderRoutes');
require('./config/db');

const app = express();
const port = 3000;

app.use(express.json());
app.use(orderRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'API de Pedidos - Jitterbit Challenge',
    version: '1.0.0',
    endpoints: {
      create: 'POST /order',
      list: 'GET /order/list',
      getById: 'GET /order/:orderId',
      update: 'PUT /order/:orderId',
      delete: 'DELETE /order/:orderId'
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
