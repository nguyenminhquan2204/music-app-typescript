import { Request, Response } from "express";

import md5 from "md5";

import Account from "../../models/account.model";
import Role from "../../models/role.model";

import { systemConfig } from "../../config/config";

import searchHelper from "../../helpers/search";
import filterStatusHelper from "../../helpers/filterStatus";
import paginationHelper from "../../helpers/pagination";

// [GET] /admin/account
export const index = async (req: Request, res: Response) => {
    let find = {
        deleted: false,
    };

    const records = await Account.find(find).select("-password -token");
    
    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        });
        record['role'] = role;
    }
    
    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sách tài khoản",
        records: records,
    });
};

// [GET] /admin/accounts/create
export const create = async (req: Request, res: Response) => {
    const roles = await Role.find({ deleted: false });

    res.render("admin/pages/accounts/create", {
        pageTitle: "Tạo mới tài khoản",
        roles: roles,
    });
};

// [POST] /admin/accounts/create
export const createPost = async (req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false,
    });

    if(emailExist) {
        req.flash("error", `Email ${req.body.email} này đã tồn tại`);
        res.redirect("back");
    } else {
        req.body.password = md5(req.body.password);

        const record = new Account(req.body);
        await record.save();

        res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
};

// [GET] /admin/accounts/edit/:id
export const edit = async (req: Request, res: Response) => {
    let find = {
        _id: req.params.id,
        deleted: false,
    };

    try {
        const data = await Account.findOne(find);
        // data.password = md5(data.password);
        const roles = await Role.find({
            deleted: false,
        });

        res.render("admin/pages/accounts/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            data: data,
            roles: roles,
        });
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
};

// [PATCH] /admin/accounts/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    const id = req.params.id;

    const emailExist = await Account.findOne({
        // tim kiem nhung id khac id nay
        _id: { $ne: id},
        deleted: false,
        email: req.body.email,
    });

    if(emailExist) {
        (req as any).flash("error", `Email ${req.body.email} đã tồn tại!`);
    } else {
        if(req.body.password) {
            req.body.password = md5(req.body.password);
        } else {
            delete req.body.password;
        }
        await Account.updateOne({ _id: id }, req.body);
        // console.log(req.body);
        (req as any).flash("success", "Cập nhật tài khoản thành công!");
    }

    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
}; 

// [GET] /admin/accounts/detail/:id
export const detail = async (req: Request, res: Response) => {
    try {
        const data = await Account.findOne({
            deleted: false,
            _id: req.params.id
        });

        if(data.role_id) {
            const role = await Role.findOne({
                _id: data.role_id,
            }).select("title");

            data['role'] = role;
        }

        res.render("admin/pages/accounts/detail", {
            pageTitle: data.fullName,
            account: data
        });
    } catch (error) {
        (req as any).flash("error", "Lỗi xảy ra!!");
        res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
};

// [DELETE] /admin/accounts/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
    try {
        await Account.updateOne({ _id: req.params.id }, {
            deleted: true,
            deletedAt: new Date()
        });

        (req as any).flash("success", "Xoá thành công.!");
    } catch (error) {
        (req as any).flash("error", "Lỗi xảy ra.!!");
        res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
};

// [GET] /admin/account/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
    try {
        await Account.updateOne({ _id: req.params.id }, {
            status: req.params.status
        });

        (req as any).flash("success", "Cập nhật trạng thái thành công.");

    } catch (error) {
        (req as any).flash("error", "Lỗi xảy ra.!!");
    }
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
};