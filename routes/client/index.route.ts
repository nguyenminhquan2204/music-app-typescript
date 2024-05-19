import { Express } from "express";
import { topicRouters } from "./topic.route";
import { songRouters } from "./song.route";
import { favoriteSongRoutes } from "./favorite-song.route";
import { searchRoutes } from "./search.route";

const clientRoutes = (app: Express): void => {

    app.use("/topics", topicRouters);

    app.use("/songs", songRouters);

    app.use("/favorite-songs", favoriteSongRoutes);

    app.use("/search", searchRoutes);

};

export default clientRoutes;