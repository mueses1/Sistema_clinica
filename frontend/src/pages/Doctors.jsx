import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'



const Doctors = () => {

  const { speciality: rawSpeciality } = useParams()
  const speciality = rawSpeciality ? decodeURIComponent(rawSpeciality) : undefined
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext)
  const applyFilter = () => {
    console.log('=== FILTER DEBUG ===')
    console.log('Looking for speciality:', `"${speciality}"`)
    console.log('All doctors with specialities:')
    doctors.forEach(d => {
      console.log(`  - ${d.name}: "${d.speciality}" (match: ${d.speciality === speciality})`)
    })

    if (speciality) {
      const filtered = doctors.filter(doc => doc.speciality === speciality)
      console.log(`Found ${filtered.length} matching doctors`)
      setFilterDoc(filtered)
    } else {
      setFilterDoc(doctors)
    }
  }
  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div>
      <p className='text-gray-600'>Navega a través de los especialistas médicos.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button onClick={() => setShowFilter(!showFilter)} className={`py-1 px-3 border rounded text-sm  transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}>Filtros</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={() => speciality === 'Médico general' ? navigate('/doctors') : navigate(`/doctors/${encodeURIComponent('Médico general')}`)} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Médico general' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Médico general</p>
          <p onClick={() => speciality === 'Ginecólogo/a' ? navigate('/doctors') : navigate(`/doctors/${encodeURIComponent('Ginecólogo/a')}`)} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Ginecólogo/a' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Ginecólogo/a</p>
          <p onClick={() => speciality === 'Dermatólogo/a' ? navigate('/doctors') : navigate(`/doctors/${encodeURIComponent('Dermatólogo/a')}`)} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Dermatólogo/a' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Dermatólogo/a</p>
          <p onClick={() => speciality === 'Pediatras' ? navigate('/doctors') : navigate(`/doctors/${encodeURIComponent('Pediatras')}`)} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Pediatras' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Pediatras</p>
          <p onClick={() => speciality === 'Neurólogo/a' ? navigate('/doctors') : navigate(`/doctors/${encodeURIComponent('Neurólogo/a')}`)} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Neurólogo/a' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Neurólogo/a</p>
          <p onClick={() => speciality === 'Gastroenterólogo/a' ? navigate('/doctors') : navigate(`/doctors/${encodeURIComponent('Gastroenterólogo/a')}`)} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Gastroenterólogo/a' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Gastroenterólogo/a</p>
        </div>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {filterDoc.map((item, index) => (
            <div onClick={() => { console.log("Navigating to doctor:", item); navigate(`/appointment/${item.id}`); scrollTo(0, 0) }} className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
              <img className='bg-[#EAEFFF] w-full h-56 object-cover' src={item.image} alt="" />
              <div className='p-4'>
                <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : "text-gray-500"}`}>
                  <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p><p>{item.available ? 'Disponible' : "No Disponible"}</p>
                </div>
                <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
                <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Doctors
