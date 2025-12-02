const db = require('../config/db');

function insertOrder(order) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      const insertOrderQuery = `
        INSERT INTO "Order" (orderId, value, creationDate)
        VALUES (?, ?, ?)
      `;

      db.run(
        insertOrderQuery,
        [order.orderId, order.value, order.creationDate],
        function (err) {
          if (err) {
            db.run('ROLLBACK');
            return reject(err);
          }

          const insertItemQuery = `
            INSERT INTO "Items" (orderId, productId, quantity, price)
            VALUES (?, ?, ?, ?)
          `;

          let pending = order.items.length;

          if (pending === 0) {
            db.run('COMMIT');
            return resolve();
          }

          order.items.forEach((item) => {
            db.run(
              insertItemQuery,
              [order.orderId, item.productId, item.quantity, item.price],
              (err2) => {
                if (err2) {
                  db.run('ROLLBACK');
                  return reject(err2);
                }

                pending -= 1;
                if (pending === 0) {
                  db.run('COMMIT');
                  resolve();
                }
              }
            );
          });
        }
      );
    });
  });
}

function findOrderById(orderId) {
  return new Promise((resolve, reject) => {
    const orderQuery = `
      SELECT orderId, value, creationDate
      FROM "Order"
      WHERE orderId = ?
    `;

    db.get(orderQuery, [orderId], (err, orderRow) => {
      if (err) return reject(err);
      if (!orderRow) return resolve(null);

      const itemsQuery = `
        SELECT productId, quantity, price
        FROM "Items"
        WHERE orderId = ?
      `;

      db.all(itemsQuery, [orderId], (err2, itemRows) => {
        if (err2) return reject(err2);

        const items = itemRows.map((row) => ({
          productId: row.productId,
          quantity: row.quantity,
          price: Number(row.price)
        }));

        const itemsTotal = items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );

        resolve({
          orderId: orderRow.orderId,
          value: Number(orderRow.value),
          creationDate: orderRow.creationDate,
          items,
          itemsTotal
        });
      });
    });
  });
}

function listAllOrders() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT orderId, value, creationDate FROM "Order"';

    db.all(query, [], (err, rows) => {
      if (err) return reject(err);
      resolve(
        rows.map((row) => ({
          orderId: row.orderId,
          value: Number(row.value),
          creationDate: row.creationDate
        }))
      );
    });
  });
}

function updateOrder(orderId, updates) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE "Order"
      SET value = ?, creationDate = ?
 WHERE orderId = ?
    `;

    db.run(
      query,
      [updates.value, updates.creationDate, orderId],
      function (err) {
        if (err) return reject(err);
        if (this.changes === 0) return resolve(null);

        resolve({
          orderId,
          value: updates.value,
          creationDate: updates.creationDate
        });
      }
    );
  });
}

function deleteOrder(orderId) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      db.run('DELETE FROM "Items" WHERE orderId = ?', [orderId], (err) => {
        if (err) {
          db.run('ROLLBACK');
          return reject(err);
        }

        db.run(
          'DELETE FROM "Order" WHERE orderId = ?',
          [orderId],
          function (err2) {
            if (err2) {
              db.run('ROLLBACK');
              return reject(err2);
            }

            db.run('COMMIT');
            resolve(this.changes > 0);
          }
        );
      });
    });
  });
}

module.exports = {
  insertOrder,
  findOrderById,
  listAllOrders,
  updateOrder,
  deleteOrder
};
