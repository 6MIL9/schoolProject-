const { Router } = require('express')
const mongoose = require('mongoose')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const Report = require('../models/Report')
const router = Router()

// /api/report/create
router.post(
    '/create',
    async (req, res) => {
        try {

            const { title, body, owner } = req.body

            const report = new Report({ title, body, owner })

            await report.save()

            res.status(201).json({ message: 'Обращение создано успешно' })

        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    })


router.get(
    '/get',
    async (req, res) => {
        try {
            const report = await Report.find().sort({ $natural: -1 }).limit(5)

            if (!report) {
                return res.status(400).json({ message: 'Обращение не найдено' })
            }


            res.json({ report, message: "Успешно" })

        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
            console.log(e)
        }
    })

module.exports = router
