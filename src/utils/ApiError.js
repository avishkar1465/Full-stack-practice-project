// Class to represent API errors with structured details
class ApiError extends Error {
    // Constructor for initializing the error object
    constructor(
        statusCode,             // HTTP status code for the error
        message = "Something went wrong", // Default error message
        errors = [],            // Additional error details, defaulting to an empty array
        stack = ""              // Optional stack trace
    ) {
        super(message);         // Call the parent class constructor with the message
        this.statusCode = statusCode; // Set the HTTP status code
        this.data = null;       // Placeholder for additional error data (default is null)
        this.message = message; // Set the error message
        this.success = false;   // Indicate that the operation was unsuccessful
        this.errors = errors;   // Store additional error details

        if (stack) {
            // If a custom stack trace is provided, assign it
            this.stack = stack;
        } else {
            // Otherwise, generate a stack trace for this specific error
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Export the ApiError class so it can be used in other modules
export { ApiError };
