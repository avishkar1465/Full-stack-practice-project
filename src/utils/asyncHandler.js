// Higher-order function to handle async errors in middleware functions
const asyncHandler = (fn) => 
    async (req, res, next) => { // Returns a new async function taking req, res, and next
        try {
            // Executes the passed asynchronous function and waits for it to complete
            await fn(req, res, next);
        } catch (error) {
            // Handles any errors that occur during the execution of fn
            res.status(error.code || 500).json({ // Sends an error response to the client
                success: false, // Indicates the request was unsuccessful
                message: error.message // Includes the error message in the response
            });
        }
    };

// Exporting the asyncHandler function so it can be used in other files
export { asyncHandler };
