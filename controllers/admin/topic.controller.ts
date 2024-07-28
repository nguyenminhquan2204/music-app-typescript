import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import { systemConfig } from "../../config/config";

import searchHelper from "../../helpers/search";
import filterStatusHelper from "../../helpers/filterStatus";
import paginationHelper from "../../helpers/pagination";

// [GET] /admin/topics
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

    const countTopic = await Topic.countDocuments(find);
    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 4
        },
        req.query,
        countTopic
    );

    const topics = await Topic.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    
    res.render("admin/pages/topics/index", {
        pageTitle: "Quản lý chủ đề",
        topics: topics,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
};

// [PATCH] /admin/topics/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
    const status: string = req.params.status;
    const id: string = req.params.id;

    await Topic.updateOne({ _id: id }, { 
        status: status,
    });

    (req as any).flash("success", "Cập nhật trạng thái thành công!");

    res.redirect("back");
};

// [GET] /admin/topics/detail/:id
export const detail = async (req: Request, res: Response) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const topic = await Topic.findOne(find);

        res.render("admin/pages/topics/detail", {
            pageTitle: topic.title,
            topic: topic
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/topics`);
    }
};

// [GET] /admin/topics/edit/:id
export const edit = async (req: Request, res: Response) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const topic = await Topic.findOne(find);   //chi tim 1 ban ghi co trong database

        res.render("admin/pages/topics/edit", {
            pageTitle: "Chỉnh sửa chủ đề",
            topic: topic
        });
    } catch(error) {
        (req as any).flash("error", "Lỗi !!!");
        res.redirect(`${systemConfig.prefixAdmin}/topics`);
    }
};

// [PATCH] /admin/topics/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    const countTopic = await Topic.countDocuments();

    if(req.body.position != "") {
        req.body.position = parseInt(req.body.position);
    } else {
        req.body.position = countTopic;
    }

    try {
        await Topic.updateOne({ _id: id }, req.body);
        (req as any).flash("success", "Cập nhật thành công!");
    } catch (error) {
        (req as any).flash("error", "Cập nhật thất bại!");
    }

    res.redirect(`/${systemConfig.prefixAdmin}/topics`);
};

// [DELETE] /admin/topics/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    await Topic.updateOne({ _id: id }, { 
        deleted: true, 
        deletedAt: new Date()
    }); 

    (req as any).flash("success", `Đã xóa thành công chủ đề!`);

    res.redirect("back");
};

// [GET] /admin/topics/create
export const create = async (req: Request, res: Response) => {

    res.render("admin/pages/topics/create", {
        pageTitle: "Thêm mới 1 chủ đề",
    });
};

// [POST] /admin/topics/create
export const createPost = async (req: Request, res: Response) => {  

    if(req.body.position != "") {
        req.body.position = parseInt(req.body.position);
    } else {
        const count: number = await Topic.countDocuments();
        req.body.position = count + 1;
    }

    try {
        req.body.avatar = "123";
        const data = new Topic(req.body);
        data.save();
        
        (req as any).flash("success", "Tạo mới chủ đề thành công");
    } catch (error) {
        (req as any).flash("error", "Tạo mới không thành công.");
    }

    res.redirect(`/${systemConfig.prefixAdmin}/topics`);
};

//[PATCH] /admin/blogs/change-multi
export const changeMulti = async (req, res) => {

    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Topic.updateMany({ _id: { $in: ids } }, { 
                status: "active",
            });
            (req as any).flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "inactive":
            await Topic.updateMany({ _id: { $in: ids } }, { 
                status: "inactive",
            });
            (req as any).flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "delete-all":
            await Topic.updateMany({ _id: { $in: ids } }, 
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

                await Topic.updateOne({ _id: id}, { 
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