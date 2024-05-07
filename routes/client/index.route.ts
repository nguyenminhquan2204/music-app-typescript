import { Express } from "express";
import { topicRouters } from "./topic.route";

const clientRoutes = (app: Express): void => {

    app.use("/topics", topicRouters);

};

export default clientRoutes;