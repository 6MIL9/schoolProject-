import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { useHttp } from './../hooks/http.hook';
import { useMessage } from './../hooks/message.hook';

const AuthPage = () => {
    const auth = useContext(AuthContext);
    const message = useMessage();
    const { loading, error, request, clearError } = useHttp();
    const [form, setForm] = useState({
        email: '', password: ''
    })

    useEffect(() => {
        message(error);
        clearError();
    }, [error, clearError, message])

    useEffect(() => {
        window.M.updateTextFields();
    }, [])

    const changeHandler = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const registerHandler = async () => {
        try {
            const data = await request('http://localhost:80/api/auth/register', 'POST', { ...form });
            message(data.message);
        } catch (e) { }
    }

    const loginHandler = async () => {
        try {
            const data = await request('http://localhost:80/api/auth/login', 'POST', { ...form });
            message(data.message);
            auth.login(data.token, data.userId)
        } catch (e) { }
    }

    const getrep = async () => {
        try {
            const data = await request('http://localhost:80/api/report/get', 'GET');
            message(data.message);
            console.log(data)
        } catch (e) { }
    }


    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Сократи ссылку</h1>
                <div className="card blue darken-5">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>
                        <div>
                            <div className="input-field">
                                <input placeholder="Введите email" id="email" type="text" name="email"
                                    value={form.email} className="yellow-input" onChange={changeHandler} />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="input-field">
                                <input placeholder="Введите пароль" id="password" type="password" name="password"
                                    value={form.password} className="yellow-input" onChange={changeHandler} />
                                <label htmlFor="password">Password</label>
                            </div>
                            <form action="http://localhost:80/api/report/setReportImg" method="post" enctype="multipart/form-data">
                                <input type="file" name="reportImg" />
                                <input type="submit" value="Send" />
                            </form>

                        </div>
                    </div>
                    <div className="card-action">
                        <button className="btn green" style={{ marginRight: "1rem" }} onClick={loginHandler} disabled={loading}>Войти</button>
                        <button className="btn yellow black-text" style={{ marginRight: "1rem" }} onClick={registerHandler} disabled={loading}>Регистрация</button>
                        <button className="btn purple white-text" onClick={getrep} disabled={loading}>Тест get rep</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthPage
