require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

const SECRET = process.env.JWT_SECRET;

// ======================
// 🔐 SIGNUP
// ======================
// SIGNUP
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    return res.json({ message: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { email, password: hashed },
  });

  res.json({ message: "Signup successful" });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) return res.json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return res.json({ message: "Invalid credentials" });

  const token = jwt.sign({ email }, process.env.JWT_SECRET);

  res.json({ token });
});
// ======================
// ❤️ SAVE COLLEGE (FIXED)
// ======================
app.post("/save", async (req, res) => {
  const { token, college } = req.body;

  try {
    if (!token) return res.json({ message: "No token" });

    const decoded = jwt.verify(token, SECRET);

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user) return res.json({ message: "User not found" });

    if (!college) return res.json({ message: "No college data" });

    await prisma.savedCollege.create({
      data: {
        name: college.name,
        location: college.location,
        fees: Number(college.fees), // ✅ FIX
        rating: college.rating,
        userId: user.id,
      },
    });

    res.json({ message: "Saved successfully" });
  } catch (err) {
    console.error("SAVE ERROR:", err);

    if (err.code === "P2002") {
      return res.json({ message: "Already saved" });
    }

    res.json({ message: "Error saving" });
  }
});

// ======================
// 📥 GET SAVED
// ======================
app.post("/saved", async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET);

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    const saved = await prisma.savedCollege.findMany({
      where: { userId: user.id },
    });

    res.json(saved);
  } catch (err) {
    console.error(err);
    res.json([]);
  }
});

// ======================
// ❌ REMOVE
// ======================
app.post("/remove", async (req, res) => {
  const { token, name } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET);

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    await prisma.savedCollege.deleteMany({
      where: {
        userId: user.id,
        name,
      },
    });

    res.json({ message: "Removed" });
  } catch (err) {
    console.error(err);
    res.json({ message: "Error removing" });
  }
});

// ======================
app.listen(PORT, () => {
  console.log(`Server running on ${PORT} 🚀`);
});