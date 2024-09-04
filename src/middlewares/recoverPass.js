const recoveryPassMsg = async (token, userEmail) => {
    try {
      const info = await transporter.sendMail({
        from: `"Recovery Password" <${process.env.NODEMAILER_USER}>`, // sender address
        to: `${userEmail}`, // list of receivers
        subject: "Password recovery", // Subject line
        html: `
        <b>Press on this link to recover your password</b>
        <button>Haz click <a href='${process.env.URL_FRONT}/api/users/changePass/${token}'>aqui</a></button>
        `, // html body
      });
  
      if (info.response.includes("OK")) {
        return 200;
      }
    } catch (error) {
      return 500;
    }
  };

  module.exports = recoveryPassMsg;
  