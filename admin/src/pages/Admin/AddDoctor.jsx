import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AddDoctor = () => {

  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')

  const { backendUrl } = useContext(AdminContext)
  const { aToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!docImg) {
        return toast.error('Imagen no seleccionada');
      }

      // Validate file size (10MB = 10485760 bytes - Cloudinary free tier limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (docImg.size > maxSize) {
        return toast.error(`La imagen es demasiado grande. Tamaño máximo: 10MB. Tu imagen: ${(docImg.size / 1024 / 1024).toFixed(2)}MB`);
      }

      const formData = new FormData();

      formData.append('image', docImg);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('experience', experience);
      formData.append('fees', Number(fees));
      formData.append('about', about);
      formData.append('speciality', speciality);
      formData.append('degree', degree);
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));

      // Debugging FormData (optional, can remove later)
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      const response = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
        headers: { aToken }
      })
      const data = response.data;
      if (data.success) {
        toast.success(data.message)
        setDocImg(false)
        setName('')
        setPassword('')
        setEmail('')
        setAddress1('')
        setAddress2('')
        setDegree('')
        setAbout('')
        setFees('')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      console.error(error);
    }
  }


  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full'>

      <p className='mb-3 text-lg font-medium'>Añadir Doctor</p>

      <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor="doc-img">
            <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
          </label>
          <input onChange={(e) => setDocImg(e.target.files[0])} type="file" name="" id="doc-img" hidden />
          <p>Subir foto <br /> del doctor</p>
        </div>

        <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>

          <div className='w-full lg:flex-1 flex flex-col gap-4'>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Nombre</p>
              <input onChange={e => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Nombre' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Correo del doctor</p>
              <input onChange={e => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Correo' required />
            </div>


            <div className='flex-1 flex flex-col gap-1'>
              <p>Establecer contraseña</p>
              <input onChange={e => setPassword(e.target.value)} value={password} className='border rounded px-3 py-2' type="password" placeholder='Contraseña' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Experiencia</p>
              <select onChange={e => setExperience(e.target.value)} value={experience} className='border rounded px-2 py-2' >
                <option value="1 Año">1 Año</option>
                <option value="2 Años">2 Años</option>
                <option value="3 Años">3 Años</option>
                <option value="4 Años">4 Años</option>
                <option value="5 Años">5 Años</option>
                <option value="6 Años">6 Años</option>
                <option value="8 Años">8 Años</option>
                <option value="9 Años">9 Años</option>
                <option value="10 Años">10+ Años</option>
              </select>
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Tarifa</p>
              <input onChange={e => setFees(e.target.value)} value={fees} className='border rounded px-3 py-2' type="number" placeholder='Tarifa del doctor' required />
            </div>

          </div>

          <div className='w-full lg:flex-1 flex flex-col gap-4'>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Especialidad</p>
              <select onChange={e => setSpeciality(e.target.value)} value={speciality} className='border rounded px-2 py-2'>
                <option value="Médico general">Médico general</option>
                <option value="Ginecólogo/a">Ginecólogo/a</option>
                <option value="Dermatólogo/a">Dermatólogo/a</option>
                <option value="Pediatras">Pediatras</option>
                <option value="Neurólogo/a">Neurólogo/a</option>
                <option value="Gastroenterólogo/a">Gastroenterólogo/a</option>
              </select>
            </div>


            <div className='flex-1 flex flex-col gap-1'>
              <p>Título</p>
              <input onChange={e => setDegree(e.target.value)} value={degree} className='border rounded px-3 py-2' type="text" placeholder='Título' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Dirección</p>
              <input onChange={e => setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type="text" placeholder='Dirección 1' required />
              <input onChange={e => setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type="text" placeholder='Dirección 2' required />
            </div>

          </div>

        </div>

        <div>
          <p className='mt-4 mb-2'>Sobre el doctor</p>
          <textarea onChange={e => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' rows={5} placeholder='escribir sobre el doctor'></textarea>
        </div>

        <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Añadir doctor</button>

      </div>


    </form>
  )
}

export default AddDoctor
