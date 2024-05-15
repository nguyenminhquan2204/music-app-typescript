import { Response, Request } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import FavoriteSong from "../../models/favorite-song.model";

// [GET] /songs/:slugTopic
export const list = async (req: Request, res: Response) => {
    try{
        const topic = await Topic.findOne({
            slug: req.params.slugTopic,
            status: "active",
            deleted: false
        });

        // console.log(topic);
        const songs = await Song.find({
            topicId: topic.id,
            status: "active",
            deleted: false
        }).select("avatar title slug singerId like");
        // console.log(songs);

        for (const song of songs) {
            const infoSinger = await Singer.findOne({
                deleted: false,
                _id: song.singerId,
                status: "active"      
            });

            song["infoSinger"] = infoSinger;
        }

        res.render("client/pages/songs/list", {
            pageTitle: topic.title,
            songs: songs
        });
    } catch(e) {
        res.redirect("/");
    }
};

// [GET] /songs/detail/:slugSong
export const detail = async (req: Request, res: Response) => {
    const slugSong: string = req.params.slugSong;

    const song = await Song.findOne({
        slug: slugSong,
        deleted: false,
        status: "active"
    });

    const singer = await Singer.findOne({
        _id: song.singerId,
        deleted: false
    }).select("fullName");

    const topic = await Topic.findOne({
        _id: song.topicId,
        deleted: false
    }).select("title");

    const favoriteSong = await FavoriteSong.findOne({
        songId: song.id
    });

    song["isFavoriteSong"] = favoriteSong ? true : false;

    res.render("client/pages/songs/detail", {
        pageTitle: "Chi tiết bài hát",
        song: song,
        singer: singer,
        topic: topic
    });
};

// [PATCH] /songs/like/:typeLike/:idSong
export const like = async (req: Request, res: Response) => {
    const idSong: string = req.params.idSong;
    const typeLike: string = req.params.typeLike;

    const song = await Song.findOne({
        deleted: false,
        _id: idSong,
        status: "active"
    });

    const newLike = typeLike == "like" ? song.like + 1 : song.like - 1;

    await Song.updateOne({ _id: idSong }, {
        like: newLike
    });
    // like: ["id_user_1", "id_user_2", ...]

    res.json({
        code: 200,
        message: "Thành công.",
        like: newLike
    });
};

// [PATCH] /songs/favorite/:typeFavorite/:idSong
export const favorite = async (req: Request, res: Response) => {
    const idSong: string = req.params.idSong;
    const typeFavorite: string = req.params.typeFavorite;

    switch (typeFavorite) {
        case "favorite":
            const existFavoriteSong = await FavoriteSong.findOne({
                songId: idSong
            });
            
            if(!existFavoriteSong) {
                const record = new FavoriteSong({
                    // userId: "",
                    songId: idSong
                });
                await record.save();
            }
            break;
        case "unfavorite":
            await FavoriteSong.deleteOne({
                songId: idSong
            });
            break;
        default:
            break;
    }

    res.json({
        code: 200,
        message: "Thành công."
    });
};