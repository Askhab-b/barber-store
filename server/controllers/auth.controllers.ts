import { Request, Response, NextFunction } from "express";
import sanitize from "mongo-sanitize";
import passport from "passport";
import { validateEmail, validateLoginInput, validatePassword } from "@validations/user.validation";

import dayjs from "dayjs";

import { UserDocument } from "@models/user.model";
import UserService from "@services/user.service";
import TokenService from "@services/token.service";
import LoggerService from "@services/logger.service";
import EmailService from "@services/email.service";

export const postLogin = (req: Request, res: Response, next: NextFunction) => {
   // Тут идёт проверка на валидность данных
  const { error } = validateLoginInput(req.body);

  if (error) return res.status(400).send({ message: error.details[0].message });

  let sanitizedInput = sanitize<{ username: string; password: string }>(req.body);

  sanitizedInput.username = req.body.username.toLowerCase();

  passport.authenticate("local", (err: Error, user: UserDocument, info) => {
    if (err) {
      return next(err);
    }
    if (info && info.message === "Отсутствуют учетные данные") {
      return res.status(400).send({ message: "Отсутствуют учетные данные" });
    }
    if (!user) {
      return res.status(400).send({ message: "Неверный адрес электронной почты или пароль." });
    }
    if (!user.isVerified)
      return res.status(401).send({
        message: "Ваша учетная запись не была подтверждена. Пожалуйста, активируйте свою учетную запись.",
      });

    req.login(user, (err: Error) => {
      if (err) {
        res.status(401).send({ message: "Ошибка проверки подлинности", err });
      }
      res.status(200).send({ message: "Успешный вход в систему", user: UserService.getUser(user) });
    });
  })(req, res, next);
};

export const postLoginForgot = async (req: Request, res: Response) => {
   // Тут идёт проверка на валидность данных
  const { error } = validateEmail(req.body);

  if (error) return res.status(400).send({ message: error.details[0].message });

  const sanitizedInput = sanitize<{ email: string }>(req.body);

  try {
    const user = await UserService.findUserBy("email", sanitizedInput.email);
    if (!user) return res.status(404).send({ message: "Пользователь с этим адресом электронной почты не найден." });

    const resetToken = TokenService.createToken();
    const tokenExpiryDate = dayjs().add(12, "hours").toDate();

    TokenService.setUserId(resetToken, user.id);
    UserService.setResetPasswordToken(user, resetToken.token, tokenExpiryDate);

    await UserService.saveUser(user);
    await TokenService.saveToken(resetToken);

    try {
      const email = EmailService.createResetPasswordEmail(user.email, resetToken.token);
      await EmailService.sendEmail(email);

      return res
        .status(200)
        .send({ message: `Электронное письмо для сброса пароля было отправлено на ${user.email}` });
    } catch (error) {
      LoggerService.log.error(error);

      return res.status(503).send({
        message: `Невозможно отправить электронное письмо на ${user.email}, попробуйте позже. Наш сервис может быть отключен.`,
      });
    }
  } catch (error) {
    LoggerService.log.error(error);

    return res.status(500).send({ message: "Произошла непредвиденная ошибка" });
  }
};

