const bcrypt = require("bcrypt");
const prisma = require("../config/db");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.userExists = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email
    }
  });
};

exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

exports.createUser = async (data) => {
  return await prisma.user.create({
    data
  });
};

exports.comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

exports.generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
};
exports.generateAccessToken = (id) => {
 
  return jwt.sign(
    {id},
    process.env.ACCESS_TOKEN_SECERT,
    {
      expiresIn:"15m"
    }
  )
};

exports.generateRefreshToken = (id) => {

  return jwt.sign(
    {id},
    process.env.REFRESH_TOKEN_SECERT,
    {
      expiresIn:"7d"
    }
  )
};
exports.createRefreshToken = async (userId, tokenHash, expiresAt) => {
  return await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt
    }
  });
};

exports.hashRefershToken=(token)=>{
  return crypto
  .createHash("sha256")
  .update(token)
  .digest("hex");
}

exports.calculateExpiryDate = () => {
  return new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  );
};