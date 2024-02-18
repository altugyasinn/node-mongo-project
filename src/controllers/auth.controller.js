const user = require("../models/user.model")
const bcrypt = require("bcrypt")
const APIError = require("../utils/errors")
const Response = require("../utils/response")
const { createToken, createTemporaryToken, decodedTemporaryToken } = require("../middlewares/auth")
const crypto = require ("crypto")
const sendEmail = require("../utils/sendMail")
const moment = require("moment")


const login = async (req,res) => {
    const { email, password } = req.body

    const userInfo = await user.findOne({email})

    console.log(userInfo);
    

    if (!userInfo)
        throw new APIError("Email ya da sifre hatalidir.", 401)

    const comparePassword = await bcrypt.compare(password, userInfo.password)
    console.log(comparePassword)

    if (!comparePassword)
        throw new APIError("Email ya da sifre hatalidir", 401)

    createToken(userInfo, res)

}

const register = async (req,res) => {
    const { email } = req.body
    // Eger key ve value ayni ise tek bir tane vermek yeterlidir. farkli olsaydi email: userEmail tarzi bi kullanim gerekliydi.
    const userCheck = await user.findOne({email})

    if (userCheck) {
        throw new APIError("Girmis oldugunuz E-Mail kullanimda.", 401)
    }

    req.body.password = await bcrypt.hash(req.body.password, 10)
    console.log("Hash Sifre: ", req.body.password);

    const userSave = new user(req.body)

    await userSave.save()
        .then((data) =>{
            return new Response(data, "Kayit basariyla yapildi.").created(res)
        })
        .catch((err) => {
            throw new APIError("Kullanici kayit edilemedi!", 400)
        })
}

const me = async (req, res) => {
    return new Response(req.user).success(res)

}

const forgetPassword = async (req,res) => {
    const { email } = req.body

    const userInfo = await user.findOne({email}).select(" name lastname email ")

    if (!userInfo) return new APIError("Gecersiz kullanici",400)
    
    console.log("userInfo: ",userInfo);

    const resetCode = crypto.randomBytes(3).toString("hex")

    await sendEmail({
        from: "your_email@comeshere.:)",
        to: userInfo.email,
        subject: "Sifre Sifirlama",
        text: `Sifre Sifirlama Kodunuz ${resetCode}`
    })

    await user.updateOne(
        {email},
        {
            reset: {
                code: resetCode,
                time: moment(new Date()).add(15, "minute").format("YYYY-MM-DD HH:mm:ss")
            }
        }
    )

    return new Response(true, "Lutfen mailinizi kontrol ediniz.").success(res)
}

const resetCodeCheck = async (req, res) =>{

    const { email, code } = req.body

    const userInfo = await user.findOne({email}).select("_id name lastname email reset")

    if (!userInfo) throw new APIError("Gecersiz kod!", 401)

    const dbTime = moment(userInfo.reset.time)
    const nowTime = moment(new Date())

    const timeDiff = dbTime.diff(nowTime, "minutes")

    console.log("Zaman farki: ", timeDiff);


    if (timeDiff <= 0 || userInfo.reset.code !== code){

        throw new APIError("Gecersiz kod!", 401)

    }
        
    const temporaryToken = await createTemporaryToken(userInfo._id, userInfo.email)

    return new Response({temporaryToken}, "Sifrenizi sifirlayabilirsiniz").success(res)


}
    

const resetPassword = async (req, res) =>{

    const { password, temporaryToken } = req.body

    const decodedToken = await decodedTemporaryToken(temporaryToken);
    console.log("decodedToken: " ,decodedToken);

    const hashPassword = await bcrypt.hash(password, 10)

    await user.findByIdAndUpdate(
        { _id: decodedToken._id },
        {
            reset: {
                code: null,
                time: null
            },
            password: hashPassword,
        }
    );

    return new Response(decodedToken, "Sifre Sifirlama Basarili").success(res)
}


module.exports = {
    login,
    register,
    me,
    forgetPassword,
    resetCodeCheck,
    resetPassword
}