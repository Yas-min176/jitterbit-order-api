function mapRequestToOrderModel(payload) {
    const orderId = payload.numeroPedido.split('-').slice(0, -1).join('-');

  const order = {
    orderId: orderId,
    value: payload.valorTotal,
    creationDate: new Date(payload.dataCriacao).toISOString(),
    items: payload.items.map((item) => ({
      productId: Number(item.idItem),
      quantity: item.quantidadeItem,
      price: item.valorItem
    }))
  };

  return order;
}

module.exports = {
  mapRequestToOrderModel
};
