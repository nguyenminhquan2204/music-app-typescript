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
exports.changeMulti = exports.deleteItem = exports.detail = exports.changeStatus = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const song_model_1 = __importDefault(require("../../models/song.model"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
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
        find.title = objectSearch.regex;
    }
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toString();
        sort[sortKey] = req.query.sortValue;
    }
    const countSong = yield song_model_1.default.countDocuments(find);
    let objectPagination = (0, pagination_1.default)({
        currentPage: 1,
        limitItems: 4
    }, req.query, countSong);
    const songs = yield song_model_1.default.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    res.render("admin/pages/songs/index", {
        pageTitle: "Quản lý bài hát",
        songs: songs,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topics = yield topic_model_1.default.find({
        deleted: false,
        status: "active",
    }).select("title");
    const singers = yield singer_model_1.default.find({
        deleted: false,
        status: "active"
    }).select("fullName");
    res.render("admin/pages/songs/create", {
        pageTitle: "Thêm mới bài hát",
        topics: topics,
        singers: singers
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let avatar = "";
    let audio = "";
    if (req.body.avatar) {
        avatar = req.body.avatar[0];
    }
    if (req.body.audio) {
        audio = req.body.audio[0];
    }
    const dataSong = {
        title: req.body.title,
        topicId: req.body.title.topicId,
        singerId: req.body.singerId,
        description: req.body.description,
        status: req.body.status,
        avatar: avatar,
        audio: audio,
        lyrics: req.body.lyrics,
    };
    const song = new song_model_1.default(dataSong);
    yield song.save();
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/songs`);
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const song = yield song_model_1.default.findOne({
        _id: id,
        deleted: false
    });
    const topics = yield topic_model_1.default.find({
        deleted: false,
    }).select("title");
    const singers = yield singer_model_1.default.find({
        deleted: false
    }).select("fullName");
    res.render("admin/pages/songs/edit", {
        pageTitle: "Chỉnh sửa bài hát",
        song: song,
        topics: topics,
        singers: singers
    });
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dataSong = {
        title: req.body.title,
        topicId: req.body.topicId,
        singerId: req.body.singerId,
        description: req.body.description,
        status: req.body.status,
        lyrics: req.body.lyrics,
    };
    if (req.body.avatar) {
        dataSong["avatar"] = req.body.avatar[0];
    }
    if (req.body.audio) {
        dataSong["audio"] = req.body.audio[0];
    }
    yield song_model_1.default.updateOne({
        _id: req.params.id
    }, dataSong);
    res.redirect("back");
});
exports.editPatch = editPatch;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.params.status;
    const id = req.params.id;
    yield song_model_1.default.updateOne({ _id: id }, {
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
        const song = yield song_model_1.default.findOne(find);
        const singerId = song.singerId;
        const singer = yield singer_model_1.default.findOne({
            deleted: false,
            _id: singerId
        }).select("fullName");
        const topicId = song.topicId;
        const topic = yield topic_model_1.default.findOne({
            deleted: false,
            _id: topicId
        }).select("title");
        res.render("admin/pages/songs/detail", {
            pageTitle: song.title,
            song: song,
            singer: singer,
            topic: topic
        });
    }
    catch (error) {
        res.redirect(`${config_1.systemConfig.prefixAdmin}/songs`);
    }
});
exports.detail = detail;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield song_model_1.default.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash("success", `Đã xóa thành công bài hát!`);
    res.redirect("back");
});
exports.deleteItem = deleteItem;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
        case "active":
            yield song_model_1.default.updateMany({ _id: { $in: ids } }, {
                status: "active",
            });
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "inactive":
            yield song_model_1.default.updateMany({ _id: { $in: ids } }, {
                status: "inactive",
            });
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "delete-all":
            yield song_model_1.default.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deletedAt: new Date()
            });
            req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm!`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                yield song_model_1.default.updateOne({ _id: id }, {
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
