"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = exports.create = exports.deleteUser = exports.editPatch = exports.edit = exports.detail = exports.changeStatus = exports.changeMulti = exports.index = void 0;
const md5_1 = __importDefault(require("md5"));
const config_1 = require("../../config/config");
const user_model_1 = __importDefault(require("../../models/user.model"));
const search_1 = __importDefault(require("../../helpers/search"));
const filterStatus_1 = __importDefault(require("../../helpers/filterStatus"));
const pagination_1 = __importDefault(require("../../helpers/pagination"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filterStatus = (0, filterStatus_1.default)(req.query);
    ;
    const find = {
        deleted: false
    };
    if (req.query.status) {
        find.status = req.query.status.toString();
    }
    const objectSearch = (0, search_1.default)(req.query);
    if (objectSearch.regex) {
        find.fullName = objectSearch.regex;
    }
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toString();
        sort[sortKey] = req.query.sortValue;
    }
    const countSong = yield user_model_1.default.countDocuments(find);
    let objectPagination = (0, pagination_1.default)({
        currentPage: 1,
        limitItems: 4
    }, req.query, countSong);
    const users = yield user_model_1.default.find(find)
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
});
exports.index = index;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
        case "active":
            yield user_model_1.default.updateMany({ _id: { $in: ids } }, {
                status: "active",
            });
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "inactive":
            yield user_model_1.default.updateMany({ _id: { $in: ids } }, {
                status: "inactive",
            });
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "delete-all":
            yield user_model_1.default.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deletedAt: new Date()
            });
            req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm!`);
            break;
        case "change-position":
            console.log("Quan");
            req.flash("error", `Trang không hỗ trợ tính năng này!`);
            break;
        default:
            break;
    }
    res.redirect("back");
});
exports.changeMulti = changeMulti;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.params.status;
    const id = req.params.id;
    try {
        yield user_model_1.default.updateOne({ _id: id }, { status: status });
        req.flash("success", "Cập nhật trạng thái thành công!");
    }
    catch (error) {
        req.flash("error", "Có lỗi xảy ra!");
    }
    res.redirect("back");
});
exports.changeStatus = changeStatus;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield user_model_1.default.findOne({
            deleted: false,
            _id: req.params.id
        });
        res.render("admin/pages/users/detail", {
            pageTitle: data.fullName,
            user: data
        });
    }
    catch (error) {
        req.flash("error", "Lỗi xảy ra!!");
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/users`);
    }
});
exports.detail = detail;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ _id: req.params.id }).select("-password");
    res.render("admin/pages/users/edit", {
        pageTitle: "Chỉnh sửa thông tin",
        user: user
    });
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        yield user_model_1.default.updateOne({ _id: id }, req.body);
        req.flash("success", "Cập nhật thông tin thành công!");
    }
    catch (error) {
        req.flash("error", "Cập nhật thông tin thất bại!");
    }
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/users`);
});
exports.editPatch = editPatch;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_model_1.default.updateOne({ _id: req.params.id }, {
            deleted: true,
            deletedAt: new Date()
        });
        req.flash("success", "Xoá thành công.!");
    }
    catch (error) {
        req.flash("error", "Lỗi xảy ra.!!");
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/users`);
    }
});
exports.deleteUser = deleteUser;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/users/create", {
        pageTitle: "Tạo mới tài khoản",
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const emailExist = yield user_model_1.default.findOne({
        email: req.body.email,
        deleted: false,
    });
    if (emailExist) {
        req.flash("error", `Email ${req.body.email} này đã tồn tại`);
        res.redirect("back");
    }
    else {
        req.body.password = (0, md5_1.default)(req.body.password);
        const record = new user_model_1.default(req.body);
        yield record.save();
        req.flash("success", "Tạo tài khoản thành công!");
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/users`);
    }
});
exports.createPost = createPost;
