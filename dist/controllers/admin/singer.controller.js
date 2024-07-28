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
exports.changeMulti = exports.createPost = exports.create = exports.deleteItem = exports.editPatch = exports.edit = exports.detail = exports.changeStatus = exports.index = void 0;
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const config_1 = require("../../config/config");
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
    const countSinger = yield singer_model_1.default.countDocuments(find);
    let objectPagination = (0, pagination_1.default)({
        currentPage: 1,
        limitItems: 4
    }, req.query, countSinger);
    const singers = yield singer_model_1.default.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    res.render("admin/pages/singers/index", {
        pageTitle: "Quản lý ca sỹ",
        singers: singers,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
});
exports.index = index;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.params.status;
    const id = req.params.id;
    yield singer_model_1.default.updateOne({ _id: id }, {
        status: status,
    });
    req.flash("success", "Cập nhật trạng thái thành công!");
    res.redirect("back");
});
exports.changeStatus = changeStatus;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const singer = yield singer_model_1.default.findOne(find);
        res.render("admin/pages/singers/detail", {
            pageTitle: singer.fullName,
            singer: singer
        });
    }
    catch (error) {
        res.redirect(`${config_1.systemConfig.prefixAdmin}/singers`);
    }
});
exports.detail = detail;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const singer = yield singer_model_1.default.findOne(find);
        res.render("admin/pages/singers/edit", {
            pageTitle: "Chỉnh sửa thông tin ca sỹ",
            singer: singer
        });
    }
    catch (error) {
        req.flash("error", "Lỗi !!!");
        res.redirect(`${config_1.systemConfig.prefixAdmin}/singers`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        if (req.body.position) {
            req.body.position = parseInt(req.body.position);
        }
        yield singer_model_1.default.updateOne({ _id: id }, req.body);
        req.flash("success", "Cập nhật thành công!");
    }
    catch (error) {
        req.flash("error", "Cập nhật thất bại!");
    }
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/singers`);
});
exports.editPatch = editPatch;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield singer_model_1.default.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash("success", `Đã xóa thành công chủ đề!`);
    res.redirect("back");
});
exports.deleteItem = deleteItem;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/singers/create", {
        pageTitle: "Thêm mới 1 ca sỹ",
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.position != "") {
            req.body.position = parseInt(req.body.position);
        }
        else {
            const count = yield singer_model_1.default.countDocuments();
            req.body.position = count + 1;
        }
        const data = new singer_model_1.default(req.body);
        data.save();
        req.flash("success", "Tạo mới thành công");
    }
    catch (error) {
        req.flash("error", "Tạo mới không thành công.");
    }
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/singers`);
});
exports.createPost = createPost;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
        case "active":
            yield singer_model_1.default.updateMany({ _id: { $in: ids } }, {
                status: "active",
            });
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "inactive":
            yield singer_model_1.default.updateMany({ _id: { $in: ids } }, {
                status: "inactive",
            });
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "delete-all":
            yield singer_model_1.default.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deletedAt: new Date()
            });
            req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm!`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                yield singer_model_1.default.updateOne({ _id: id }, {
                    position: position,
                });
            }
            req.flash("success", `Đã cập nhật lại vị trí thành công ${ids.length} sản phẩm!`);
            break;
        default:
            break;
    }
    res.redirect("back");
});
exports.changeMulti = changeMulti;
