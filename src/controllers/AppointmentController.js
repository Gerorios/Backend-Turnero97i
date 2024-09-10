const express = require("express");
const AppointmentModel = require("../models/AppointmentSchema");

// Obtener todas las citas (appointments)
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find()
      .populate("user", "name last_name email")
      .populate("tipoEstudio", "name")
      .populate("medico", "name last_name email");

    console.log("Appointments fetched:", appointments);

    res.status(200).json({ msg: "All appointments", appointments: appointments });
  } catch (error) {
    console.log("Error fetching appointments:", error);
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
    console.log(req.body); // Agrega este console.log para ver qué datos están llegando

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

// Exportar los controladores
module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
