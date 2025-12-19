import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { sendAppointmentConfirmation } from "../utils/emailService.js";

const changeAvailability = async (req, res) => {
  try {

    const { docId } = req.body

    const docData = await doctorModel.findByPk(docId)
    if (!docData) {
      return res.status(404).json({ success: false, message: "Doctor no encontrado" });
    }
    await docData.update({ available: !docData.available })
    res.json({ success: true, message: 'Disponibilidad Cambiada' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
}

const doctorList = async (req, res) => {
  try {

    const doctors = await doctorModel.findAll({
      attributes: { exclude: ['password', 'email'] }
    })

    res.json({ success: true, doctors })

  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// API to login doctor 
const loginDoctor = async (req, res) => {

  try {

    const { email, password } = req.body
    const user = await doctorModel.findOne({ where: { email } })

    if (!user) {
      return res.status(401).json({ success: false, message: "Credenciales invalidas" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
      res.json({ success: true, token })
    } else {
      res.status(401).json({ success: false, message: "Credenciales invalidas" })
    }


  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
  try {

    const docId = req.user.id // Assuming docId comes from authenticated user
    const appointments = await appointmentModel.findAll({ where: { docId } })

    res.json({ success: true, appointments })

  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
  try {

    const docId = req.user.id // Assuming docId comes from authenticated user
    const { appointmentId } = req.body

    const appointmentData = await appointmentModel.findByPk(appointmentId)
    if (appointmentData && Number(appointmentData.docId) === Number(docId)) {
      await appointmentData.update({ isCompleted: true })

      // Send confirmation email to patient
      try {
        // Parse userData and docData if they're strings
        const userData = typeof appointmentData.userData === 'string'
          ? JSON.parse(appointmentData.userData)
          : appointmentData.userData;

        const docData = typeof appointmentData.docData === 'string'
          ? JSON.parse(appointmentData.docData)
          : appointmentData.docData;

        await sendAppointmentConfirmation(
          {
            slotDate: appointmentData.slotDate,
            slotTime: appointmentData.slotTime,
            amount: appointmentData.amount
          },
          {
            name: docData.name,
            speciality: docData.speciality
          },
          {
            email: userData.email,
            name: userData.name
          }
        );
        console.log('Confirmation email enviado exitosamente');
      } catch (emailError) {
        console.error('Error enviando email de confirmación:', emailError);
        // Don't fail the request if email fails
      }

      return res.json({ success: true, message: 'Cita Completada' })
    }

    res.status(403).json({ success: false, message: 'Doctor o cita invalida' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
  try {

    const docId = req.user.id // Assuming docId comes from authenticated user
    const { appointmentId } = req.body

    const appointmentData = await appointmentModel.findByPk(appointmentId)
    if (appointmentData && Number(appointmentData.docId) === Number(docId)) {
      await appointmentData.update({ cancelled: true })
      return res.json({ success: true, message: 'Cita Cancelada' })
    }

    res.status(403).json({ success: false, message: 'Doctor o cita invalida' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
  try {

    const docId = req.user.id // Assuming docId comes from authenticated user

    const appointments = await appointmentModel.findAll({ where: { docId } })

    let earnings = 0

    const patientSet = new Set(); // Use a Set for unique patients

    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount
      }
      patientSet.add(item.userId);
    })

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patientSet.size,
      latestAppointments: appointments.reverse().slice(0, 5)
    }

    res.json({ success: true, dashData })

  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// API to get doctor profile for doctor panel
const doctorProfile = async (req, res) => {
  try {

    const docId = req.user.id // Assuming docId comes from authenticated user
    const profileData = await doctorModel.findByPk(docId, {
      attributes: { exclude: ['password'] }
    })

    res.json({ success: true, profileData })

  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// API to update doctor profile data from doctor panel
const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.user.id
    const { fees, address, available, about } = req.body

    await doctorModel.update({ fees, address, available, about }, { where: { id: docId } })

    res.json({ success: true, message: 'Perfil Actualizado' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
}

export {
  changeAvailability,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  appointmentComplete,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile
}
