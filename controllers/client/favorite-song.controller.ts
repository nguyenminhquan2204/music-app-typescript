import { Request, Response } from "express";
import FavoriteSong from "../../models/favorite-song.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";

// [GET] /favorite-songs
export const index = async (req: Request, res: Response) => {
    const favoriteSongs = await FavoriteSong.find({
        deleted: false,
        // userId: "",
    });

    for(const song of favoriteSongs) {
        const infoSong = await Song.findOne({
            _id: song["songId"]
        });

        const infoSinger = await Singer.findOne({
            _id: infoSong.singerId
        });

        song["infoSong"] = infoSong;
        song["infoSinger"] = infoSinger;
    }

    res.render("client/pages/favorite-songs/index", {
        pageTitle: "Bài hát yêu thích",
        favoriteSongs: favoriteSongs,
    });
}