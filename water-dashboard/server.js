import express from "express";
import nodemailer from "nodemailer";

const app = express();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "process.env.EMAIL_USER",
    pass: "process.env.EMAIL_PASS",
  },
});

app.get("/send-alert", async (req, res) => {
  try {
    await transporter.sendMail({
      from: "11bpriyadharshini@gmail.com",
      to: "priyadharshinik2203@gmail.com",
      subject: "Water Usage Alert",
      text: "Alert! Daily water usage exceeded 1 Liter.",
    });

    res.send("Email Sent Successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});