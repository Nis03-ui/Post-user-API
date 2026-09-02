const {
  userExists: userExistsService,
  hashPassword: hashPasswordService,
  createUser: createUserService,
  comparePassword: comparePasswordService,

  generateAccessToken: generateAccessTokenService,
  generateRefreshToken: generateRefreshTokenService,

  hashRefreshToken,
  calculateExpiryDate,
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  verifyRefreshToken
} = require("../service/auth.service");

const { ApiError } = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");


/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

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

  // Access token
  const accessToken =
    generateAccessTokenService(user.id);

  // Refresh token
  const refreshToken =
    generateRefreshTokenService(user.id);

  // Hash refresh token before storing
  const tokenHash =
    hashRefreshToken(refreshToken);

  // Database expiration
  const expiresAt =
    calculateExpiryDate();

  await createRefreshToken(
    user.id,
    tokenHash,
    expiresAt
  );

  // Store raw refresh token only in httpOnly cookie
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


/*
|--------------------------------------------------------------------------
| GET ME
|--------------------------------------------------------------------------
*/

exports.getMe = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Successfully retrieved",
    user: req.user
  });
});


/*
|--------------------------------------------------------------------------
| REFRESH ACCESS TOKEN
|--------------------------------------------------------------------------
*/

exports.refresh = asyncHandler(async (req, res) => {

  // 1. Get refresh token from cookie
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new ApiError(
      "Refresh token required",
      401
    );
  }

  // 2. Hash incoming refresh token
  const tokenHash =
    hashRefreshToken(refreshToken);

  // 3. Find token in database
  const storedToken =
    await findRefreshToken(tokenHash);

  if (!storedToken) {
    throw new ApiError(
      "Invalid refresh token",
      401
    );
  }

  // 4. Check database expiration
  if (storedToken.expiresAt < new Date()) {
    throw new ApiError(
      "Refresh token expired",
      401
    );
  }

  // 5. Verify JWT
  let decoded;

  try {
    decoded =
      verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new ApiError(
      "Invalid or expired refresh token",
      401
    );
  }

  // 6. Verify token belongs to same user
  if (decoded.id !== storedToken.userId) {
    throw new ApiError(
      "Invalid refresh token",
      401
    );
  }

  // 7. Generate new access token
  const accessToken =
    generateAccessTokenService(decoded.id);

  return res.status(200).json({
    success: true,
    message: "Access token refreshed",
    accessToken
  });
});


/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

exports.logout = asyncHandler(async (req, res) => {

  const { refreshToken } = req.cookies;

  if (refreshToken) {

    const tokenHash =
      hashRefreshToken(refreshToken);

    const storedToken =
      await findRefreshToken(tokenHash);

    if (storedToken) {
      await deleteRefreshToken(tokenHash);
    }
  }

  // Remove cookie from browser
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful"
  });
});