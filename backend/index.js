const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ================= SIGNUP =================
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return res.json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { name, email, password: hashed },
    });

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return res.json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

// ================= SAVE =================
app.post("/save", async (req, res) => {
  try {
    const { token, college } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    const exists = await prisma.savedCollege.findFirst({
      where: {
        userId: user.id,
        name: college.name,
      },
    });

    if (exists) {
      return res.json({ message: "Already saved" });
    }

    await prisma.savedCollege.create({
      data: {
        userId: user.id,
        name: college.name,
        location: college.location,
        fees: college.fees,
        rating: college.rating,
      },
    });

    res.json({ message: "Saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Save failed" });
  }
});

// ================= GET SAVED =================
app.post("/saved", async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    const saved = await prisma.savedCollege.findMany({
      where: { userId: user.id },
    });

    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: "Error fetching saved" });
  }
});

// ================= REMOVE =================
app.post("/remove", async (req, res) => {
  try {
    const { token, name } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    await prisma.savedCollege.deleteMany({
      where: {
        userId: user.id,
        name,
      },
    });

    res.json({ message: "Removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error removing" });
  }
});

// ================= START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT} 🚀`);
});