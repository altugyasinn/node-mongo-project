const APIError = require("../utils/errors")


const errorHandlerMiddleware = (err,req,res,next) =>{
    if (err instanceof APIError) {
        return res.status(err.statusCode || 400)
            .json({
                success: false,
                message: err.message
            })
    }

    console.log(err);
    // Errorlari belli durumlara gore farkli mesajlarla handle etmek gerekli
    
    return res.status(500).json({
        success: false,
        message: "Bir hata ile karsilasildi lutfen teknik kontrolleri saglayiniz."
    })

}

module.exports = errorHandlerMiddleware