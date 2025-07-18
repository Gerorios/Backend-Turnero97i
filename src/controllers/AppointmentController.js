const express = require("express");
const AppointmentModel = require("../models/AppointmentSchema");

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find()
      .populate("user", "name last_name email phone_number")  // Popula información del usuario (paciente)
      .populate("medico", "name last_name email")  // Popula información del médico (desde el modelo "User")
      .populate("tipoEstudio", "name");  // Popula información sobre el tipo de estudio

    res.status(200).json({ msg: "All appointments", appointments: appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ msg: "Error: Server", error });
  }
};


// Obtener una cita por ID
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await AppointmentModel.findById(req.params.id)
      .populate("user", "first_name last_name email")
      .populate("tipoEstudio", "name")
      .populate("medico", "first_name last_name email");

    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    res.status(200).json({ msg: "Appointment details", appointment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error: Server", error });
  }
};

// Crear una nueva cita
const createAppointment = async (req, res) => {
  try {
    console.log(req.body); // Verificar qué datos están llegando desde el front

    const newAppointment = new AppointmentModel(req.body);
    await newAppointment.save();

    res.status(201).json({ msg: "Appointment created successfully", newAppointment });
  } catch (error) {
    console.log(error);  // Asegúrate de ver el error exacto en la consola
    res.status(500).json({ msg: "Error: Server", error });
  }
};


// Actualizar una cita por ID
const updateAppointment = async (req, res) => {
  try {
    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    res.status(200).json({ msg: "Appointment updated successfully", updatedAppointment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error: Server", error });
  }
};

// Eliminar una cita por ID
const deleteAppointment = async (req, res) => {
  try {
    const deletedAppointment = await AppointmentModel.findByIdAndDelete(req.params.id);

    if (!deletedAppointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    res.status(200).json({ msg: "Appointment deleted successfully", deletedAppointment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error: Server", error });
  }
};

//Controlador para aceptar/rechazar citas
const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; // 'aceptado' o 'rechazado'

  if (!['aceptado', 'rechazado'].includes(estado)) {
    return res.status(400).json({ msg: "Estado no válido" });
  }

  try {
    const appointment = await AppointmentModel.findByIdAndUpdate(id, { estado }, { new: true });
    
    if (!appointment) {
      return res.status(404).json({ msg: "Cita no encontrada" });
    }

    res.status(200).json({ msg: `Cita ${estado}`, appointment });
  } catch (error) {
    console.log("Error updating appointment status:", error);
    res.status(500).json({ msg: "Error: Server", error });
  }
};

// Exportar los controladores
module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
};
