const jwt = require("jsonwebtoken")
const APIError = require("../utils/errors");
const user = require("../models/user.model");
const { application } = require("express");

const createToken = async (user, res) => {
    console.log(user);

    const payload = {
        sub: user._id,
        name: user.name
    }

    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        algorithm: "HS512",
        expiresIn: process.env.JWT_EXPIRES_IN
    })

    return res.status(201).json({
        success: true,
        token,
        message: "Basarili"
    })
}

const tokenCheck = async (req, res, next) => {
    console.log("token check icerisinde")
    const headerToken = req.headers.authorization && req.headers.authorization.startsWith("Bearer ") 
    
    if (!headerToken)
        throw new APIError("Gecersiz oturum. Lutfen oturum aciniz.",401)

    const token = req.headers.authorization.split(" ")[1]

    console.log(token)

    await jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
        if (err) throw new APIError("Gecersiz Token",401)

        const userInfo = await user.findById(decoded.sub).select("_id name lastname email")

        console.log(userInfo);

        if (!userInfo)
            throw new APIError("Gecersiz Token2",401)
        req.user = userInfo
        next();
    })
    
}

const createTemporaryToken = async (userId, email) => {
    const payload = {
        sub: userId,
        email
    }

    const token = await jwt.sign(payload, process.env.JWT_TEMPORARY_KEY, {
        algorithm: "HS512",
        expiresIn: process.env.JWT_TEMPORARY_EXPIRES_IN
    })

    return "Bearer " + token
}

const decodedTemporaryToken = async (temporaryToken) => {
    const token = temporaryToken.split(" ")[1]
    let userInfo;
    await jwt.verify(token, process.env.JWT_TEMPORARY_KEY, async (err,decoded) =>{
        if (err) throw new APIError("Gecersiz token", 401)

        userInfo = await user.findById(decoded.sub).select("_id name lastname email")
        if (!userInfo) throw new APIError("Gecersiz token", 401)

    })

    return userInfo
}

module.exports = {
    createToken,
    tokenCheck,
    createTemporaryToken,
    decodedTemporaryToken
}