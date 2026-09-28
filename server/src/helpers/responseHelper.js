export const successResponse = (res, statusCode, data) =>{
    return res.status(statusCode).json(data);
};

export const errorResponse = (res, statusCode, title, message) => {
    return res.status(statusCode).json({
        title,
        message
    });
};