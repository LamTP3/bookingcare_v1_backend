import db from "../models/index";

let createClinicService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.address ||
        !data.descriptionMarkdown ||
        !data.imageBase64 ||
        !data.descriptionHTML
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        await db.Clinic.create({
          name: data.name,
          address: data.address,
          image: data.imageBase64,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
        });
        resolve({
          errCode: 0,
          errMessage: "Create Specialty Success",
        });
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

let getAllClinicService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findAll();
      resolve({
        errMessage: "Get Clinic Success",
        errCode: 0,
        data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getDetailClinicByIdService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let data = await db.Clinic.findOne({
          where: {
            id: id,
          },
          attributes: ["descriptionHTML", "descriptionMarkdown"],
        });
        if (data) {
          let doctorClinic = await db.Doctor_Infor.findAll({
            where: {
              clinicId: id,
            },
            attributes: ["doctorId", "clinicId"],
          });
          data.doctorClinic = doctorClinic;

          resolve({
            errMessage: "Get Clinic Detail Success",
            errCode: 0,
            data,
          });
        } else {
          resolve({
            errMessage: "Don't have clinic data",
            errCode: 0,
            data,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createClinicService,
  getAllClinicService,
  getDetailClinicByIdService,
};
