import { Request, Response, NextFunction } from "express";

export const loginPost = (req: Request, res: Response, next: NextFunction) => {
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

    next();
}