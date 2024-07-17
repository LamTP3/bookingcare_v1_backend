const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Allcode, {
        foreignKey: "positionId",
        targetKey: "keyMap",
        as: "positionData",
      });

      User.belongsTo(models.Allcode, {
        foreignKey: "gender",
        targetKey: "keyMap",
        as: "genderData",
      });

      User.hasOne(models.Markdown, {
        foreignKey: "doctorId",
      });

      User.hasOne(models.Doctor_Infor, {
        foreignKey: "doctorId",
      });

      // Mối quan hệ một nhiều với bảng Schedule
      // 1 doctor sẽ có nhiều lịch khám (schedule)
      // tuy nhiên cùng là lịch khám ấy sẽ chỉ có một ứng với 1 doctor thôi
      User.hasMany(models.Schedule, {
        foreignKey: "doctorId",
        as: "doctorData",
      });

      // đừng để bị nhầm lần ở đây
      // 1 User chỉ dc đặt 1 Booking
      // 1 Booking có thể có Nhiều User
      // lên  kết nối quan hệ phải là Booking.hasMany(User), User.belongsTo(Booking)
      // mà trường hợp của ta ở đây là
      // phải dựa theo doctorId mới đúng.
      // 1 doctor có thể có nhiều bệnh nhận đặt trong bảng Booking,
      // Mỗi 1 lần đặt Booking chỉ có thể có 1 bác sĩ dc đặt. Nên trong case này phải là User.hasMany(Booking), Booking.belongsTo(User)

      User.hasMany(models.Booking, {
        foreignKey: "patientId",
        as: "patientData",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      address: DataTypes.STRING,
      phonenumber: DataTypes.STRING,
      gender: DataTypes.STRING,
      image: DataTypes.STRING,
      roleId: DataTypes.STRING,
      positionId: DataTypes.STRING,
      patient: DataTypes.STRING,
      reason: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
