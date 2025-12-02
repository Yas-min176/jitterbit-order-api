const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar no banco SQLite:', err.message);
  } else {
    console.log('Conectado ao banco SQLite em:', dbPath);
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS "Order" (
      orderId      TEXT PRIMARY KEY,
      value        REAL NOT NULL,
      creationDate TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela Order:', err.message);
    } else {
      console.log('Tabela Order verificada/criada');
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS "Items" (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId     TEXT NOT NULL,
      productId   INTEGER NOT NULL,
      quantity    INTEGER NOT NULL,
      price       REAL NOT NULL,
      FOREIGN KEY (orderId) REFERENCES "Order"(orderId) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela Items:', err.message);
    } else {
      console.log('Tabela Items verificada/criada');
    }
  });
});

module.exports = db;
