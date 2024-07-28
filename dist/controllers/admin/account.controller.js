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
exports.changeStatus = exports.deleteItem = exports.detail = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const md5_1 = __importDefault(require("md5"));
const account_model_1 = __importDefault(require("../../models/account.model"));
const role_model_1 = __importDefault(require("../../models/role.model"));
const config_1 = require("../../config/config");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let find = {
        deleted: false,
    };
    const records = yield account_model_1.default.find(find).select("-password -token");
    for (const record of records) {
        const role = yield role_model_1.default.findOne({
            _id: record.role_id,
            deleted: false
        });
        record['role'] = role;
    }
    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sách tài khoản",
        records: records,
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roles = yield role_model_1.default.find({ deleted: false });
    res.render("admin/pages/accounts/create", {
        pageTitle: "Tạo mới tài khoản",
        roles: roles,
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const emailExist = yield account_model_1.default.findOne({
        email: req.body.email,
        deleted: false,
    });
    if (emailExist) {
        req.flash("error", `Email ${req.body.email} này đã tồn tại`);
        res.redirect("back");
    }
    else {
        req.body.password = (0, md5_1.default)(req.body.password);
        const record = new account_model_1.default(req.body);
        yield record.save();
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/accounts`);
    }
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let find = {
        _id: req.params.id,
        deleted: false,
    };
    try {
        const data = yield account_model_1.default.findOne(find);
        const roles = yield role_model_1.default.find({
            deleted: false,
        });
        res.render("admin/pages/accounts/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            data: data,
            roles: roles,
        });
    }
    catch (error) {
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/accounts`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const emailExist = yield account_model_1.default.findOne({
        _id: { $ne: id },
        deleted: false,
        email: req.body.email,
    });
    if (emailExist) {
        req.flash("error", `Email ${req.body.email} đã tồn tại!`);
    }
    else {
        if (req.body.password) {
            req.body.password = (0, md5_1.default)(req.body.password);
        }
        else {
            delete req.body.password;
        }
        yield account_model_1.default.updateOne({ _id: id }, req.body);
        req.flash("success", "Cập nhật tài khoản thành công!");
    }
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/accounts`);
});
exports.editPatch = editPatch;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield account_model_1.default.findOne({
            deleted: false,
            _id: req.params.id
        });
        if (data.role_id) {
            const role = yield role_model_1.default.findOne({
                _id: data.role_id,
            }).select("title");
            data['role'] = role;
        }
        res.render("admin/pages/accounts/detail", {
            pageTitle: data.fullName,
            account: data
        });
    }
    catch (error) {
        req.flash("error", "Lỗi xảy ra!!");
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/accounts`);
    }
});
exports.detail = detail;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield account_model_1.default.updateOne({ _id: req.params.id }, {
            deleted: true,
            deletedAt: new Date()
        });
        req.flash("success", "Xoá thành công.!");
    }
    catch (error) {
        req.flash("error", "Lỗi xảy ra.!!");
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/accounts`);
    }
});
exports.deleteItem = deleteItem;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield account_model_1.default.updateOne({ _id: req.params.id }, {
            status: req.params.status
        });
        req.flash("success", "Cập nhật trạng thái thành công.");
    }
    catch (error) {
        req.flash("error", "Lỗi xảy ra.!!");
    }
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/accounts`);
});
exports.changeStatus = changeStatus;
