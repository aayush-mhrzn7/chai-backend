const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    //when good responses
    Promise.resolve(requestHandler(req, res, next)).catch((err) =>
      console.log("error in async handler mid:", err)
    );
  };
};
//when error sending in a default format so that we dont need to consuse with the order of how errors are handled
export { asyncHandler };
//communicating with database is done many time so we use a utils which is used to communcate with structures which are used frequently
