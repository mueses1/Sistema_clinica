import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js"

// API for admin login
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Credenciales no válidas" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for adding Doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.status(400).json({ success: false, message:"Detalles faltantes" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Por favor ingresa un correo electrónico válido" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Por favor ingresa una contraseña fuerte" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        };

        await doctorModel.create(doctorData);

        res.status(200).json({ success: true, message: "Doctor Agregado" });

    } catch (error) {
        console.error("Error agregando doctor:", error);
        res.status(500).json({ success: false, message: error.message || "Error interno del servidor" });
    }
};

// API para cancelar citas
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findByPk(appointmentId)

        if (!appointmentData) {
            return res.json({ success: false, message: "Cita no encontrada" })
        }

        await appointmentData.update({ cancelled: true })

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findByPk(docId)

        let slots_booked = doctorData.slots_booked

        if (slots_booked[slotDate]) {
            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
            await doctorData.update({ slots_booked })
        }

        res.json({ success: true, message: 'Cita Cancelada' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const allDoctors = async (req, res) => {
    try {

        const doctors = await doctorModel.findAll({
            attributes: { exclude: ['password'] }
        })
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API para obtener todas las citas
const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.findAll({})
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {

        const doctorsCount = await doctorModel.count()
        const usersCount = await userModel.count()
        const appointmentsCount = await appointmentModel.count()
        const latestAppointments = await appointmentModel.findAll({
            limit: 5,
            order: [['date', 'DESC']]
        })

        const dashData = {
            doctors: doctorsCount,
            appointments: appointmentsCount,
            patients: usersCount,
            latestAppointments: latestAppointments
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


export { loginAdmin, addDoctor, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard }
