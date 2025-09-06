const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const authController = require('./controllers/authController');
const productController = require('./controllers/productController');
const cartController = require('./controllers/cartController');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'yourSecret',
  resave: false,
  saveUninitialized: false,
}));
app.set('view engine', 'ejs'); // or pug, handlebars, etc.

// Routes
app.get('/register', authController.showRegister);
app.post('/register', authController.register);
app.get('/login', authController.showLogin);
app.post('/login', authController.login);
app.get('/logout', authController.logout);

app.get('/products', productController.list);
app.get('/products/create', productController.showCreate);
app.post('/products/create', productController.create);
app.get('/products/:id', productController.showDetail);
// Add more routes as needed

app.get('/cart', cartController.viewCart);
app.post('/cart/add', cartController.addToCart);
app.post('/cart/checkout', cartController.checkout);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});