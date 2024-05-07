import { Express } from "express";
import { topicRouters } from "./topic.route";
import { songRouters } from "./song.route";

const clientRoutes = (app: Express): void => {

    app.use("/topics", topicRouters);

    app.use("/songs", songRouters);
};

export default clientRoutes;