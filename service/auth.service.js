const bcrypt = require("bcrypt");
const prisma = require("../config/db");
const jwt = require("jsonwebtoken");

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