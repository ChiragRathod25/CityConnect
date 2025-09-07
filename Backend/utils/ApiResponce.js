class ApiResponce {
    constructor(
        statusCode,
        message="success",
        data,
    ){
        this.statusCode=statusCode,
        this.data=data,
        this.message=message,
        this.success=this.statusCode<400
    }
}

export {ApiResponce}