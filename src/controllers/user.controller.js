import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

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

export { registerUser, loginUser, logoutUser };

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
