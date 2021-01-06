const { Router } = require('express')
const mongoose = require('mongoose')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const Report = require('../models/Report')
const User = require('../models/User')
const ReportImg = require('../models/ReportImg')
const router = Router()
const multer = require('multer')
const pathF = require('path');

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
    async (req, res) => {
        try {

            const { title, body, userId, url } = req.body

            const report = new Report({ title, body, createdBy: userId, urlToImg: url })

            await report.save()

            res.status(200).json({ response: 200 })

        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    })

// const report = await Report.find().sort({ $natural: -1 }).limit(5)
router.get(
    '/get/:userId',
    async (req, res) => {
        try {
            userId = req.params.userId

            const report = await Report.find({ createdBy: userId })

            if (!report) {
                return res.status(400).json({ message: 'Обращение не найдено' })
            }

            res.json({ report, message: "Успешно" })

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

            if (!reports) {
                return res.status(400).json({ message: 'Обращение не найдено' })
            }

            res.json({ reports, message: "Успешно" })

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
                const { filename, path, originalname } = reportImg
                let fileName = filename
                let pathTo = path

                const img = new ReportImg({ fileName, pathTo })

                await img.save()

                res.status(201).json({ message: 'Файл загружен', url: pathTo })
            }
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
            console.log(e);
        }
    })

module.exports = router
