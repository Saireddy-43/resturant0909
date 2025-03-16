const express = require("express"); const cors = require("cors"); const app = express(); app.use(cors({ origin: ["https://resturant0909.netlify.app", "http://localhost:5173"], methods: ["GET", "POST", "PUT", "DELETE"], credentials: true })); app.use(express.json()); let orders = []; let bookings = []; app.use((req, res, next) => { console.log(`${req.method} ${req.path}`); next(); }); app.get("/", (req, res) => { res.json({ message: "Restaurant API Server", status: "running" }); }); app.get("/api/orders", (req, res) => { res.json(orders); }); app.post("/api/orders", (req, res) => { const order = { id: Date.now().toString(), ...req.body, status: "pending" }; orders.push(order); res.status(201).json(order); }); app.get("/api/bookings", (req, res) => { res.json(bookings); }); app.post("/api/bookings", (req, res) => { const booking = { id: Date.now().toString(), ...req.body, status: "pending" }; bookings.push(booking); res.status(201).json(booking); }); const PORT = process.env.PORT || 3000; app.listen(PORT, "0.0.0.0", () => { console.log(`Server running on port ${PORT}`); });
