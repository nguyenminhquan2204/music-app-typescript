import { Router } from "express";
import multer from "multer";
const router: Router = Router();

import * as controller from "../../controllers/admin/song.controller";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";

const upload = multer();

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
    "/create", 
    // upload.single("avatar"), 
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "audio", maxCount: 1 },
    ]),
    uploadCloud.uploadFields,
    controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id", 
    // upload.single("avatar"), 
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "audio", maxCount: 1 },
    ]),
    uploadCloud.uploadFields,
    controller.editPatch
);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.get("/detail/:id", controller.detail);

router.delete("/delete/:id", controller.deleteItem);

router.patch("/change-multi", controller.changeMulti);

export const songRoutes: Router = router;