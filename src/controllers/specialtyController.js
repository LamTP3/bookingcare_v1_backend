import specialtyService from "../services/specialtyService";
// để ý kĩ nếu bỏ import đi thì module.exports có màu xanh
// chứ không phải trắng đồng thời ở bên file web hên hàm bất kì
// createSpecialty hiện màu xanh lá và ấn được xác file này
// còn nếu để import như trên thì bên file web tên function
// màu trắng và khi bấm vào tên function không được
let createSpecialty = async (req, res) => {
  try {
    let data = await specialtyService.createSpecialtyService(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server...",
    });
  }
};

let getSpecialty = async (req, res) => {
  try {
    let data = await specialtyService.getSpecialtyService();
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server...",
    });
  }
};

let getDetailSpecialtyById = async (req, res) => {
  try {
    let data = await specialtyService.getDetailSpecialtyByIdService(
      req.query.id,
      req.query.location
    );
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
  createSpecialty,
  getSpecialty,
  getDetailSpecialtyById,
};
