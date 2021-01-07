const { Router } = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult, body } = require('express-validator')
const VerifyToken = require('../middleware/verifyTokenMW');
const User = require('../models/User')
const RefreshToken = require('../models/RefreshToken')
const router = Router()

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Некорректный email').normalizeEmail().isEmail(),
        check('password', 'Минимальная длина пароля 6 символов')
            .isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const { email, password } = req.body

            const candidate = await User.findOne({ email })

            if (candidate) {
                return res.status(400).json({ message: 'Такой пользователь уже существует' })
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({ email, password: hashedPassword, userRole: 0 })

            await user.save()

            res.status(200).json({ message: 'Пользователь создан' })

        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
            console.log(e)
        }
    })

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректный данные при входе в систему',
                    data: res
                })
            }

            const { email, password } = req.body

            const user = await User.findOne({ email })

            if (!user) {
                return res.status(400).json({ message: 'Пользователь не найден' })
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )

            const refreshToken = jwt.sign(
                { userId: user.id },
                config.get('jwtSecretRefresh'),
                { expiresIn: '90d' }
            )

            const rfToken = new RefreshToken({ user: user.id, token: refreshToken })

            await rfToken.save()

            res.status(200).json({ token, refreshToken, userId: user.id, message: "Успешно" })

        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    })

router.get('/me', VerifyToken, function (req, res, next) {
    User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("Что-то пошло не так, попробуйте снова");
        if (!user) return res.status(404).send("Пользователь не найден");

        res.status(200).send(user);
    });
});

router.post(
    '/refreshToken',
    async (req, res) => {
        try {
            const { accessToken, rfToken, userId } = req.body

            jwt.verify(accessToken, config.get('jwtSecret'), function (err, decoded) {
                if (err) {

                    const newAccessToken = jwt.sign(
                        { userId: userId },
                        config.get('jwtSecret'),
                        { expiresIn: '1h' }
                    )
        
                    const newRfToken = jwt.sign(
                        { userId: userId },
                        config.get('jwtSecretRefresh'),
                        { expiresIn: '90d' }
                    )
                    return res.status(500).send({ accessToken: newAccessToken, rfToken: newRfToken, message: 'Срок действия токена доступа истёк' });
                } else {
                    jwt.verify(rfToken, config.get('jwtSecretRefresh'), function (err, decoded) {
                        if (err) return res.status(500).send({ message: 'Срок действия токена обновления истёк' });
                    });

                    res.status(200).json({ accessToken, rfToken, message: "Обновлять токены не нужно" })
                }
            });
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
            console.log(e)
        }
    })


module.exports = router
