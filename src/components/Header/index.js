import {useContext} from 'react'
import './header.css'
import {AuthContext} from '../../contexts/auth'
import avatar from '../../assets/avatar.png'

import { Link } from 'react-router-dom'
import { FiHome, FiUser, FiSettings, FiLogOut, FiMonitor, FiSliders } from 'react-icons/fi'



export default function Header() {

    const { user, logout } = useContext(AuthContext)
    return(
        <>
            <div className='sidebar'>
                <div>
                    <img src={user.avatarUrl === null ? avatar : user.avatarUrl} alt='Foto avatar' />
                </div>
                
                <Link to='/dashboard'>
                    <FiHome color='#FFF' size={24} />
                    Cursos
                </Link>
                <Link to='/dashfuncionario'>
                    <FiMonitor color='#FFF' size={24} />
                    Dash Emp / Func
                </Link>
                <Link to='/employee'>
                    <FiUser color='#FFF' size={24} />
                    Funcionarios
                </Link>
                <Link to='/driver'>
                    <FiUser color='#FFF' size={24} />
                    Motoristas
                </Link>
                <Link to='/company'>
                    <FiSliders color='#FFF' size={24} />
                    Empresas
                </Link>
                
                <Link to='/profile'>
                    <FiSettings color='#FFF' size={24} />
                    Configurações
                </Link>                
                <Link to='' onClick={ () => logout() }>
                    <FiLogOut color='#FFF' size={24}  />
                    Sair
                </Link>
               
            </div>                                            

        </>
    )
}