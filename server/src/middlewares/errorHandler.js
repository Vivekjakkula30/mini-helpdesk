import ThrowError from "../errors/ThrowError.js";
import { errorResponse } from "../helpers/responseHelper.js";


export const errorHandler = (error, req, res, next) => {

    if(error instanceof ThrowError){
        return errorResponse(
            res,
            error.statusCode,
            error.title,
            error.message
        );

    }

    else if(error instanceof Error){
        return errorResponse(
            res,
            500,
            "Internal Server Error",
            error.message
        );

    }

    else{
        return errorResponse(
            res,
            500,
            "Internal Server Error",
            "Something went wrong"
        );
    }
};