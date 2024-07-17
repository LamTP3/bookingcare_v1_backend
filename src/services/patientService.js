import { where } from "sequelize";
import db from "../models/index";
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";
import { first } from "lodash";
require("dotenv").config();

let buildUrlEmail = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
  return result;
};

let postBookAppointmentService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.timeType ||
        !data.date ||
        !data.doctorId ||
        !data.fullName ||
        !data.address ||
        !data.gender
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let token = uuidv4();
        await emailService.sendSimpleEmail({
          reciverEmail: data.email,
          patientName: data.fullName,
          time: data.timeString,
          doctorName: data.doctorName,
          language: data.language,
          redirectLink: buildUrlEmail(data.doctorId, token),
        });
        // Upsert patient
        let [user, created] = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3",
            firstName: data.fullName,
            patient: data.person,
            gender: data.gender,
            reason: data.reason,
            address: data.address,
            phonenumber: data.phoneNumber,
          },
        });

        if (user) {
          // Create a booking record
          let [booking, success] = await db.Booking.findOrCreate({
            where: {
              statusId: "S1",
              patientId: user.id,
              date: data.date,
              timeType: data.timeType,
            },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              patientId: user.id,
              date: data.date,
              timeType: data.timeType,
              token: token,
            },
          });
          if (success === true) {
            resolve({
              errCode: 0,
              errMessage: "Success booking",
            });
          } else {
            resolve({
              errCode: 1,
              errMessage:
                "You have an appointment for this time, please check email to clear",
            });
          }
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

let VerifyBookAppointmentService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: { doctorId: data.doctorId, token: data.token, statusId: "S1" },
          // để raw = false thì mới dùng được update
          raw: false,
        });
        if (appointment) {
          appointment.statusId = "S2";
          await appointment.save();
          resolve({
            errCode: 0,
            errMessage: "Update the appointment succeed",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Appointment has been actived or does not exist",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  postBookAppointmentService,
  VerifyBookAppointmentService,
};
