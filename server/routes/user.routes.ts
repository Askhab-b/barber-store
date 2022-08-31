import { Router } from "express";
import UserController from "@controllers/user.controllers";

const router = Router();

router.get("/", UserController.getUser);

//  Input : username, email, password через body;
//  HTTP Success : 200 и сообщение.
//  HTTP Errors : 400,500.
router.post("/register", UserController.postUser);

// Удалить пользователя с электронной почты, если оно не подтверждено
//  Input : email через body;
//  HTTP Success : 200 и сообщение.
//  HTTP Errors : 400, 404, 500.
router.post("/register/cancel", UserController.postUserCancel);

export default router;
