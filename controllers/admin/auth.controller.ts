import { Request, Response } from "express";

import md5 from "md5";

import { systemConfig } from "../../config/config";
import Account from "../../models/account.model";

// [GET] /admin/auth/login
export const login = async (req: Request, res: Response) => {
    if(req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    } else {
        res.render("admin/pages/auth/login", {
            pageTitle: "Đăng nhập",
        });
    }
};

// [POST] /admin/auth/login
export const loginPost = async (req, res) => {
    // const { email, password} = req.body;
    const email = req.body.email;
    const password = req.body.password;
    
    const user = await Account.findOne({
        email: email,
        deleted: false,
    });

    if(!user) {
        req.flash("error", `Email không tồn tại!`);
        res.redirect("back");
        return;
    }

    if(md5(password) != user.password) {
        req.flash("error", `Sai mật khẩu!`);
        res.redirect("back");
        return;
    }

    if(user.status == "inactive") {
        req.flash("error", `Tài khoản đã bị khóa!`);
        res.redirect("back");
        return;
    }

    res.cookie("token", user.token);
    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
};

// [GET] /admin/auth/logout
export const logout = async (req: Request, res: Response) => {
    res.clearCookie("token");
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
};