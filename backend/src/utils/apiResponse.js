class ApiResponse {
  constructor(statusCode, data, message = 'Success', meta) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    if (meta) {
      this.meta = meta;
    }
  }
}

module.exports = { ApiResponse };


