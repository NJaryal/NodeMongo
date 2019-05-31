class CustomError extends Error{
    constructor(text, status){
        super(text)
        this.status = status
    }
}
module.exports = CustomError;