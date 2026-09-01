const {
    PrismaClientKnownRequestError,
    PrismaClientValidationError
} = require("@prisma/client");

const handlePrismaError = (error) => {

    if (error instanceof PrismaClientKnownRequestError) {

        switch (error.code) {

            case "P2002":
                return {
                    statusCode: 409,
                    message: "A record with this value already exists"
                };

            case "P2025":
                return {
                    statusCode: 404,
                    message: "Record not found"
                };

            case "P2003":
                return {
                    statusCode: 400,
                    message: "Related record does not exist"
                };

            default:
                return {
                    statusCode: 500,
                    message: "Database operation failed"
                };
        }
    }

    if (error instanceof PrismaClientValidationError) {
        return {
            statusCode: 400,
            message: "Invalid database request"
        };
    }

    return null;
};

module.exports = handlePrismaError;