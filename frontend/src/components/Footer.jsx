import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <div className="px-5 md:px-5">
      <div className="grid md:grid-cols-[3fr_1fr_1fr] gap-12 my-10 mt-20 text-sm items-start">
        {/* Left Section */}
        <div className="flex items-start gap-4">
          <img className="w-28 mt-1" src={'/favicon.svg'} alt="Appointy Logo" />
          <p className="text-gray-600 leading-6 md:max-w-[75%]">
            <strong>Appointy – Agendamiento de Salud sin Esfuerzo

            </strong> <br />Los pacientes pueden reservar citas al instante con doctores de confianza—desde chequeos de rutina hasta atención especializada—en solo unos pocos clics. Nuestros recordatorios inteligentes mantienen las citas al día, mientras que las actualizaciones en tiempo real aseguran una coordinación perfecta. Diseñado para la salud moderna, ahorramos tiempo tanto para pacientes como para proveedores.
          </p>
        </div>


        {/* Middle Section */}
        <div>
          <p className="text-lg font-semibold mb-4">EMPRESA</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Inicio</li>
            <li>Sobre Nosotros</li>
            <li>Contáctanos</li>
            <li>Política de Privacidad</li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <p className="text-lg font-semibold mb-4">PONTE EN CONTACTO</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+57 312 345 6789</li>
            <li>customersupport@appointy.in</li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <hr className="border-gray-300" />
      <p className="py-4 text-sm text-center text-gray-600">
        © 2025 appointy.in — Todos los derechos reservados.
      </p>
    </div>
  );
};

export default Footer;
