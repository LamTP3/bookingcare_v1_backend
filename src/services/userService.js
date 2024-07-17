import db from "../models/index";
import bcrypt from "bcrypt";
const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkUserEmail(data.email);
      if (check) {
        resolve({
          errCode: 1,
          message: "Your email is already in used. Please try another email",
        });
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phonenumber: data.phonenumber,
          gender: data.gender,
          roleId: data.roleId,
          positionId: data.positionId,
          image: data.image,
        });
        resolve({
          errCode: 0,
          message: "Success",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        //user already exist
        //compare password
        let user = await db.User.findOne({
          attributes: [
            "id",
            "email",
            "roleId",
            "password",
            "firstName",
            "lastName",
          ], // chỉ lấy bằng này thuộc tính
          where: { email: email },
          // raw: true,
        });

        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
          userData.errCode = 0;
          userData.errMessage = "Login success";
          // const { password, ...others } = user.toJSON(); // với sequelize thì sử dụng cách nay
          //const { password, ...others } = user._doc // với mongoose thì sử dụng cách nay
          // userData.user = others;
          delete user.password;
          userData.user = user;
        } else {
          userData.errCode = 3;
          userData.errMessage = "Wrong password";
        }
      } else {
        userData.errCode = 1;
        userData.errMessage =
          "Your's Email is not exist in the system.Please try other email";
      }
      resolve(userData);
    } catch (error) {
      reject(error);
    }
  });
};

let checkUserEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: email },
      });
      if (user) {
        return resolve(true);
      } else {
        return resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllUsers = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (id === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }

      if (id && id !== "ALL") {
        users = await db.User.findOne({
          attributes: {
            exclude: ["password"],
          },
          where: { id: id },
        });
      }
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

let deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: id },
      });
      if (!user) {
        resolve({
          errCode: 2,
          errMessage: `User isn't exist in the system`,
        });
      } else {
        //cách dưới có thể dùng nếu trong config.json bỏ  "raw": true
        //bởi việc config "raw": true khiến kết quả trả về không chuẩn kiểu của sequelize
        //việc dùng thẳng user.destroy chỉ dùng được khi user đúng kiểu trong sequelize
        // await user.destroy();
        await db.User.destroy({
          where: { id: id },
        });
        resolve({
          errCode: 0,
          errMessage: `The user is deleted successfully`,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: `Missing required parameters`,
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.gender = data.gender;
        user.roleId = data.roleId;
        user.positionId = data.positionId;
        user.phonenumber = data.phonenumber;
        user.image = data.image;

        await user.save();
        resolve({
          errCode: 0,
          message: "Update the user succeeds!",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: `User not found!`,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllCodeService = (type) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!type) {
        let data = await db.Allcode.findAll();
        resolve({
          errCode: 0,
          data: data,
        });
      } else {
        let data = await db.Allcode.findAll({
          where: { type: type },
        });
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleUserLogin: handleUserLogin,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  updateUserData: updateUserData,
  getAllCodeService: getAllCodeService,
};
