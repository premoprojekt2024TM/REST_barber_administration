const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { userSchema, storeSchema } = require('./validation'); // Zod séma importálása

const app = express();
app.use(express.json()); // Middleware a JSON body kezeléséhez

// SQLite adatbázis létrehozása vagy megnyitása
const db = new sqlite3.Database('./database.db', (e) => {
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









// POST kérés az /api/v1/user végponton
app.post('/api/v1/user', (req, res) => {
    const parseResult = userSchema.safeParse(req.body);
  
    // Ha nem sikerült a validálás, hibaüzenetet küldünk
    if (!parseResult.success) {
      return res.status(400).json({ message: 'Nem megfelelő adat', error: parseResult.error.errors });
    }
  
    const { email, password } = parseResult.data;
  
    db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], (err) => {
      if (err) return res.status(500).json({ message: 'Adatabázis hiba' });
      res.status(201).json({ message: 'Sikeres' });
    });
  });

app.get('/api/v1/user/:id', (req, res) => {
  db.get('SELECT email FROM users WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ message: 'Adatbázis hiba' });
    if (!row) return res.status(404).json({ message: 'Felhasználó nem található' });
    res.status(200).json({ message: 'Sikeres lekérdezés', user: row });
  });
}); 

app.delete('/api/v1/user/:id', (req, res) => {
    // Felhasználó törlése az adatbázisból
    db.run('DELETE FROM users WHERE id = ?', [req.params.id], function (err) {
      if (err) return res.status(500).json({ message: 'Adatbázis hiba' });
      if (this.changes === 0) return res.status(404).json({ message: 'Felhasználó nem található' });
  
      res.status(200).json({ message: 'Felhasználó törölve' });
    });
  });


app.put('/api/v1/user/:id', (req, res) => {
    const parseResult = userSchema.safeParse(req.body);
  
    // Ha nem sikerült a validálás, hibaüzenetet küldünk
    if (!parseResult.success) {
      return res.status(400).json({ message: 'Nem megfelelő adat', error: parseResult.error.errors });
    }
  
    const { email, password } = parseResult.data;
    // Felhasználó adatainak frissítése az adatbázisban
    db.run('UPDATE users SET email = ?, password = ? WHERE id = ?', [email, password, req.params.id], (err) => {
      if (err) return res.status(500).json({ message: 'Adatbázis hiba' });
      res.status(200).json({ message: 'Felhasználó frissítve' });
    });
});
  



app.post('/api/v1/createstore', function (req, res) {
    const parseResult = storeSchema.safeParse(req.body);

    if (!parseResult.success) {
        return res.status(400).json({ message: 'Nem megfelelő adat', error: parseResult.error.errors });
      }

      const { storename, zip,region } = parseResult.data;


      db.run('INSERT INTO store (storename, zip, region) VALUES (?, ?, ?)', [storename, zip,region], (err) => {
        if (err) return res.status(500).json({ message: 'Adatabázis hiba' });
        res.status(201).json({ message: 'Sikeres' });
      });


})

app.get('/api/v1/store/:id', function (req, res) {
    db.get('SELECT * FROM store WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ message: 'Adatbázis hiba' });
        if (!row) return res.status(404).json({ message: 'Bolt nem található' });
        res.status(200).json({ message: 'Sikeres lekérdezés', store: row });
      });

})









// A szerver indítása
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
