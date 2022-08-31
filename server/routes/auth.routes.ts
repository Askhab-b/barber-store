import express from "express";

import AuthControllers from "@controllers/auth.controllers";

const router = express.Router();

//  Input : username/password через body
//  HTTP Success : 200, сообщение и информация о пользователе.
//  HTTP Errors : 400, 401.
router.post("/login", AuthControllers.postLogin);

//  Input : email через body.
//  HTTP Success : 200 и сообщение.
//  HTTP Errors : 400, 404, 500, 503.
router.post("/login/forgot", AuthControllers.postLoginForgot);

//  Input : reset token через params, new password через body.
//  HTTP Success : 200 и сообщение.
//  HTTP Errors : 400, 404, 500, 503.
router.post("/login/reset/:token", AuthControllers.postLoginReset);

//  Input : void, идентифицируется файлом cookie.
//  HTTP Success : 200 и сообщение.
//  HTTP Errors : 400, 500, 503.
router.post("/logout", AuthControllers.postLogout);

//  Input : email через body;
//  HTTP Success : 200 и сообщение.
//  HTTP Errors : 400, 404, 500, 503.
router.post("/send-confirmation", AuthControllers.postVerify);

router.get("/confirmation/:token", AuthControllers.getConfirmation);

export default router;
