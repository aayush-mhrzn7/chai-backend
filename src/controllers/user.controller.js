import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
const registerUser = asyncHandler(async (req, res) => {
  /* res.status(200).json({ sucess: "ok" }); */
  //step 1
  const { fullname, email, username, password } = req.body;
  //step 2
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields is required");
  }
  //step 3
  const existingUser = User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    //if no apierror then res.sendres.ststus garirrakhnu parxa
    throw new ApiError(409, "User with this username and email exists");
  }
  //step 4 req.files if given by multer
  console.log(req.files);
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

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
    fullname,
    avatar: avatar.url,
    email,
    username: username.toLowerCase(),
    coverImage: coverImage?.url || "",
  });
  //step`7
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

export { registerUser };

//steps
//get user details from frontend
//validation if user sends null
//check if the user already exists either username or email
//if the files exist (avatar and cover)
//if  files uplaod to cloudinary
//check cloudinarry again for avatar
//create user
//remove password and refresh token  field from response so this is not visible in front end  hacking safety
//check if created user
//chcek if not created

//create user object -- create entry in db
