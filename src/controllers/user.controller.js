import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

//since required many time seperate method is mad efor access and refrets

const generateAcessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    //aces token is given to user but refresh token is given as well as stored in fb
    const acessToken = user.generateAcessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { acessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "error during generating tokens");
  }
};
const refreshAcessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(
      401,
      "invalid incoming refresh token unauthorized Request "
    );
  }
  try {
    const tokenDecoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(tokenDecoded?._id);
    if (!user) {
      throw new ApiError(401, "invalid incoming refresh token  ");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "expired token");
    }
    const { acessToken, newRefreshToken } = await generateAcessAndRefreshTokens(
      user._id
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("acessToken", options)
      .cookie("newRefreshToken", options)
      .json(
        new ApiResponse(
          200,
          { acessToken, newRefreshToken },
          "acess token refreshed sucessfully"
        )
      );
  } catch (error) {
    throw new ApiError(400, "invalid re-refreshing acess tokens");
  }
});
const registerUser = asyncHandler(async (req, res) => {
  /* res.status(200).json({ sucess: "ok" }); */
  //step 1
  const { fullName, email, username, password } = req.body;
  //step 2
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields is required");
  }
  //step 3
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    //if no apierror then res.sendres.ststus garirrakhnu parxa
    throw new ApiError(409, "User with this username  and email exists");
  }
  //step 4 req.files if given by multer
  console.log(req.files);
  const avatarLocalPath = req.files?.avatar[0]?.path;
  /*   const coverImageLocalPath = req.files?.coverImage[0]?.path; */
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0]?.path;
  }
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar is required");
  }
  //step 5 upload to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "required avatar");
  }

  //step 6
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username,
  });
  //step 7
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  //step 8
  if (!createdUser) {
    throw new ApiError(400, "user not created");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user is created sucessfully "));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "email and username is required");
  }
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    throw new ApiError(404, "user doesnt exist ");
  }
  // the |User os tje mongo db user and user is the instane of user created which contains arll method
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "password is incorrect ");
  }
  const { acessToken, refreshToken } = await generateAcessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  //when ever sending ookins make options the options will be modified only in sever not in front end
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("acessToken ", acessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        new ApiResponse(
          200,
          { user: loggedInUser, acessToken, refreshToken },
          "user loged in sucessfully"
        )
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    $set: {
      refreshToken: undefined,
    },
  });
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("acessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out"));
});

const changeCurrentUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword /* confirmPassword */ } = req.body;
  const user = await User.findById(req.user?._id);
  /*  if(newPassword === confirmPassword){
    throw 
  } */
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "invalid old password detected");
  }
  User.password = newPassword;
  await user.save({ validateBeforeSave: false });
  res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed sucessfully "));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched sucessfully "));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  if (!fullName || !email) {
    throw new ApiError(400, "all fields are required");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName,
        email: email,
      },
    },
    { new: true }
  ).select("-password -refreshToken");
  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "user account details updated sucessfully ")
    );
});

const updateAvatar = asyncHandler(async (req, res) => {
  //files were taken above because we sent the filed od files
  //NOTE delete the old avatar image
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is missing in multer ");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "avatar file is missing in the cloudinary ");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");
  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "sucessfully uploaded file in cloudinary")
    );
});
const updateCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "coverImage file is missing in multer ");
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage) {
    throw new ApiError(
      400,
      user,
      "coverImage  file is missing in the cloudinary "
    );
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        "sucessfully uploaded coverImage file in cloudinary"
      )
    );
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username?.trim()) {
    throw new ApiError(400, "there is no username in params");
  }
  /*  const channel = await User.find({ username: username }); */
  const channel = await User.aggregate([
    {
      //first pirpline
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        foreignField: "channel",
        localField: "_id",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        foreignField: "subscriber",
        localField: "_id",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscriberCount: {
          $size: "$subscribers",
        },
        channelsSubscribedTo: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscriberCount: 1,
        channelsSubscribedTo: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);
  console.log("channel: ", channel);
  if (!channel?.length) {
    throw new ApiError(400, "channel doesnt exist");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "user channel is fetched sucessfully ")
    );
});
const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos", //tolink
        localField: "watchHistory", //users local field
        foreignField: "_id", //videos id
        as: "watchHistory", //saved in mongo as
        pipeline: [
          //adidtional pipeline
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "sucessfully fetched watch History"
      )
    );
});
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAcessToken,
  changeCurrentUserPassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};

//steps
//get user details from frontend
//validation if user sends null
//check if the user already exists either username  or email
//if the files exist (avatar and cover)
//if  files uplaod to cloudinary
//check cloudinarry again for avatar
//create user
//remove password and refresh token  field from response so this is not visible in front end  hacking safety
//check if created user
//chcek if not created

/* 
todos for login a user 
email password from req.body,
check if email username exists 
find user if not found redirect to signup 
password check 
jwt session refresh token in form of cookies 
redirect to main page 
*/

//before sending cookies
// know what information to be sent and dont send the unnecessary
