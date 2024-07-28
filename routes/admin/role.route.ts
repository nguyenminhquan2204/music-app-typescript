import { Router } from "express";
const router: Router = Router();
import multer from "multer";

const upload = multer();

import * as controller from "../../controllers/admin/role.controller";

import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
import * as validate from "../../validates/admin/topic.validate";

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create", controller.createPost);

router.get("/detail/:id", controller.detail);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id", controller.editPatch);

router.delete("/delete/:id", controller.deleteItem);

router.get("/permissions", controller.permissions);

router.patch("/permissions", controller.permissionsPatch);

export const roleRoutes: Router = router;