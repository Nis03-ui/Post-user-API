const bcrypt = require("bcrypt");
const prisma = require("../config/db");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


/*
|--------------------------------------------------------------------------
| USER
|--------------------------------------------------------------------------
*/

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


exports.comparePassword = async (
  password,
  hashedPassword
) => {
  return await bcrypt.compare(
    password,
    hashedPassword
  );
};


/*
|--------------------------------------------------------------------------
| ACCESS TOKEN
|--------------------------------------------------------------------------
*/

exports.generateAccessToken = (id) => {
  return jwt.sign(
    { id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m"
    }
  );
};


/*
|--------------------------------------------------------------------------
| REFRESH TOKEN
|--------------------------------------------------------------------------
*/

exports.generateRefreshToken = (id) => {
  return jwt.sign(
    { id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d"
    }
  );
};


exports.verifyRefreshToken = (token) => {
  return jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET
  );
};


/*
|--------------------------------------------------------------------------
| REFRESH TOKEN HASH
|--------------------------------------------------------------------------
*/

exports.hashRefreshToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};


/*
|--------------------------------------------------------------------------
| REFRESH TOKEN EXPIRATION
|--------------------------------------------------------------------------
*/

exports.calculateExpiryDate = () => {
  return new Date(
    Date.now() +
      7 * 24 * 60 * 60 * 1000
  );
};


/*
|--------------------------------------------------------------------------
| REFRESH TOKEN DATABASE
|--------------------------------------------------------------------------
*/

exports.createRefreshToken = async (
  userId,
  tokenHash,
  expiresAt
) => {
  return await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt
    }
  });
};


exports.findRefreshToken = async (tokenHash) => {
  return await prisma.refreshToken.findUnique({
    where: {
      tokenHash
    }
  });
};


exports.deleteRefreshToken = async (tokenHash) => {
  return await prisma.refreshToken.delete({
    where: {
      tokenHash
    }
  });
};