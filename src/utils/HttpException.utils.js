class HttpException {
    constructor(status, message, data) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.type = "error";
    }
}

module.exports = HttpException;