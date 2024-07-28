import { Router } from "express";
import  multer from "multer";

const router: Router = Router();
const upload = multer();
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";

import * as controller from "../../controllers/admin/users.controller";

router.get("/", controller.index);

router.patch("/change-multi", controller.changeMulti);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.get("/detail/:id", controller.detail);

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id", 
    upload.single("avatar"),
    uploadCloud.uploadSingle,
    controller.editPatch
);

router.delete("/delete/:id", controller.deleteUser);

router.get("/create", controller.create);

router.post(
    "/create", 
    upload.single("avatar"),
    uploadCloud.uploadSingle,
    controller.createPost
);

export const usersRoutes: Router = router;