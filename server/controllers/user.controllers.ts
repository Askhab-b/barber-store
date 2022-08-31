import { Request, Response } from "express";

import sanitize from "mongo-sanitize";
import { validateEmail, validateRegisterInput } from "@validations/user.validation";

import UserService from "@services/user.service";
import TokenService from "@services/token.service";
import LoggerService from "@services/logger.service";
import EmailService from "@services/email.service";

// Необходимо определить адрес электронной почты, 
// по которому будут отправляться электронные 
// письма пользователям.

export const getUser = (req: Request, res: Response) => {
  const user = req.user;

  res.status(200).send({ message: "Информация о пользователе успешно получена", user });
};

export const postUser = async (req: Request, res: Response) => {
  // Тут идёт проверка на валидность данных
  const { error } = validateRegisterInput(req.body);
  
  if (error) return res.status(400).send({ message: error.details[0].message });

  let sanitizedInput = sanitize<{ username: string; password: string; email: string }>(req.body);

  try {
    let user = await UserService.findUserBy("username", sanitizedInput.username.toLowerCase());

    if (user) {
      return res.status(400).send({ message: "Имя пользователя уже занято. Выберите другое имя пользователя" });
    }

    user = await UserService.findUserBy("email", sanitizedInput.email.toLowerCase());

    if (user) {
      return res.status(400).send({ message: "Электронная почта уже зарегистрирована. Выбери другую электронную почту" });
    }

    const newUser = UserService.createUser(sanitizedInput);
    await UserService.setUserPassword(newUser, newUser.password);
    try {
      await UserService.saveUser(newUser);
      const verificationToken = TokenService.createToken();
      TokenService.setUserId(verificationToken, newUser._id);
      TokenService.saveToken(verificationToken);
      const verificationEmail = EmailService.createVerificationEmail(
        newUser.email,
        verificationToken.token
      );
      try {
        EmailService.sendEmail(verificationEmail);

        return res.status(200).send({ message: "Было отправлено письмо с подтверждением." });
      } catch (error) {
        UserService.deleteUserById(newUser._id);

        return res.status(503).send({
          message: `Невозможно отправить электронное письмо на ${newUser.email}, попробуйте позже. Наш сервис может быть отключен.`,
        });
      }
    } catch (error) {
      LoggerService.log.error(error);

      return res.status(500).send({ message: "Creation of user failed, попробуйте позже." });
    }
  } catch (error) {
    LoggerService.log.error(error);

    return res.status(500).send("Произошла непредвиденная ошибка");
  }
};

export const postUserCancel = (req: Request, res: Response) => {
   // Тут идёт проверка на валидность данных
  const { error } = validateEmail(req.body);
  
  if (error) return res.status(400).send({ message: error.details[0].message });

  const sanitizedInputs = sanitize<{ email: string }>(req.body);

  try {
    UserService.deleteUnverifiedUserByEmail(sanitizedInputs.email);
    return res.status(200).send({ message: "Успешный сброс пользователя" });
  } catch (error) {
    return res.status(500).send("Произошла непредвиденная ошибка");
  }
};

export default {
  getUser,
  postUser,
  postUserCancel,
};
