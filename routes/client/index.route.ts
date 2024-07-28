import { Express } from "express";

import * as settingMiddleware from "../../middlewares/client/setting.middleware";
import * as authMiddleware from "../../middlewares/client/auth.middleware";
import * as userMiddleware from "../../middlewares/client/user.middleware";

import { topicRouters } from "./topic.route";
import { userRouters } from "./user.route";
import { songRouters } from "./song.route";
import { favoriteSongRoutes } from "./favorite-song.route";
import { searchRoutes } from "./search.route";

const clientRoutes = (app: Express): void => {

    app.use(settingMiddleware.settingGeneral);

    app.use(userMiddleware.infoUser);

    app.use("/topics", topicRouters);

    app.use("/songs", songRouters);

    app.use("/user", userRouters);

    app.use("/favorite-songs", favoriteSongRoutes);

    app.use("/search", searchRoutes);

};

export default clientRoutes;