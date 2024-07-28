"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_route_1 = require("./dashboard.route");
const config_1 = require("../../config/config");
const topic_route_1 = require("../admin/topic.route");
const song_route_1 = require("../admin/song.route");
const singer_route_1 = require("../admin/singer.route");
const account_route_1 = require("../admin/account.route");
const role_route_1 = require("../admin/role.route");
const auth_route_1 = require("../admin/auth.route");
const upload_route_1 = require("./upload.route");
const setting_route_1 = require("../admin/setting.route");
const users_route_1 = require("../admin/users.route");
const authMiddleware = __importStar(require("../../middlewares/admin/auth.middleware"));
const adminRoutes = (app) => {
    const PATH_ADMIN = `/${config_1.systemConfig.prefixAdmin}`;
    app.use(`${PATH_ADMIN}/dashboard`, authMiddleware.requireAuth, dashboard_route_1.dashboardRoutes);
    app.use(`${PATH_ADMIN}/topics`, authMiddleware.requireAuth, topic_route_1.topicRoutes);
    app.use(`${PATH_ADMIN}/songs`, authMiddleware.requireAuth, song_route_1.songRoutes);
    app.use(`${PATH_ADMIN}/singers`, authMiddleware.requireAuth, singer_route_1.singerRoutes);
    app.use(`${PATH_ADMIN}/accounts`, authMiddleware.requireAuth, account_route_1.accountRoutes);
    app.use(`${PATH_ADMIN}/roles`, authMiddleware.requireAuth, role_route_1.roleRoutes);
    app.use(`${PATH_ADMIN}/settings`, authMiddleware.requireAuth, setting_route_1.settingRoutes);
    app.use(`${PATH_ADMIN}/users`, authMiddleware.requireAuth, users_route_1.usersRoutes);
    app.use(`${PATH_ADMIN}/auth`, auth_route_1.authRoutes);
    app.use(`${PATH_ADMIN}/upload`, upload_route_1.uploadRoutes);
};
exports.default = adminRoutes;
