import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-[#707070]'>
        <p>SOBRE <span className='text-gray-700 font-semibold'>NOSOTROS</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Bienvenido a Appointy, tu socio de confianza para gestionar tus necesidades de salud de manera conveniente y eficiente. En Appointy, entendemos los desafíos que enfrentan las personas cuando se trata de programar citas médicas y gestionar sus registros de salud.</p>
          <p>Appointy está comprometido con la excelencia en la tecnología de la salud. Nos esforzamos continuamente por mejorar nuestra plataforma, integrando los últimos avances para mejorar la experiencia del usuario y ofrecer un servicio superior. Ya sea que estés reservando tu primera cita o gestionando una atención continua, Appointy está aquí para apoyarte en cada paso del camino.</p>
          <b className='text-gray-800'>Nuestra Visión</b>
          <p>Nuestra visión en Appointy es crear una experiencia de salud fluida para cada usuario. Nuestro objetivo es cerrar la brecha entre los pacientes y los proveedores de salud, facilitando el acceso a la atención que necesitas, cuando la necesitas.</p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>POR QUÉ <span className='text-gray-700 font-semibold'>ELEGIRNOS</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>EFICIENCIA:</b>
          <p>Programación de citas simplificada que se adapta a tu estilo de vida ocupado.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>CONVENIENCIA: </b>
          <p>Acceso a una red de profesionales de la salud de confianza en tu área.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>PERSONALIZACIÓN:</b>
          <p >Recomendaciones y recordatorios personalizados para ayudarte a mantenerte al tanto de tu salud.</p>
        </div>
      </div>

    </div>
  )
}

export default About
