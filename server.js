js
import express from "express";
import session from "express-session";
import path from "path";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";
import searchRoutes from "./routes/search.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false
}));

// Static files
app.use(express.static(path.join(process.cwd(), "public")));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/search", searchRoutes);

// Landing page
app.get("/", (req, res) => {
    res.render("layout", { page: "Welcome to SecondSoul" });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});


