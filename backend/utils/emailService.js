import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send appointment confirmation email to patient
 * @param {Object} appointmentData - Appointment details
 * @param {Object} doctorData - Doctor information
 * @param {Object} patientData - Patient information
 */
export const sendAppointmentConfirmation = async (appointmentData, doctorData, patientData) => {
    try {
        const { slotDate, slotTime, amount } = appointmentData;
        const { name: doctorName, speciality } = doctorData;
        const { email: patientEmail, name: patientName } = patientData;

        // Format date for display
        const [day, month, year] = slotDate.split('_');
        const months = ["", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const formattedDate = `${day} ${months[parseInt(month)]} ${year}`;

        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .appointment-details {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: bold;
            color: #667eea;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🏥 Appointy</div>
        <h1 style="margin: 0;">¡Cita Confirmada!</h1>
    </div>
    
    <div class="content">
        <p>Estimado/a <strong>${patientName}</strong>,</p>
        
        <p>Nos complace informarle que su cita médica ha sido confirmada y completada exitosamente.</p>
        
        <div class="appointment-details">
            <h2 style="color: #667eea; margin-top: 0;">Detalles de la Cita</h2>
            
            <div class="detail-row">
                <span class="label">Doctor:</span>
                <span>${doctorName}</span>
            </div>
            
            <div class="detail-row">
                <span class="label">Especialidad:</span>
                <span>${speciality}</span>
            </div>
            
            <div class="detail-row">
                <span class="label">Fecha:</span>
                <span>${formattedDate}</span>
            </div>
            
            <div class="detail-row">
                <span class="label">Hora:</span>
                <span>${slotTime}</span>
            </div>
            
            <div class="detail-row">
                <span class="label">Tarifa:</span>
                <span>$${amount}</span>
            </div>
            
            <div class="detail-row">
                <span class="label">Clínica:</span>
                <span>Appointy - Agendamiento de Salud sin Esfuerzo</span>
            </div>
        </div>
        
        <p><strong>Recordatorios importantes:</strong></p>
        <ul>
            <li>Por favor llegue 10 minutos antes de su cita</li>
            <li>Traiga su documento de identidad</li>
            <li>Si necesita cancelar, hágalo con al menos 24 horas de anticipación</li>
        </ul>
        
        <p>Si tiene alguna pregunta o necesita reprogramar su cita, no dude en contactarnos.</p>
        
        <p>¡Gracias por confiar en nosotros para su atención médica!</p>
    </div>
    
    <div class="footer">
        <p><strong>Appointy</strong></p>
        <p>Agendamiento de Salud sin Esfuerzo</p>
        <p>📞 +57 312 345 6789 | 📧 customersupport@appointy.in</p>
        <p style="font-size: 12px; color: #999; margin-top: 15px;">
            Este es un correo automático, por favor no responda a este mensaje.
        </p>
    </div>
</body>
</html>
        `;

        const { data, error } = await resend.emails.send({
            from: 'Appointy <onboarding@resend.dev>', // Cambiar cuando tengas dominio verificado
            to: [patientEmail],
            subject: `Confirmación de Cita - ${doctorName}`,
            html: emailHtml,
        });

        if (error) {
            console.error('Error sending email:', error);
            return { success: false, error };
        }

        console.log('Email sent successfully:', data);
        return { success: true, data };

    } catch (error) {
        console.error('Error in sendAppointmentConfirmation:', error);
        return { success: false, error: error.message };
    }
};

export default { sendAppointmentConfirmation };
