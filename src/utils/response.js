class Response {
    constructor(data= null, message= null) {
        this.data = data
        this.message = message
    }

    success(res) {
        return res.status(200).json({
            success: true,
            data: this.data,
            message: this.message ?? "Islem basarili."
        })
    }

    created(res) {
        return res.status(201).json({
            success: true,
            data: this.data,
            message: this.message ?? "Islem basarili."
        })
    }

    error500(res) {
        return res.status(500).json({
            success: false,
            data: this.data,
            message: this.message ?? "Islem basarisiz!"
        })
    }

    error400(res) {
        return res.status(400).json({
            success: false,
            data: this.data,
            message: this.message ?? "Islem basarisiz!"
        })
    }

    error401(res) {
        return res.status(401).json({
            success: false,
            data: this.data,
            message: this.message ?? "Lutfen oturum acin!"
        })

    }

    error404(res) {
        return res.status(404).json({
            success: false,
            data: this.data,
            message: this.message ?? "Islem basarisiz!"
        })
    }

    error429(res) {
        return res.status(429).json({
            success: false,
            data: this.data,
            message: this.message ?? "Cok fazla yanlis istek atildi!"
        })
    }
}

module.exports = Response