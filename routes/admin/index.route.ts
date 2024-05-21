import { Express } from "express";
import { dashboardRoutes } from "./dashboard.route";
import { systemConfig } from "../../config/config";
import { topicRoutes } from "../admin/topic.route";
import { songRoutes } from "../admin/song.route";

const adminRoutes = (app: Express): void => {
    
    const PATH_ADMIN = `/${systemConfig.prefixAdmin}`;

    app.use(`${PATH_ADMIN}/dashboard`, dashboardRoutes);
    
    app.use(`${PATH_ADMIN}/topics`, topicRoutes);

    app.use(`${PATH_ADMIN}/songs`, songRoutes);

};

export default adminRoutes;