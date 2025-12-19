import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

import { GoogleLogin } from '@react-oauth/google'

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext)
  const [state, setState] = useState('Iniciar Sesión')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const onGoogleSuccess = async (response) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/google-login', { token: response.credential })
      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        toast.success('Sesión iniciada con Google')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onGoogleFailure = () => {
    toast.error('Error al iniciar sesión con Google')
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === 'Registrarse') {

        const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })

        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }

      } else {

        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })

        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }

      }
    } catch (error) {
      toast.error(error.message)
    }

  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Registrarse' ? 'Crear Cuenta' : 'Iniciar Sesión'}</p>
        <p>Por favor {state === 'Registrarse' ? 'regístrate' : 'inicia sesión'} para reservar una cita</p>
        {state === 'Registrarse'
          ? <div className='w-full '>
            <p>Nombre Completo</p>
            <input onChange={(e) => setName(e.target.value)} value={name} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="text" required />
          </div>
          : null
        }
        <div className='w-full '>
          <p>Correo electrónico</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
        </div>
        <div className='w-full '>
          <p>Contraseña</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
        </div>
        <button type='submit' className='bg-primary text-white w-full py-2 my-2 rounded-md text-base'>{state === 'Registrarse' ? 'Crear cuenta' : 'Iniciar Sesión'}</button>

        <div className='w-full flex justify-center my-2'>
          <GoogleLogin
            onSuccess={onGoogleSuccess}
            onError={onGoogleFailure}
            text="signin_with"
            shape="rectangular"
            width="320"
            use_fedcm={false}
          />
        </div>

        {state === 'Registrarse'
          ? <p>¿Ya tienes una cuenta? <span onClick={() => setState('Iniciar Sesión')} className='text-primary underline cursor-pointer'>Inicia sesión aquí</span></p>
          : <p>¿No tienes una cuenta? <span onClick={() => setState('Registrarse')} className='text-primary underline cursor-pointer'>Regístrate aquí</span></p>
        }
      </div>
    </form>
  )
}

export default Login