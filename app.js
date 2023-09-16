const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const users = [
  { username: 'admin', fullname: 'Admin User', password: 'admin123', role: 1 },
  { username: 'user1', fullname: 'Regular User', password: 'user123', role: 0 }
];

function UserContra(req, res, next) {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    return res.json({ message: 'No tienes acceso pillin' });
  }
  req.user = user;
  next();
}

function RolUsuario(role) {
  return (req, res, next) => {
    if (req.user.role === role) {
      next();
    } else {
      return res.status(403).json({ message: 'sin acceso ladron' });
    }
  };
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});


app.post('/login', UserContra, (req, res) => {
  res.redirect('/home');
});

app.get('/home', (req, res) => {

res.sendFile(__dirname + '/index.html');
});


app.get('/customers', UserContra, RolUsuario(1), (req, res) => {
  res.send('Ruta /customers para usuarios regulares');
});

app.get('/controlpanel', UserContra, RolUsuario(1), (req, res) => {
  res.send('Ruta /controlpanel para administradores');
});


app.get('/quienessomos', (req, res) => {
  res.send('Has ingresado a quienessomos');
});


const properties = [];

app.post('/property', (req, res) => {
  const { idProperty, addressProperty, valueProperty } = req.body;
  if (properties.some((p) => p.idProperty === idProperty)) {
    return res.status(400).json({ message: 'El idProperty ya existe' });
  }
  properties.push({ idProperty, addressProperty, valueProperty });
  res.json({ message: 'Propiedad agregada exitosamente' });
});


app.put('/actualizar', (req, res) => {
  res.send('Has ingresado a la ruta PUT actualizar');
});


app.delete('/eliminar', (req, res) => {
  res.send('Has ingresado a la ruta DELETE /eliminar');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
