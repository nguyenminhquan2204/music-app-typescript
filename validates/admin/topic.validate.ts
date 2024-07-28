import { Request, Response, NextFunction } from "express";

export const createPost = (req: Request, res: Response, next: NextFunction) => {
    if(!req.body.title) {
        (req as any).flash("error", "Vui lòng nhập tiêu để!");
        res.redirect("back");
        return;
    }

    // console.log("OK");
    next(); // chuyen sang buoc ke tiep
};