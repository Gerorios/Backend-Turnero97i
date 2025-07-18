const express = require("express");
const AppointmentModel = require("../models/AppointmentSchema");

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find()
      .populate("user", "name last_name email phone_number")  
      .populate("medico", "name last_name email")  
      .populate("tipoEstudio", "name");  

    res.status(200).json({ msg: "All appointments", appointments: appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ msg: "Error: Server", error });
  }
};


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


const createAppointment = async (req, res) => {
  try {
    console.log(req.body); 

    const newAppointment = new AppointmentModel(req.body);
    await newAppointment.save();

    res.status(201).json({ msg: "Appointment created successfully", newAppointment });
  } catch (error) {
    console.log(error); 
    res.status(500).json({ msg: "Error: Server", error });
  }
};



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


const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; 

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

const getMyAppointments = async (req, res) => {
  try {
    const userId = req.idUser;              
    const appointments = await AppointmentModel.find({ user: userId })
      .populate("tipoEstudio", "name")
      .populate("medico", "name last_name");
    return res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error fetching my appointments:", error);
    return res.status(500).json({ msg: "Error: Server", error });
  }
};
const getAppointmentsByMedico = async (req, res) => {
  try {
    const medicoId = req.idUser;    
    const appointments = await AppointmentModel.find({ medico: medicoId })
      .populate("user", "name last_name email phone_number")
      .populate("tipoEstudio", "name");
    return res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments for medico:", error);
    return res.status(500).json({ msg: "Error: Server", error });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
  getMyAppointments,
  getAppointmentsByMedico
};
