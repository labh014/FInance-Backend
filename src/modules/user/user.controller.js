import prisma from "../../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "VIEWER", 
      }
    });

    // don't return password in response
    const userResponse = { ...user };
    delete userResponse.password;

    res.json(userResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true
      }
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // prevent
    if (req.user.id === id) {
      return res.status(400).json({
        message: "You cannot change your own role"
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true
      }
    });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // prevention 
    if (req.user.id === id) {
      return res.status(400).json({
        message: "You cannot deactivate your own account"
      });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true
      }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
