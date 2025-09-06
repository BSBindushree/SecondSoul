// EcoFinds Backend - Node + Express + SQLite
const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;
const SECRET_KEY = "ecofinds_secret_change_this";

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// Initialize DB
const dbFile = path.join(__dirname, "ecofinds.db");
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) console.error("DB error:", err);
  else console.log("Connected to SQLite DB:", dbFile);
});

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT UNIQUE,
    password TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    description TEXT,
    category TEXT,
    price REAL,
    image TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);
});

// Auth middleware
function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });
  const token = authHeader.split(" ")[1] || authHeader;
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
}

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Register
app.post("/api/register", (req, res) => {
  const { username, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });
  const hashed = bcrypt.hashSync(password, 8);
  db.run("INSERT INTO users(username,email,password) VALUES(?,?,?)", [username || "", email, hashed], function (err) {
    if (err) {
      return res.status(400).json({ error: "User exists or DB error" });
    }
    res.json({ success: true, id: this.lastID });
  });
});

// Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err || !user) return res.status(400).json({ error: "Invalid credentials" });
    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY);
    res.json({ token, username: user.username, id: user.id });
  });
});

// Profile
app.get("/api/profile", authenticate, (req, res) => {
  db.get("SELECT id, username, email FROM users WHERE id = ?", [req.user.id], (err, row) => {
    if (err) return res.status(400).json({ error: "DB error" });
    res.json(row);
  });
});

app.put("/api/profile", authenticate, (req, res) => {
  const { username } = req.body;
  db.run("UPDATE users SET username = ? WHERE id = ?", [username, req.user.id], function (err) {
    if (err) return res.status(400).json({ error: "DB error" });
    res.json({ success: true });
  });
});

// Products - create
app.post("/api/products", authenticate, (req, res) => {
  const { title, description, category, price, image } = req.body;
  db.run("INSERT INTO products(user_id,title,description,category,price,image) VALUES(?,?,?,?,?,?)",
    [req.user.id, title, description, category, price || 0, image || ""],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    });
});

// Get all products (with optional search & category)
app.get("/api/products", (req, res) => {
  const { search, category } = req.query;
  let query = "SELECT p.*, u.username as seller FROM products p LEFT JOIN users u ON p.user_id=u.id WHERE 1=1";
  const params = [];
  if (search) {
    query += " AND p.title LIKE ?";
    params.push(`%${search}%`);
  }
  if (category) {
    query += " AND p.category = ?";
    params.push(category);
  }
  db.all(query, params, (err, rows) => {
    if (err) return res.status(400).json({ error: "DB error" });
    res.json(rows);
  });
});

// Get single product
app.get("/api/products/:id", (req, res) => {
  db.get("SELECT p.*, u.username as seller FROM products p LEFT JOIN users u ON p.user_id=u.id WHERE p.id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(400).json({ error: "DB error" });
    res.json(row);
  });
});

// My products
app.get("/api/myproducts", authenticate, (req, res) => {
  db.all("SELECT * FROM products WHERE user_id = ?", [req.user.id], (err, rows) => {
    if (err) return res.status(400).json({ error: "DB error" });
    res.json(rows);
  });
});

// Update product
app.put("/api/products/:id", authenticate, (req, res) => {
  const { title, description, category, price, image } = req.body;
  db.run("UPDATE products SET title=?,description=?,category=?,price=?,image=? WHERE id=? AND user_id=?",
    [title, description, category, price || 0, image || "", req.params.id, req.user.id],
    function (err) {
      if (err) return res.status(400).json({ error: "DB error" });
      res.json({ success: true });
    });
});

// Delete product
app.delete("/api/products/:id", authenticate, (req, res) => {
  db.run("DELETE FROM products WHERE id=? AND user_id=?", [req.params.id, req.user.id], function (err) {
    if (err) return res.status(400).json({ error: "DB error" });
    res.json({ success: true });
  });
});

// Cart - add
app.post("/api/cart/:productId", authenticate, (req, res) => {
  db.run("INSERT INTO cart(user_id,product_id) VALUES(?,?)", [req.user.id, req.params.productId], function (err) {
    if (err) return res.status(400).json({ error: "DB error" });
    res.json({ success: true });
  });
});

// Cart - list
app.get("/api/cart", authenticate, (req, res) => {
  db.all("SELECT c.id as cart_id, p.* FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?", [req.user.id], (err, rows) => {
    if (err) return res.status(400).json({ error: "DB error" });
    res.json(rows);
  });
});

// Cart - remove
app.delete("/api/cart/:cartId", authenticate, (req, res) => {
  db.run("DELETE FROM cart WHERE id = ? AND user_id = ?", [req.params.cartId, req.user.id], function (err) {
    if (err) return res.status(400).json({ error: "DB error" });
    res.json({ success: true });
  });
});

// Purchase (simulate checkout of one product)
app.post("/api/purchase/:productId", authenticate, (req, res) => {
  db.run("INSERT INTO purchases(user_id,product_id) VALUES(?,?)", [req.user.id, req.params.productId], function (err) {
    if (err) return res.status(400).json({ error: "DB error" });
    // Optionally remove from cart if present
    db.run("DELETE FROM cart WHERE user_id=? AND product_id=?", [req.user.id, req.params.productId]);
    res.json({ success: true });
  });
});

// Purchases list
app.get("/api/purchases", authenticate, (req, res) => {
  db.all("SELECT pu.id, pu.created_at, p.* FROM purchases pu JOIN products p ON pu.product_id = p.id WHERE pu.user_id = ?", [req.user.id], (err, rows) => {
    if (err) return res.status(400).json({ error: "DB error" });
    res.json(rows);
  });
});

// Serve frontend static files (for convenience)
app.get("/site/:file", (req, res) => {
  const f = req.params.file;
  const allowed = ["index.html","login.html","register.html","dashboard.html","addProduct.html","myListings.html","productDetail.html","cart.html","purchases.html"];
  if (allowed.includes(f)) res.sendFile(path.join(__dirname, "../frontend", f));
  else res.status(404).send("Not found");
});

app.listen(PORT, () => console.log(`EcoFinds server running on http://localhost:${PORT}`));
