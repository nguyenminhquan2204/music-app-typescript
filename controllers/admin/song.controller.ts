import { Request, Response } from "express";
import Song from "../../models/song.model";
import Topic from "../../models/topic.model";
import Singer from "../../models/singer.model";
import { systemConfig } from "../../config/config";

import searchHelper from "../../helpers/search";
import filterStatusHelper from "../../helpers/filterStatus";
import paginationHelper from "../../helpers/pagination";

// [GET] /admin/songs
export const index = async (req: Request, res: Response) => {
    const filterStatus = filterStatusHelper(req.query);

    interface Find {
        status ?: string,
        deleted : boolean,
        title ?: RegExp
    };

    const find: Find = {
        deleted: false
    };

    if (req.query.status) {
        // find["status"] = req.query.status;
        find.status = req.query.status.toString();
    }

    //  Phan tim kiem
    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    // Sort
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toString();
        sort[sortKey] = req.query.sortValue;
    }
    // End sort

    const countSong = await Song.countDocuments(find);
    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 4
        },
        req.query,
        countSong
    );

    const songs = await Song.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
            
    res.render("admin/pages/songs/index", {
        pageTitle: "Quản lý bài hát",
        songs: songs,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
};

// [GET] /admin/songs/create
export const create = async (req: Request, res: Response) => {
    const topics = await Topic.find({
        deleted: false,
        status: "active",
    }).select("title");

    const singers = await Singer.find({
        deleted: false,
        status: "active"
    }).select("fullName");

    res.render("admin/pages/songs/create", {
        pageTitle: "Thêm mới bài hát",
        topics: topics,
        singers: singers
    });
};

// [POST] /admin/songs/create
export const createPost = async (req: Request, res: Response) => {
    // console.log(req.body);
    let avatar = "";
    let audio = "";

    if (req.body.avatar) {
        avatar = req.body.avatar[0];
    }

    if (req.body.audio) {
        audio = req.body.audio[0];
    }

    const dataSong = {
        title: req.body.title,
        topicId: req.body.title.topicId,
        singerId: req.body.singerId,
        description: req.body.description,
        status: req.body.status,
        avatar: avatar,
        audio: audio,
        lyrics: req.body.lyrics,
    };

    const song = new Song(dataSong);
    await song.save();

    res.redirect(`/${systemConfig.prefixAdmin}/songs`);
};

// [GET] /admin/songs/edit/:id
export const edit = async (req: Request, res: Response) => {
    const id = req.params.id;

    const song = await Song.findOne({
        _id: id,
        deleted: false
    });

    const topics = await Topic.find({
        deleted: false,
    }).select("title");

    const singers = await Singer.find({
        deleted: false
    }).select("fullName");

    res.render("admin/pages/songs/edit", {
        pageTitle: "Chỉnh sửa bài hát",
        song: song,
        topics: topics,
        singers: singers
    });
};

// [PATCH] /admin/songs/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    const dataSong = {
        title: req.body.title,
        topicId: req.body.topicId,
        singerId: req.body.singerId,
        description: req.body.description,
        status: req.body.status,
        lyrics: req.body.lyrics,
    };

    if (req.body.avatar) {
        dataSong["avatar"] = req.body.avatar[0];
    }

    if (req.body.audio) {
        dataSong["audio"] = req.body.audio[0];
    }

    await Song.updateOne({
        _id: req.params.id
    }, dataSong);

    res.redirect("back");
};

// [PATCH] /admin/songs/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
    const status: string = req.params.status;
    const id: string = req.params.id;

    await Song.updateOne({ _id: id }, { 
        status: status,
    });

    (req as any).flash("success", "Cập nhật trạng thái thành công!");

    res.redirect("back");
};

// [GET] /admin/songs/detail/:id
export const detail = async (req: Request, res: Response) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const song = await Song.findOne(find);

        const singerId = song.singerId;
        const singer = await Singer.findOne({
            deleted: false,
            _id: singerId
        }).select("fullName");

        const topicId = song.topicId;
        const topic = await Topic.findOne({
            deleted: false,
            _id: topicId
        }).select("title");

        res.render("admin/pages/songs/detail", {
            pageTitle: song.title,
            song: song,
            singer: singer,
            topic: topic
        });
        
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/songs`);
    }
};

// [DELETE] /admin/songs/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    await Song.updateOne({ _id: id }, { 
        deleted: true, 
        deletedAt: new Date()
    }); 

    (req as any).flash("success", `Đã xóa thành công bài hát!`);

    res.redirect("back");
}

// [PATCH] /admin/songs/change-multi
export const changeMulti = async (req: Request, res: Response) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Song.updateMany({ _id: { $in: ids } }, { 
                status: "active",
            });
            (req as any).flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "inactive":
            await Song.updateMany({ _id: { $in: ids } }, { 
                status: "inactive",
            });
            (req as any).flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;  
        case "delete-all":
            await Song.updateMany({ _id: { $in: ids } }, 
            { 
                deleted: true,
                deletedAt: new Date()
            });
            (req as any).flash("success", `Đã xóa thành công ${ids.length} sản phẩm!`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);

                await Song.updateOne({ _id: id}, { 
                    position: position,
                });
            }
            (req as any).flash("success", `Đã cập nhật lại vị trí thành công ${ids.length} sản phẩm!`);
            break;
        default:
            break;
    }

    res.redirect("back");
};