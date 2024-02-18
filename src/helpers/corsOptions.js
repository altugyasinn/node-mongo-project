const whiteList = ["http://localhost3000"]

const corsOptions = (req, callback) => {
    let corsOptions;
    console.log(req.header("Origin"));
    if (whiteList.indexOf(req.header("Origin")) !== -1) {
        corsOptions = {origin: true}
        console.log("if icerisinde");
    } else {
        corsOptions = {origin: false}
        console.log("else icerisinde");

    }

    callback(null, corsOptions)
}


module.exports = corsOptions