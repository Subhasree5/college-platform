const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Root route (for testing)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


// =======================
// 🔐 SIGNUP
// =======================
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return res.json({ message: "User already exists" });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // create user
    await prisma.user.create({
      data: {
        email,
        password: hashed,
      },
    });

    res.json({ message: "Signup successful" });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
});


// =======================
// 🔐 LOGIN
// =======================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.json({ message: "User not found" });
    }

    // compare password
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.json({ message: "Invalid credentials" });
    }

    // generate token
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET
    );

    res.json({ token });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});


// =======================
// ❤️ SAVE COLLEGE
// =======================
app.post("/save", async (req, res) => {
  try {
    const { token, college } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    // prevent duplicate save
    const exists = await prisma.savedCollege.findFirst({
      where: {
        name: college.name,
        userId: user.id,
      },
    });

    if (exists) {
      return res.json({ message: "Already saved" });
    }

    await prisma.savedCollege.create({
      data: {
        name: college.name,
        location: college.location,
        fees: college.fees,
        rating: college.rating,
        userId: user.id,
      },
    });

    res.json({ message: "Saved successfully" });

  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ message: "Error saving" });
  }
});


// =======================
// 📄 GET SAVED
// =======================
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
    console.error("Fetch saved error:", err);
    res.status(500).json({ message: "Error fetching saved" });
  }
});


// =======================
// ❌ REMOVE COLLEGE
// =======================
app.post("/remove", async (req, res) => {
  try {
    const { token, name } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    await prisma.savedCollege.deleteMany({
      where: {
        name,
        userId: user.id,
      },
    });

    res.json({ message: "Removed successfully" });

  } catch (err) {
    console.error("Remove error:", err);
    res.status(500).json({ message: "Error removing" });
  }
});


// =======================
// 🚀 START SERVER
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT} 🚀`);
});