const rateLimit = require("express-rate-limit")

const allowList = ["::1"]

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: (req, res) => {
        console.log("api url: ", req.url);
        console.log("api ip: ", req.ip);
        if (req.url === "/login" || req.url === "/register") return 1
        else return 3
    },
    message: {
        success: false,
        message: "Cok fazla istekte bulundunuz."
    },
    skip: (req,res) => allowList.includes(req.ip), // istenilen ip lere izin verildi
    standardHeaders: true,
    legacyHeaders: false,
})

module.exports = apiLimiter