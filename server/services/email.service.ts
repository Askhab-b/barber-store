import sgMail from "@sendgrid/mail";
import 'dotenv/config'

const host = process.env.HOST;
const sendingEmail = process.env.SENDING_EMAIL;

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const createResetPasswordEmail = (
  receiverEmail: string,
  resetTokenValue: string
): sgMail.MailDataRequired => {
  const email: sgMail.MailDataRequired = {
    to: receiverEmail,
    from: `${sendingEmail}`,
    subject: "Ссылка для сброса пароля",
    text: "Какой-то текст",
    html: `<p>Для сброса пароля перейдите по ссылке \n\n
  <a href="http://${host}/login/reset/${resetTokenValue}">http://${host}/login/reset/${resetTokenValue}</a> \n\n Если вы не запрашивали сброс пароля, пожалуйста, проигнорируйте это электронное письмо, и ваш пароль останется неизменным.\n </p>`,
  };

  return email;
};

export const createResetConfirmationEmail = (receiverEmail: string): sgMail.MailDataRequired => {
  const email: sgMail.MailDataRequired = {
    to: receiverEmail,
    from: `${sendingEmail}`,
    subject: "Ваш пароль был изменён",
    text: "Какой-то текст",
    html: `<p>Это подтверждение того, что пароль для вашей учетной записи ${receiverEmail} был изменён. </p>`,
  };

  return email;
};

export const createVerificationEmail = (
  receiverEmail: string,
  verificationTokenValue: string
): sgMail.MailDataRequired => {
  const email = {
    to: receiverEmail,
    from: `${sendingEmail}`,
    subject: "Подтверждение аккаунта",
    text: "Какой-то текст",
    html: `<p>Пожалуйста, подтвердите свою учетную запись, перейдя по ссылке: 
  <a href="http://${host}/account/confirm/${verificationTokenValue}">http://${host}/account/confirm/${verificationTokenValue}</a> </p>`,
  };

  return email;
};

export const sendEmail = async (email: sgMail.MailDataRequired) => sgMail.send(email);

export default {
  createResetPasswordEmail,
  createResetConfirmationEmail,
  createVerificationEmail,
  sendEmail,
};
