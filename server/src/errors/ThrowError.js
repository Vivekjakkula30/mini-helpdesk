class ThrowError extends Error {
    constructor(statusCode, title, message){
        super(message);

        this.statusCode = statusCode;
        this.title = title;
        Object.setPrototypeOf(this,ThrowError.prototype);
    }
}

export default ThrowError;


