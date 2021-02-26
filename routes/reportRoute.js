const { Router } = require('express')
const Report = require('../models/Report')
const ReportImg = require('../models/ReportImg')
const router = Router()
const multer = require('multer')
const verifyToken = require('../middleware/verifyTokenMW')

const fileFilter = (req, file, cb) => {

    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

const storage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, 'uploads/reportImg');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + file.originalname);
        }
    });


const upload = multer({ storage, fileFilter: fileFilter })

// /api/report/create
router.post(
    '/create',
    verifyToken,
    async (req, res) => {
        try {
            const userId = req.userId
            
            const { title, body, urlToImg } = req.body

            const report = new Report({ title, body, createdBy: userId, urlToImg })

            await report.save()

            res.status(200).json({ message: "Жалоба создана успешно" })

        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    })

// const report = await Report.find().sort({ $natural: -1 }).limit(5)
router.get(
    '/get/:id',
    async (req, res) => {
        try {
            id = req.params.id

            const report = await Report.find({ _id: id })

            if (report.length === 0) {
                return res.status(400).json({ message: 'Обращение не найдено' })
            }

            res.status(200).json({ report, message: "Успешно" })

        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
            console.log(e)
        }
    })

router.get(
    '/get',
    async (req, res) => {
        try {
            const reports = await Report.find().sort({ $natural: -1 }).limit(10)

            if (reports.length === 0) {
                return res.status(200).json({reports: null, message: 'Обращения не найдены' })
            }

            res.status(200).json({ reports, message: "Успешно" })

        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
            console.log(e)
        }
    })

router.post(
    '/setReportImg',
    upload.single('reportImg'),
    async (req, res) => {
        try {
            let reportImg = req.file;

            if (!reportImg) {
                res.json({ message: "Ошибка при загрузке файла" })
            }
            else {
                const { filename, path } = reportImg
                let fileName = filename
                let pathTo = path.replace(/\\/g, "/")

                const img = new ReportImg({ fileName, pathTo })

                await img.save()

                res.status(200).json({ message: 'Файл загружен', url: pathTo })
            }
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
            console.log(e);
        }
    })

module.exports = router