export const postLoginReset = async (req: Request, res: Response) => {
   // Тут идёт проверка на валидность данных
  const { error } = validatePassword(req.body);

  if (error) return res.status(400).send({ message: error.details[0].message });
  const sanitizedInput = sanitize<{ password: string }>(req.body);

  try {
    const token = await TokenService.findTokenBy("token", req.params["token"]);

    if (!token) {
      return res.status(404).send({
        message: "Этот токен недействителен. Возможно, срок действия вашего токена истек.",
      });
    }

    const user = await UserService.findUserById(token._userId);

    if (!user) {
      return res.status(404).send({ message: `Нам не удалось найти пользователя c этим токеном.` });
    }

    if (user.passwordResetToken !== token.token)
      return res.status(400).send({
        message:
          "Пользовательский токен и ваш токен не совпадают. Возможно, на вашей электронной почте есть более свежий токен.",
      });

    // Проверяем, что дата истечения срока действия 
    // пользовательского токена не была передана
 
    if (dayjs().toDate() > user.passwordResetExpires) {
      return res.status(400).send({
        message:
          "Вы не можете сбросить свой пароль. Срок действия токена сброса истек. Пожалуйста, пройдите через форму сброса еще раз.",
      });
    }
    // Обновляем пользователя
    await UserService.setUserPassword(user, sanitizedInput.password);
    await UserService.saveUser(user);

    try {
      const email = EmailService.createResetConfirmationEmail(user.email);
      await EmailService.sendEmail(email);
      return res.status(200).send({ message: "Пароль был успешно изменен." });
    } catch (error) {
      LoggerService.log.error(error);

      return res.status(503).send({
        message: `Невозможно отправить электронное письмо на ${user.email}, попробуйте позже. Наш сервис может быть отключен.`,
      });
    }
  } catch (error) {
    LoggerService.log.error(error);

    return res.status(500).send("Произошла непредвиденная ошибка");
  }
};

export const postLogout = (req: Request, res: Response) => {
  req.session.destroy((err: Error) => {
    if (err) {
      res.status(500).send({ message: "Сбой при выходе из аккаунта", err });
    }
    req.sessionID = "";
    // req.logout(); :todo не работает
    res.status(200).send({ message: "Успешный выход из аккаунта" });
  });
};

export const postVerify = async (req: Request, res: Response) => {
   // Тут идёт проверка на валидность данных
  const { error } = validateEmail(req.body);

  if (error) return res.status(400).send({ message: error.details[0].message });

  const sanitizedInput = sanitize<{ email: string }>(req.body);

  try {
    const user = await UserService.findUserBy("email", sanitizedInput.email);
    if (!user) {
      return res.status(404).send({ message: "Пользователь с этим адресом электронной почты не найден." });
    }
    if (user.isVerified) {
      return res.status(400).send({
        message: "Эта учетная запись уже была верифицирована. Пожалуйста, войдите в систему.",
      });
    }

    const verificationToken = TokenService.createToken();
    TokenService.setUserId(verificationToken, user.id);

    await TokenService.saveToken(verificationToken);
    try {
      const email = EmailService.createVerificationEmail(user.email, verificationToken.token);
      await EmailService.sendEmail(email);

      return res.status(200).send({ message: `Было отправлено электронное письмо с подтверждением.` });
    } catch (error) {
      LoggerService.log.error(error);

      return res.status(503).send({
        message: `Невозможно отправить электронное письмо на ${user.email}, попробуйте позже. Наш сервис может быть отключен.`,
      });
    }
  } catch (error) {
    LoggerService.log.error(error);

    return res.status(500).send("Произошла непредвиденная ошибка");
  }
};

export const getConfirmation = async (req: Request, res: Response) => {
  try {
    const token = await TokenService.findTokenBy("token", req.params.token);

    if (!token) {
      return res.status(404).send({
        message: "Нам не удалось найти действительный токен. Возможно, срок действия вашего токена истек.",
      });
    }

    const user = await UserService.findUserById(token._userId);

    if (!user) {
      return res.status(404).send({ message: `Нам не удалось найти пользователя для этого токена.` });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .send({ message: "Этот пользователь уже прошел верификацию. Пожалуйста, войдите в систему." });
    }

    UserService.setUserVerified(user);
    await UserService.saveUser(user);

    return res.status(200).send({ message: "Учетная запись была подтверждена. Пожалуйста, войдите в систему." });
  } catch (error) {
    LoggerService.log.error(error);

    return res.status(500).send("Произошла непредвиденная ошибка");
  }
};

export default {
  postLogin,
  postLoginReset,
  postLogout,
  postVerify,
  getConfirmation,
  postLoginForgot,
};
