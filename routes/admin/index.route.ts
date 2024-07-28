import { Express } from "express";

import { dashboardRoutes } from "./dashboard.route";
import { systemConfig } from "../../config/config";
import { topicRoutes } from "../admin/topic.route";
import { songRoutes } from "../admin/song.route";
import { singerRoutes } from "../admin/singer.route";
import { accountRoutes } from "../admin/account.route";
import { roleRoutes } from "../admin/role.route";
import { authRoutes } from "../admin/auth.route";
import { uploadRoutes } from "./upload.route";
import { settingRoutes } from "../admin/setting.route";
import { usersRoutes } from "../admin/users.route";


import * as authMiddleware from "../../middlewares/admin/auth.middleware";

const adminRoutes = (app: Express): void => {
    
    const PATH_ADMIN = `/${systemConfig.prefixAdmin}`;

    app.use(
        `${PATH_ADMIN}/dashboard`, 
        authMiddleware.requireAuth,
        dashboardRoutes
    );
    
    app.use(
        `${PATH_ADMIN}/topics`, 
        authMiddleware.requireAuth,
        topicRoutes
    );

    app.use(
        `${PATH_ADMIN}/songs`,
        authMiddleware.requireAuth,
        songRoutes
    );

    app.use(
        `${PATH_ADMIN}/singers`, 
        authMiddleware.requireAuth,
        singerRoutes
    );

    app.use(
        `${PATH_ADMIN}/accounts`, 
        authMiddleware.requireAuth,
        accountRoutes
    );

    app.use(
        `${PATH_ADMIN}/roles`,
        authMiddleware.requireAuth,
        roleRoutes
    );

    app.use(
        `${PATH_ADMIN}/settings`,
        authMiddleware.requireAuth,
        settingRoutes
    );

    app.use(
        `${PATH_ADMIN}/users`, 
        authMiddleware.requireAuth,
        usersRoutes
    );

    app.use(
        `${PATH_ADMIN}/auth`,
        authRoutes
    );


    app.use(`${PATH_ADMIN}/upload`, uploadRoutes);

};

export default adminRoutes;