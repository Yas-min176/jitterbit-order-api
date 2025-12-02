const { mapRequestToOrderModel } = require('../services/orderService');
const orderModel = require('../models/orderModel');

async function createOrder(req, res) {
  try {
    const payload = req.body;

    if (!payload.numeroPedido || !payload.valorTotal || !payload.dataCriacao || !payload.items) {
      return res.status(400).json({ 
        message: 'Campos obrigatórios ausentes no payload',
        required: ['numeroPedido', 'valorTotal', 'dataCriacao', 'items']
      });
    }

    const order = mapRequestToOrderModel(payload);
    await orderModel.insertOrder(order);

    return res.status(201).json({
      message: 'Pedido criado com sucesso',
      orderId: order.orderId
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return res.status(500).json({ 
      message: 'Erro interno ao criar pedido',
      error: error.message 
    });
  }
}

async function getOrderById(req, res) {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findOrderById(orderId);

    if (!order) {
      return res.status(404).json({ 
        message: 'Pedido não encontrado',
        orderId 
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    return res.status(500).json({ 
      message: 'Erro interno ao buscar pedido',
      error: error.message 
    });
  }
}

async function listOrders(req, res) {
  try {
    const orders = await orderModel.listAllOrders();
    return res.status(200).json({
      total: orders.length,
      orders
    });
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    return res.status(500).json({ 
      message: 'Erro interno ao listar pedidos',
      error: error.message 
    });
  }
}

async function updateOrder(req, res) {
  try {
    const { orderId } = req.params;
    const { valorTotal, dataCriacao } = req.body;

    if (!valorTotal || !dataCriacao) {
      return res.status(400).json({ 
        message: 'Campos obrigatórios ausentes',
        required: ['valorTotal', 'dataCriacao']
      });
    }

    const updates = {
      value: valorTotal,
      creationDate: new Date(dataCriacao).toISOString()
    };

    const result = await orderModel.updateOrder(orderId, updates);

    if (!result) {
      return res.status(404).json({ 
        message: 'Pedido não encontrado',
        orderId 
      });
    }

    return res.status(200).json({
      message: 'Pedido atualizado com sucesso',
      order: result
    });
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    return res.status(500).json({ 
      message: 'Erro interno ao atualizar pedido',
      error: error.message 
    });
  }
}

async function deleteOrder(req, res) {
  try {
    const { orderId } = req.params;
    const deleted = await orderModel.deleteOrder(orderId);

    if (!deleted) {
      return res.status(404).json({ 
        message: 'Pedido não encontrado',
        orderId 
      });
    }

    return res.status(200).json({
      message: 'Pedido deletado com sucesso',
      orderId
    });
  } catch (error) {
    console.error('Erro ao deletar pedido:', error);
    return res.status(500).json({ 
      message: 'Erro interno ao deletar pedido',
      error: error.message 
    });
  }
}

module.exports = {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  deleteOrder
};
