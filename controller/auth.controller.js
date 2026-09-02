const { success } = require("zod");
const {
  userExists: userExistsService,
  hashPassword: hashPasswordService,
  createUser: createUserService,
  comparePassword:comparePasswordService,
  generateToken:generateTokenService,
  generateAccessToken:generateAccessTokenService,
  generateRefreshToken:generateRefreshTokenService,
  hashRefershToken,
  calculateExpiryDate,
  createRefreshToken

} = require("../service/auth.service");

const { ApiError } = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await userExistsService(email);

  if (userExists) {
    throw new ApiError("User already exists", 409);
  }

  const hashedPassword = await hashPasswordService(password);

  const user = await createUserService({
    name,
    email,
    password: hashedPassword
  });

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    }
  });
});



exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userExistsService(email);

  if (!user) {
    throw new ApiError("Invalid email or password", 401);
  }

  const isMatch = await comparePasswordService(
    password,
    user.password
  );

  if (!isMatch) {
    throw new ApiError("Invalid email or password", 401);
  }

  const accessToken = generateAccessTokenService(user.id);

const refreshToken = generateRefreshTokenService(user.id);

const tokenHash = hashRefreshToken(refreshToken);

const expiresAt = calculateExpiryDate();

await createRefreshToken(
  user.id,
  tokenHash,
  expiresAt
);
res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000
});
 

  return res.status(200).json({
    success: true,
    message: "Login successful",
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

exports.getMe=asyncHandler(async(req,res)=>{
    return res.status(200).json({
        success:true,
        message:"Successfully retrieved"
    })
})
