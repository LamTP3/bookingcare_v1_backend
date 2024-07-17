import patientService from "../services/patientService";

let postBookAppointment = async (req, res) => {
  try {
    let data = await patientService.postBookAppointmentService(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server...",
    });
  }
};

let VerifyBookAppointment = async (req, res) => {
  try {
    let data = await patientService.VerifyBookAppointmentService(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server...",
    });
  }
};
module.exports = {
  postBookAppointment,
  VerifyBookAppointment,
};
