import sqlite3 from 'sqlite3';
export const db = new sqlite3.Database('./database.db', (e) => {
    if (e) {
      console.error('Hiba az adatbázis létrehozása közben:', err.message);
    } else {
      console.log('Adatbázis csatlakoztatva');
    }
  });
  
  
  
  // Az adatbázis inicializálása (ha nincs, létrehozza)
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    )`);
  });
  
  db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS store (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        storename TEXT,
        zip INT,
        region TEXT
      )`);
    });