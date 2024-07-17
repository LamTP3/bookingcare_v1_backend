require(`dotenv`).config();
import nodemailer from "nodemailer";
let sendSimpleEmail = async (dataSend) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: '"Phuc Lam Tran 👻" <lamtp2810@gmail.com>',
    to: dataSend.reciverEmail,
    subject: "Thông tin đặt lịch khám bệnh",
    html: getBodyHTMLEmail(dataSend),
  });
};

let getBodyHTMLEmail = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
    <h3> Xin chào ${dataSend.patientName} </h3>
    <p> Bạn nhận được email này vì đã đặt lịch khám 
    bệnh online trên Booking Care </p>
    <p> Thông tin đặt lịch khám bệnh: </p>
    <div>
        <b>
            Thời gian: ${dataSend.time}
        </b>
    </div>
    <div>
        <b>
        Bác sĩ: ${dataSend.doctorName}
        </b>
    </div>
    <p> Nếu các thông tin trên là đúng sự thật, vui lòng click 
    vào đường link dưới để xác nhận và hoàn tất thủ tục khám bệnh </p>
    <div>
        <a href= ${dataSend.redirectLink} target="_blank"> Click Here </a>
    <div>
    <div>
        Xin chân thành cảm ơn
    </div>

    `;
  }
  if (dataSend.language === "en") {
    result = `
    <h3> Hello ${dataSend.patientName} </h3>
    <p> You are receiving this email because you have scheduled an appointment
    online medical on Booking Care </p>
    <p> Information for scheduling medical examination: </p>
    <div>
      <b>
        Time: ${dataSend.time}
      </b>
    </div>
    <div>
      <b>
        Doctor: ${dataSend.doctorName}
      </b>
    </div>
    <p> If the above information is true, please click
    Click on the link below to confirm and complete medical examination procedures </p>
    <div>
      <a href= ${dataSend.redirectLink} target="_blank"> Click Here </a>
    <div>
    <div>
      Sincerely thank
    </div>

`;
  }

  return result;
};

let getBodyHTMLEmailRemedy = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
    <h3> Xin chào ${dataSend.patientName}!</h3>
    <p> Bạn nhận được email này vì đã đặt lịch khám 
    bệnh online trên Booking Care thành công </p>
    <p> Thông tin đơn thuốc/hóa đơn được gửi trong file đính kém: </p>
    <div>
        Xin chân thành cảm ơn
    </div>

    `;
  }
  if (dataSend.language === "en") {
    result = `
      <h3> Hello ${dataSend.patientName} </h3>
      <p> You are receiving this email because you have scheduled an appointment
      online medical on Booking Care </p>
      <p>
        Prescription/invoice information is sent in the attached file: 
      </p>

    <div>
      Sincerely thank
    </div>

`;
  }

  return result;
};
// attachments: tệp tên đính kèm
let sendAttachments = async (dataSend) => {
  //test rồi không thấy dùng Promise như dưới và không dùng
  //code vẫn chạy như thường
  // return new Promise(async (resolve, reject) => {
  //   try {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: '"Phuc Lam Tran 👻" <lamtp2810@gmail.com>',
    to: dataSend.email,
    subject: "Kết quả đặt lịch khám bệnh",
    html: getBodyHTMLEmailRemedy(dataSend),
    attachments: [
      {
        filename: "text1.jpg",
        content: dataSend.imgBase64.split("base64,")[1],
        encoding: "base64",
      },
    ],
  });
  //     resolve("");
  //   } catch (error) {
  //     reject(error);
  //   }
  // });
};
module.exports = {
  sendSimpleEmail,
  sendAttachments,
};
