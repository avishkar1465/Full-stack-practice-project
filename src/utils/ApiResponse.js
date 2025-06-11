// Class to represent a structured API response
class ApiResponse {
    // Constructor to initialize the response object
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode; // Set the HTTP status code
        this.data = data;             // Set the response data
        this.message = message;       // Set the response message
        this.success = statusCode < 400; // Determine success based on status code (< 400 means success)
    }
}

// Export the ApiResponse class for use in other parts of the application
export { ApiResponse };
