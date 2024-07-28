import { Request, Response } from "express";

import md5 from "md5";

import Account from "../../models/account.model";
import Role from "../../models/role.model";

import { systemConfig } from "../../config/config";

import searchHelper from "../../helpers/search";
import filterStatusHelper from "../../helpers/filterStatus";
import paginationHelper from "../../helpers/pagination";

// [GET] /admin/roles
export const index = async (req: Request, res: Response) => {
    let find = {
        deleted: false,
    };

    const records = await Role.find(find);

    res.render("admin/pages/roles/index", {
        pageTitle: "Nhóm quyền",
        records: records,
    });
};

// [GET] /admin/roles/create
export const create = async (req: Request, res: Response) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Tạo nhóm quyền",
    });
};

// [POST] /admin/roles/create
export const createPost = async (req: Request, res: Response) => {
    const record = new Role(req.body);
    await record.save();

    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
};

// [GET] /admin/roles/detail/:id
export const detail = async (req: Request, res: Response) => {
    try {
        let find ={
            deleted: false,
            _id: req.params.id,
        };
    
        const record = await Role.findOne(find);
    
        res.render("admin/pages/roles/detail", {
            pageTitle: record.title,
            record: record,
        });
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }
};

// [GET] /admin/roles/edit/:id
export const edit = async (req: Request, res: Response) => {
    try{
        const id = req.params.id;

        let find = {
            _id: id,
            deleted: false,
        };

        const data = await Role.findOne(find);

        res.render("admin/pages/roles/edit", {
            pageTitle: "Sửa nhóm quyền",
            data: data,
        });
    } catch(error) {
        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }
};

// [PATCH] /admin/roles/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    try{
        const id = req.params.id;

        await Role.updateOne({ _id: id }, req.body);
        
        (req as any).flash("success", "Cập nhật nhóm quyền thành công!");
    } catch(error) {
        (req as any).flash("error", "Cập nhật nhóm quyền thất bại!");
    }
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
};

// [DELETE] /admin/roles/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
    const id = req.params.id;

    await Role.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date(),
    });

    (req as any).flash("success", "Xóa thành công");

    res.redirect("back");
};

// [GET] /admin/roles/permissions
export const permissions = async (req: Request, res: Response) => {
    let find = {
        deleted: false,
    };

    const records = await Role.find(find);

    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phân quyền",
        records: records,
    });
};

// [PATCH] /admin/roles/permissions
export const permissionsPatch = async (req: Request, res: Response) => {
    try{
        // console.log(req.body.permissions);

        // Chuyển 1 chuỗi JSON thành chuỗi JS
        const permissions = JSON.parse(req.body.permissions);
        // console.log(permissions);

        for (const item of permissions) {
            await Role.updateOne({ _id: item.id}, { permissions: item.permissions });
        }
        
        (req as any).flash("success", "Cập nhật phân quyền thành công!");
    } catch(error) {
        (req as any).flash("error", "Cập nhật phân quyền thất bại!");
    }

    res.redirect("back");
};