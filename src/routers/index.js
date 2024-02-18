const router = require("express").Router()


const multer = require("multer")
const upload = require("../middlewares/lib/upload")
const auth = require("./auth.routes")
const APIError = require("../utils/errors")
const Response = require("../utils/response")

router.use(auth)


router.post("/uploads", function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError)
            throw new APIError("Resim yuklenirken multer kaynakli hata cikti: ", err)
        else if (err)
        throw new APIError("Resim yuklenirken hata cikti: ", err)
        else return new Response(req.savedImages, "Yukleme basarili").success(res)
    })
})

module.exports = router