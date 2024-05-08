import { Response, Request } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";

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

    res.render("client/pages/songs/detail", {
        pageTitle: "Chi tiết bài hát",
        song: song,
        singer: singer,
        topic: topic
    });
};