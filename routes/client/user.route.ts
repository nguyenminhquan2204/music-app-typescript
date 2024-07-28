import { Router } from "express";
import  multer from "multer";

const router: Router = Router();
const upload = multer();
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";

import * as controller from "../../controllers/client/user.controller";

router.get("/register", controller.register);

router.post("/register", controller.registerPost);

router.get("/login", controller.login);

router.post("/login", controller.loginPost);

router.get("/logout", controller.logout);

router.get("/password/forgot", controller.forgot);

router.post("/password/forgot", controller.forgotPost);

router.get("/password/otp", controller.otpPassword);

router.post("/password/otp", controller.otpPasswordPost);

router.get("/password/reset", controller.resetPassword);

router.post("/password/reset", controller.resetPasswordPost);

router.get("/info/:id", controller.userInfo);

router.get("/editInfo/:id", controller.editInfo);

router.patch(
    "/editInfo/:id", 
    upload.single("avatar"),
    uploadCloud.uploadSingle,
    controller.editInfoPatch
);

export const userRouters: Router = router;