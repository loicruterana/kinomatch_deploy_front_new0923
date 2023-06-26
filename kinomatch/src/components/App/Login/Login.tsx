// ================ IMPORT BIBLIOTHEQUES ================

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

// ================ IMPORT CONTEXTS ================

import { AuthContext } from '../../../contexts/AuthContext';

// ================ IMPORT COMPOSANTS ================

import Connected from '../Connected/Connected';

// ================ IMPORT SCSS ================

import './Login.scss';

//* ================ COMPOSANT ================

export const Login = () => {
  // ================ IMPORT PROPS CONTEXTS ================

  const { userData, addUserData, login } = useContext(AuthContext);

  // ================ USESTATE ================

  // state qui va recevoir les données du formulaire
  const [postProfil, setPostProfil] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
  });
  // state pour la redirection vers la page d'accueil
  const [goToHomePage, setGoToHomePage] = useState(false);
  // state pour afficher un message d'erreur
  const [message, setMessage] = useState('');

  // ================ UTILS ================
  // fonction qui va permettre de rediriger vers la page d'accueil
  if (goToHomePage) {
    return <Navigate to='/' />;
  }

  // ================ HANDLERS ================

  // handleChange pour enregistrer les entrées dans les inputs du formulaire
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setPostProfil({
      ...postProfil,
      [event.target.name]: value,
    });
  };

  //handleSubmit pour envoyer les données du formulaire pour se loger
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const userData: { email: string; password: string } = {
      email: postProfil.email,
      password: postProfil.password,
    };

    axios
      // envoi des données au back
      .post('https://deploy-back-kinomatch.herokuapp.com/login', userData)
      .then((response) => {
        if (response.status === 200) {
          //Utilisateur connecté
          setMessage(response.data.message);
          addUserData(response.data.user.email, response.data.user.id);

          login();
          setTimeout(() => {
            setGoToHomePage(true);
          }, 1500);
        }

        // OK
      })
      .catch((error) => {
        console.log(error);

        if (error.response.status === 400) {
          //Email et mot de passe obligatoires
          //Email ou mot de passe invalide
          console.log(error.response.data.error);
          setMessage(error.response.data.error);
          return;
        }

        if (error.response.status === 500) {
          //Erreur lors de la connexion de l\'utilisateur
          console.log(error.response.data.error);
          setMessage(error.response.data.error);
          return;
        }
      });
  };
  // ================ JSX ================
  return (
    <div className='Login-container'>
      {/* formulaire de connexion */}
      <form className='Login-container-form' onSubmit={handleSubmit}>
        <label htmlFor='email'>Votre email</label>
        <input
          onChange={handleChange}
          className='Login-container-form-input'
          type='email'
          id='email'
          name='email'
          required
          placeholder='votre@email.com'
        />
        <label htmlFor='password'>Votre mot de passe</label>
        <input
          onChange={handleChange}
          className='Login-container-form-input'
          type='password'
          id='password'
          name='password'
          required
          placeholder='v0tr3MdP1c1'
        />

        {/* <HCaptcha
        sitekey="7089290a-26a0-4d4d-8124-cfbe1a2c3b8a"
        onVerify={(token,ekey) => handleVerificationSuccess(token, ekey)}
        />         */}

        <Link key='signup' to='/signup'>
          <span className='new-account'>
            Vous n'avez pas encore de compte ?
          </span>
        </Link>

        <button type='submit'>Connexion</button>
        <p className='Login-container__message'>{message}</p>
      </form>
      {userData.email && <Connected />}
    </div>
  );
  //* ================ FERMETURE COMPOSANT ================
};

export default Login;
