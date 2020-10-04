import React, { useContext } from 'react'
import { useHistory, NavLink } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {

    const auth = useContext(AuthContext);
    const history = useHistory();

    const logoutHandler = () => {
        auth.logout();
        history.push('/');
    }

    return (
        <nav>
            <div className="nav-wrapper blue darken-1" style={{ padding: '0 2rem' }}>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink to="/create">Создать</NavLink></li>
                    <li><NavLink to="/links">Ссылки</NavLink></li>
                    <li><a to="#" onClick={logoutHandler}>Выйти</a></li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;
