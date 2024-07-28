import { Request, Response, NextFunction } from "express";

export const createPost = (req: Request, res: Response, next: NextFunction) => {
    if(!req.body.fullName) {
        (req as any).flash("error", "Vui lòng nhập họ tên!");
        res.redirect("back");
        return;
    }

    if(!req.body.email) {
        (req as any).flash("error", "Vui lòng nhập email!");
        res.redirect("back");
        return;
    }

    if(!req.body.password) {
        (req as any).flash("error", "Vui lòng nhập mật khẩu!");
        res.redirect("back");
        return;
    }

    next(); // chuyen sang buoc ke tiep
};

export const editPatch = (req: Request, res: Response, next: NextFunction) => {
    if(!req.body.fullName) {
        (req as any).flash("error", "Vui lòng nhập họ tên!");
        res.redirect("back");
        return;
    }

    if(!req.body.email) {
        (req as any).flash("error", "Vui lòng nhập email!");
        res.redirect("back");
        return;
    }

    next(); // chuyen sang buoc ke tiep
};