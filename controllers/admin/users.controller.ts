import { Request, Response } from "express";
import md5 from "md5";
import { systemConfig } from "../../config/config";

import User from "../../models/user.model";

import searchHelper from "../../helpers/search";
import filterStatusHelper from "../../helpers/filterStatus";
import paginationHelper from "../../helpers/pagination";


// [GET] /admin/users
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

    const countSong = await User.countDocuments(find);

    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 4
        },
        req.query,
        countSong
    );

    const users = await User.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    
    res.render("admin/pages/users/index", {
        pageTitle: "Danh sách tài khoản",
        users: users,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
};

// [PATCH] /admin/users/change-multi
export const changeMulti = async (req: Request, res: Response) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await User.updateMany({ _id: { $in: ids } }, { 
                status: "active",
            });
            (req as any).flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "inactive":
            await User.updateMany({ _id: { $in: ids } }, { 
                status: "inactive",
            });
            (req as any).flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;  
        case "delete-all":
            await User.updateMany({ _id: { $in: ids } }, 
            { 
                deleted: true,
                deletedAt: new Date()
            });
            (req as any).flash("success", `Đã xóa thành công ${ids.length} sản phẩm!`);
            break;
        case "change-position":
            console.log("Quan");
            (req as any).flash("error", `Trang không hỗ trợ tính năng này!`);
            break;
        default:
            break;
    }

    res.redirect("back");
};

// [GET] /admin/users/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
    const status = req.params.status;
    const id = req.params.id;

    try {
        await User.updateOne({ _id: id }, { status: status });
        (req as any).flash("success", "Cập nhật trạng thái thành công!");
    } catch (error) {
        (req as any).flash("error", "Có lỗi xảy ra!");
    }
    res.redirect("back");
};

// [GET] /admin/users/detail/:id
export const detail = async (req: Request, res: Response) => {
    try {
        const data = await User.findOne({
            deleted: false,
            _id: req.params.id
        });

        res.render("admin/pages/users/detail", {
            pageTitle: data.fullName,
            user: data
        });
    } catch (error) {
        (req as any).flash("error", "Lỗi xảy ra!!");
        res.redirect(`/${systemConfig.prefixAdmin}/users`);
    }
};

// [GET] /admin/users/edit/:id
export const edit = async (req: Request, res: Response) => {
    const user = await User.findOne({ _id: req.params.id }).select("-password");

    res.render("admin/pages/users/edit", {
        pageTitle: "Chỉnh sửa thông tin",
        user: user
    });
};

// [PATCH] /admin/users/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        await User.updateOne({ _id: id }, req.body);
        (req as any).flash("success", "Cập nhật thông tin thành công!");
    } catch (error) {
        (req as any).flash("error", "Cập nhật thông tin thất bại!");
    }

    res.redirect(`/${systemConfig.prefixAdmin}/users`)
};

// [DELETE] /admin/users/delete/:id
export const deleteUser = async (req: Request, res: Response) => {
    try {
        await User.updateOne({ _id: req.params.id }, {
            deleted: true,
            deletedAt: new Date()
        });

        (req as any).flash("success", "Xoá thành công.!");
    } catch (error) {
        (req as any).flash("error", "Lỗi xảy ra.!!");
        res.redirect(`/${systemConfig.prefixAdmin}/users`);
    }
};

// [GET] /admin/users/create
export const create = async (req: Request, res: Response) => {
    res.render("admin/pages/users/create", {
        pageTitle: "Tạo mới tài khoản",
    });
};

// [POST] /admin/users/create
export const createPost = async (req: Request, res: Response) => {
    const emailExist = await User.findOne({
        email: req.body.email,
        deleted: false,
    });

    if(emailExist) {
        (req as any).flash("error", `Email ${req.body.email} này đã tồn tại`);
        res.redirect("back");
    } else {
        req.body.password = md5(req.body.password);

        const record = new User(req.body);
        await record.save();

        (req as any).flash("success", "Tạo tài khoản thành công!");
        res.redirect(`/${systemConfig.prefixAdmin}/users`);
    }
};