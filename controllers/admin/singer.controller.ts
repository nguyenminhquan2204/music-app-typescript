import { Request, Response } from "express";
import Singer from "../../models/singer.model";
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
        fullName ?: RegExp
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
        find.fullName = objectSearch.regex;
    }

    // Sort
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toString();
        sort[sortKey] = req.query.sortValue;
    }
    // End sort

    const countSinger = await Singer.countDocuments(find);
    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 4
        },
        req.query,
        countSinger
    );

    const singers = await Singer.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    
    res.render("admin/pages/singers/index", {
        pageTitle: "Quản lý ca sỹ",
        singers: singers,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
};

// [PATCH] /admin/singers/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
    const status: string = req.params.status;
    const id: string = req.params.id;

    await Singer.updateOne({ _id: id }, { 
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

        const singer = await Singer.findOne(find);

        res.render("admin/pages/singers/detail", {
            pageTitle: singer.fullName,
            singer: singer
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/singers`);
    }
};

// [GET] /admin/singers/edit/:id
export const edit = async (req: Request, res: Response) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const singer = await Singer.findOne(find);   //chi tim 1 ban ghi co trong database

        res.render("admin/pages/singers/edit", {
            pageTitle: "Chỉnh sửa thông tin ca sỹ",
            singer: singer
        });
    } catch(error) {
        (req as any).flash("error", "Lỗi !!!");
        res.redirect(`${systemConfig.prefixAdmin}/singers`);
    }
};

// [PATCH] /admin/singers/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    try {
        if(req.body.position) {
            req.body.position = parseInt(req.body.position);
        }

        await Singer.updateOne({ _id: id }, req.body);
        (req as any).flash("success", "Cập nhật thành công!");
    } catch (error) {
        (req as any).flash("error", "Cập nhật thất bại!");
    }

    res.redirect(`/${systemConfig.prefixAdmin}/singers`);
};

// [DELETE] /admin/singers/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    await Singer.updateOne({ _id: id }, { 
        deleted: true, 
        deletedAt: new Date()
    }); 

    (req as any).flash("success", `Đã xóa thành công chủ đề!`);

    res.redirect("back");
};

// [GET] /admin/singers/create
export const create = async (req: Request, res: Response) => {

    res.render("admin/pages/singers/create", {
        pageTitle: "Thêm mới 1 ca sỹ",
    });
};

// [POST] /admin/topics/create
export const createPost = async (req: Request, res: Response) => {  

    try {
        if(req.body.position != "") {
            req.body.position = parseInt(req.body.position);
        } else {
            const count = await Singer.countDocuments();
            req.body.position = count + 1;
        }

        const data = new Singer(req.body);
        data.save();
        
        (req as any).flash("success", "Tạo mới thành công");
    } catch (error) {
        (req as any).flash("error", "Tạo mới không thành công.");
    }

    res.redirect(`/${systemConfig.prefixAdmin}/singers`);
};

//[PATCH] /admin/singers/change-multi
export const changeMulti = async (req, res) => {

    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Singer.updateMany({ _id: { $in: ids } }, { 
                status: "active",
            });
            (req as any).flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "inactive":
            await Singer.updateMany({ _id: { $in: ids } }, { 
                status: "inactive",
            });
            (req as any).flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "delete-all":
            await Singer.updateMany({ _id: { $in: ids } }, 
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

                await Singer.updateOne({ _id: id}, { 
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