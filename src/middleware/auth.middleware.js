import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.acessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      new ApiError(401, "Unauthorized Request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Unauthorized Token");
    }
    //adingn nwe method o req
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(400, "faliure in Token Authorization");
  }
});
