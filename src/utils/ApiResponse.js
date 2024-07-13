class ApiResponse {
  constructor(statusCode, message = "Suceess", data) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
export { ApiResponse };
