class BaseModel {
    constructor(data, message) {
        if (typeof data === 'string') {
            this.message = data
            data = undefined
            message = undefined
        }
        if (data !== undefined) {
            this.data = data
        }
        if (message !== undefined) {
            this.message = message
        }
    }
}

class SuccessModel extends BaseModel{
    constructor(data, message) {
        super(data, message)
        this.errno = 0
    }
}

class ErrorModel extends BaseModel{
    constructor(data, message) {
        super(data, message)
        this.errno = -1
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}
