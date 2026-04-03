import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // block inactivate users
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user || user.isActive === false) {
      return res.status(403).json({
        message: "User is inactive or deleted"
      });
    }

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
