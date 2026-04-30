import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin:"*"
}));
app.use(express.json());

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* ================= SIGNUP ================= */
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    await prisma.user.create({
      data: { email, password },
    });

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Signup failed" });
  }
});

/* ================= LOGIN ================= */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Login failed" });
  }
});

/* ================= SAVE ================= */
app.post("/save", async (req, res) => {
  try {
    const { email, college } = req.body;

    const exists = await prisma.saved.findFirst({
      where: { email, college },
    });

    if (exists) {
      return res.json({ message: "Already saved" });
    }

    await prisma.saved.create({
      data: { email, college },
    });

    res.json({ message: "Saved successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Save failed" });
  }
});

/* ================= GET SAVED ================= */
app.get("/saved/:email", async (req, res) => {
  try {
    const data = await prisma.saved.findMany({
      where: { email: req.params.email },
    });

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* ================= REMOVE ================= */
app.delete("/remove", async (req, res) => {
  try {
    const { email, college } = req.body;

    await prisma.saved.deleteMany({
      where: { email, college },
    });

    res.json({ message: "Removed successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Remove failed" });
  }
});

/* ================= START ================= */
app.listen(5000, () => {
  console.log("Server running 🚀");
});