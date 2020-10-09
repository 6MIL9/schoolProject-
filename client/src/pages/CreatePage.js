import React, { useState, useEffect, useContext } from 'react'
import { useHttp } from './../hooks/http.hook';
import {useHistory} from 'react-router-dom'
import { AuthContext } from './../context/AuthContext';

const CreatePage = () => {

    const history = useHistory()
    const auth = useContext(AuthContext)
    const { request } = useHttp()
    const [link, setLink] = useState('')

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    const pressHandler = async event => {
        if (event.key === 'Enter') {
            try {
                const data = await request('http://localhost:80/api/link/generate', 'POST', { from: link }, {
                    Authorization: `Bearer ${auth.token}`
                })
                history.push(`/detail/${data.link._id}`)
            } catch (e) { }
        }
    }
    useEffect(() => {
        window.M.updateTextFields();
    }, [])

    return (
        <div className="row">
            <div className="col s8 offset-s2" style={{ paddingTop: '2rem' }}>
                <div className="input-field">
                    <input placeholder="Введите ссылку" id="link" type="text" className="input"
                        onChange={e => setLink(e.target.value)} onKeyPress={pressHandler} value={link} />
                    <label htmlFor="link">Введите ссылку</label>
                </div>
            </div>
        </div>
    )
}

export default CreatePage
