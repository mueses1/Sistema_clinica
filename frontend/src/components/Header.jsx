import React from 'react'
import { assets } from '../assets/assets'
import './Header.css'

const Header = () => {
    return (
        <div className='header-container relative flex flex-col md:flex-row flex-wrap rounded-lg px-6 md:px-10 lg:px-20 overflow-hidden'>

            {/* Animated Gradient Background */}
            <div className='gradient-bg'></div>

            {/* Floating Particles */}
            <div className='particles'>
                {[...Array(15)].map((_, i) => (
                    <div key={i} className='particle' style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${15 + Math.random() * 10}s`
                    }}></div>
                ))}
            </div>

            {/* --------- Header Left --------- */}
            <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px] z-10 animate-fade-in-up'>
                <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight drop-shadow-lg'>
                    Reserva una Cita <br /> Con Doctores de Confianza
                </p>
                <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
                    <img className='w-28 drop-shadow-md hover:scale-110 transition-transform duration-300' src={assets.group_profiles} alt="Perfiles de grupo" />
                    <p className='drop-shadow-md'>Simplemente navega a través de nuestra extensa lista de doctores de confianza, <br className='hidden sm:block' /> programa tu cita sin complicaciones.</p>
                </div>
                <a href='#speciality' className='cta-button flex items-center gap-2 bg-white px-8 py-3 rounded-full text-[#595959] text-sm m-auto md:m-0 font-medium shadow-lg hover:shadow-2xl transition-all duration-300'>
                    Reservar cita <img className='w-3' src={assets.arrow_icon} alt="Flecha" />
                </a>
            </div>

            {/* --------- Header Right --------- */}
            <div className='md:w-1/2 relative z-10 animate-fade-in-right'>
                <div className='doctor-image-wrapper'>
                    <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={assets.header_img} alt="Doctores" />
                </div>
            </div>
        </div>
    )
}

export default Header
