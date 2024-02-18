const joi = require("joi")
const APIError = require("../../utils/errors")


class authValidation {
    constructor() {}
    static register = async (req, res, next) => {
        try {
            
            await joi.object({
                name: joi.string().trim().min(3).max(100).required().messages({
                    "string.base": "Isim alani normal metin olmalidir.",
                    "string.empty": "Isim alani bos olamaz.",
                    "string.min": "Isim alani en az 3 karakter olmalidir.",
                    "string.max": "Isim alani maksimum 100 karakter olmalidir.",
                    "string.required": "Isim alani bos birakilamaz."
                }),
                lastname: joi.string().trim().min(3).max(100).required().messages({
                    "string.base": "Soyad alani normal metin olmalidir.",
                    "string.empty": "Soyad alani bos olamaz.",
                    "string.min": "Soyad alani en az 3 karakter olmalidir.",
                    "string.max": "Soyad alani maksimum 100 karakter olmalidir.",
                    "string.required": "Soyad alani bos birakilamaz."
                }),
                email: joi.string().email().trim().min(3).max(100).required().messages({
                    "string.base": "Email alani normal metin olmalidir.",
                    "string.empty": "Email alani bos olamaz.",
                    "string.email": "Lutfen gecerli bi email giriniz",
                    "string.min": "Email alani en az 3 karakter olmalidir.",
                    "string.max": "Email alani maksimum 100 karakter olmalidir.",
                    "string.required": "Email alani bos birakilamaz."
                }),
                password: joi.string().trim().min(6).max(36).required().messages({
                    "string.base": "Sifre alani normal metin olmalidir.",
                    "string.empty": "Sifre alani bos olamaz.",
                    "string.min": "Sifre alani en az 6 karakter olmalidir.",
                    "string.max": "Sifre alani maksimum 36 karakter olmalidir.",
                    "string.required": "Sifre alani bos birakilamaz."
                })
            }).validateAsync(req.body)
        } catch (error) {
            if (error.details && error?.details[0].message)
                throw new APIError(error.details[0].message, 400)
            else throw new APIError("Lutfen validasyon kurallarina uyun", 400)
        }
        next()
    }

    static login = async (req, res, next) => {
        try {
            await joi.object({
                email: joi.string().email().trim().min(3).max(100).required().messages({
                    "string.base": "Email alani normal metin olmalidir.",
                    "string.empty": "Email alani bos olamaz.",
                    "string.email": "Lutfen gecerli bi email giriniz",
                    "string.min": "Email alani en az 3 karakter olmalidir.",
                    "string.max": "Email alani maksimum 100 karakter olmalidir.",
                    "string.required": "Email alani bos birakilamaz."
                }),
                password: joi.string().trim().min(6).max(36).required().messages({
                    "string.base": "Sifre alani normal metin olmalidir.",
                    "string.empty": "Sifre alani bos olamaz.",
                    "string.min": "Sifre alani en az 6 karakter olmalidir.",
                    "string.max": "Sifre alani maksimum 36 karakter olmalidir.",
                    "string.required": "Sifre alani bos birakilamaz."
                })
            }).validateAsync(req.body)
            
        } catch (error) {
            if (error.details && error?.details[0].message)
                throw new APIError(error.details[0].message, 400)
            else throw new APIError("Lutfen validasyon kurallarina uyun", 400)
        }
        next();
    }
}

module.exports = authValidation