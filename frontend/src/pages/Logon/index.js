import React, { useState }from 'react';
import {Link, useHistory} from 'react-router-dom';
import {FiLogIn} from 'react-icons/fi';
import api from '../../services/api';

import './styles.css';
import logoImg from '../../assets/logo.svg';
import volunteerImg from '../../assets/volunteer.png';

export default function Logon() {
  const [id, setId] = useState('');
  const history = useHistory();

  async function handleLogon(e){
    e.preventDefault();
    try {
      const response = await api.post('sessions', { id });
      localStorage.setItem('ongId', id);
      localStorage.setItem('ongName', response.data.name);
      history.push('/profile');
  
    } catch (error) {
      alert('Erro no login');
    }
  }
  return (

    <div className="logon-container">
      <section className="form">
      <img src={logoImg} alt="Logo Volunteer Network"/>

      <form onSubmit={handleLogon}>
        <h1>Faça seu logon</h1>
        <input placeholder="Sua ID"
          value={id}
          onChange={e => setId(e.target.value)}
        />

        <button className="button" type="submit">Entrar</button>
        <Link to="/register" className="back-link">
          <FiLogIn size={16} color="#E02041"/>
          Não tenho cadastro
        </Link>
      </form>
      </section>
      <img src={volunteerImg} alt="volunteer"/>
    </div>
  );
}