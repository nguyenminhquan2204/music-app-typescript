import { Request, Response } from "express";
import md5 from "md5";

import * as generateHelper from "../../helpers/generate";
import * as sendMailHelper from "../../helpers/sendMail";

import User from "../../models/user.model";
import ForgotPassword from "../../models/forgot-password.model";

// [GET] /user/register
export const register = async (req: Request, res: Response) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản",
    });
};

// [POST] /user/register
export const registerPost = async (req: Request, res: Response) => {
    const existsEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    });

    if(existsEmail) {
        (req as any).flash("error", "Email đã tồn tại!");
        res.redirect("back");
        return;
    }

    req.body.password = md5(req.body.password);

    const user = new User(req.body);
    await user.save();

    res.cookie("tokenUser", user.tokenUser);

    (req as any).flash("success", "Đăng ký tài khoản thành công!");

    res.redirect("/topics");
};

// [GET] /user/login
export const login = async (req: Request, res: Response) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập tài khoản",
    });
};

// [POST] /user/login
export const loginPost = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if(!user) {
        (req as any).flash("error", "Email không tồn tại!");
        res.redirect("back");
        return;
    }

    if(md5(password) != user.password) {
        (req as any).flash("error", "Sai mật khẩu!");
        res.redirect("back");
        return;
    }

    if(user.status == "inactive") {
        (req as any).flash("error", "Tài khoản đang bị khóa!");
        res.redirect("back");
        return;
    }

    res.cookie("tokenUser", user.tokenUser);

    (req as any).flash("success", "Đăng nhập thành công.!");

    res.redirect("/topics");
};

// [GET] /user/logout
export const logout = async (req: Request, res: Response) => {

    res.clearCookie("tokenUser");

    (req as any).flash("success", "Đăng xuất thành công.!");

    res.redirect("/topics");
};

// [GET] /user/password/forgot
export const forgot = async (req: Request, res: Response) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Lấy lại mật khẩu",
    });
};

// [POST] /user/password/forgot
export const forgotPost = async (req: Request, res: Response) => {
    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        deleted: false
    });
    
    if(!user) {
        (req as any).flash("error", "Email không tồn tại!");
        res.redirect("back");
        return;
    } 

    //---------------------
    //B1: Tạo mã OTP và lưu thông OTP, email vào collection forgot-password
    const otp = generateHelper.generateRandomNumber(8);

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    };

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    //B2: Gửi mã OTP qua email của user
    const subject = `Mã OTP xác minh lấy lại mật khẩu`;
    const html = `Mã OTP xác minh lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là 3 phút. Lưu ý không được để lệ mã OTP`;
    sendMailHelper.sendMail(email, subject, html);

    //---------------------

    res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp
export const otpPassword = async (req: Request, res: Response) => {
    const email = req.query.email;

    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhập mã OTP",
        email: email
    });
};

// [POST] /user/password/otp
export const otpPasswordPost = async (req: Request, res: Response) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    if(!result) {
        (req as any).flash("error", "Mã OTP không hợp lệ!");
        res.redirect("back");
        return;
    }

    const user = await User.findOne({
        email: email
    });

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/user/password/reset");
};

// [GET] /user/password/reset
export const resetPassword = async (req: Request, res: Response) => {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đổi mật khẩu",
    });
};

// [POST] /user/password/reset
export const resetPasswordPost = async (req: Request, res: Response) => {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const tokenUser = req.cookies.tokenUser;

    if(md5(password) != md5(confirmPassword)) {
        (req as any).flash("error", "Xác thực mật khẩu lại không đúng!");
        res.redirect("back");
    } else {
        await User.updateOne({ tokenUser: tokenUser }, { password: md5(password) });

        (req as any).flash("success", "Đổi mật khẩu thành công!");
        res.redirect("/topics");
    }
};

// [GET] /user/info/:id
export const userInfo = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const user = await User.findOne({ _id: id });

        res.render("client/pages/user/info", {
            pageTitle: "Thông tin người dùng",
            myUser: user
        });
    } catch (error) {
        (req as any).flash("error", "Error!");
        res.redirect("back");
    }
}

// [GET] /user/editInfo/:id
export const editInfo = async (req: Request, res: Response) => {
    const user = await User.findOne({ _id: req.params.id }).select("-password");

    res.render("client/pages/user/edit", {
        pageTitle: "Chỉnh sửa thông tin",
        user: user,
    });
};

// [PATCH] /user/editInfo/:id
export const editInfoPatch = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        await User.updateOne({ _id: id }, req.body);
        (req as any).flash("success", "Cập nhật thông tin thành công!");
    } catch (error) {
        (req as any).flash("error", "Cập nhật thông tin thất bại!");
    }

    res.redirect(`/user/info/${id}`)
};