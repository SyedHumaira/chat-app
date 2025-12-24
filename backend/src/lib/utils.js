// src/lib/utils.js
import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET not defined");
}

export const generateToken = (userId, res) => {
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET, 
    { expiresIn: "7d" }
  );

  res.cookie("JWT", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    secure: true,
  });

  return token;
};

// src/lib/utils.js