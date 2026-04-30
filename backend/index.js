import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: "*"
}));

app.use(express.json());

const SECRET = "college_secret";

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


// ================= SIGNUP =================
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    await prisma.user.create({
      data: { email, password }
    });

    res.json({ message: "Signup success" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup error" });
  }
});


// ================= LOGIN =================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ email }, SECRET);

    res.json({ token });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= SAVE =================
// ================= SAVE =================
app.post("/save", async (req, res) => {
  try {
    const { token, college } = req.body;

    if (!token || !college) {
      return res.status(400).json({ message: "Missing data" });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // prevent duplicate save
    const exists = await prisma.saved.findFirst({
      where: {
        email: decoded.email,
        name: college.name,
      },
    });

    if (exists) {
      return res.json({ message: "Already saved" });
    }

    await prisma.saved.create({
      data: {
        email: decoded.email,
        name: college.name,
        location: college.location,
        fees: college.fees,
        rating: college.rating,
      },
    });

    res.json({ message: "Saved successfully" });

  } catch (err) {
    console.error("SAVE ERROR:", err);
    res.status(500).json({ message: "Save error" });
  }
});

// ================= GET SAVED =================
app.post("/saved", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "No token" });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }

    const data = await prisma.saved.findMany({
      where: { email: decoded.email },
    });

    res.json(data);

  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ message: "Fetch error" });
  }
});
// ================= REMOVE =================
app.post("/remove", async (req, res) => {
  try {
    const { token, name } = req.body;

    const decoded = jwt.verify(token, SECRET);

    await prisma.saved.deleteMany({
      where: {
        email: decoded.email,
        name
      }
    });

    res.json({ message: "Removed" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Remove error" });
  }
});


// ================= START SERVER =================
app.listen(5000, () => {
  console.log("Server running 🚀");
});