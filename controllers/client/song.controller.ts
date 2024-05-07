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