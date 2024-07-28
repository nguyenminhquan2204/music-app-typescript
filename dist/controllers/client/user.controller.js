"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.editInfoPatch = exports.editInfo = exports.userInfo = exports.resetPasswordPost = exports.resetPassword = exports.otpPasswordPost = exports.otpPassword = exports.forgotPost = exports.forgot = exports.logout = exports.loginPost = exports.login = exports.registerPost = exports.register = void 0;
const md5_1 = __importDefault(require("md5"));
const generateHelper = __importStar(require("../../helpers/generate"));
const sendMailHelper = __importStar(require("../../helpers/sendMail"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const forgot_password_model_1 = __importDefault(require("../../models/forgot-password.model"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản",
    });
});
exports.register = register;
const registerPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existsEmail = yield user_model_1.default.findOne({
        email: req.body.email,
        deleted: false
    });
    if (existsEmail) {
        req.flash("error", "Email đã tồn tại!");
        res.redirect("back");
        return;
    }
    req.body.password = (0, md5_1.default)(req.body.password);
    const user = new user_model_1.default(req.body);
    yield user.save();
    res.cookie("tokenUser", user.tokenUser);
    req.flash("success", "Đăng ký tài khoản thành công!");
    res.redirect("/topics");
});
exports.registerPost = registerPost;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập tài khoản",
    });
});
exports.login = login;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const user = yield user_model_1.default.findOne({
        email: email,
        deleted: false
    });
    if (!user) {
        req.flash("error", "Email không tồn tại!");
        res.redirect("back");
        return;
    }
    if ((0, md5_1.default)(password) != user.password) {
        req.flash("error", "Sai mật khẩu!");
        res.redirect("back");
        return;
    }
    if (user.status == "inactive") {
        req.flash("error", "Tài khoản đang bị khóa!");
        res.redirect("back");
        return;
    }
    res.cookie("tokenUser", user.tokenUser);
    req.flash("success", "Đăng nhập thành công.!");
    res.redirect("/topics");
});
exports.loginPost = loginPost;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("tokenUser");
    req.flash("success", "Đăng xuất thành công.!");
    res.redirect("/topics");
});
exports.logout = logout;
const forgot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Lấy lại mật khẩu",
    });
});
exports.forgot = forgot;
const forgotPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const user = yield user_model_1.default.findOne({
        email: email,
        deleted: false
    });
    if (!user) {
        req.flash("error", "Email không tồn tại!");
        res.redirect("back");
        return;
    }
    const otp = generateHelper.generateRandomNumber(8);
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    };
    const forgotPassword = new forgot_password_model_1.default(objectForgotPassword);
    yield forgotPassword.save();
    const subject = `Mã OTP xác minh lấy lại mật khẩu`;
    const html = `Mã OTP xác minh lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là 3 phút. Lưu ý không được để lệ mã OTP`;
    sendMailHelper.sendMail(email, subject, html);
    res.redirect(`/user/password/otp?email=${email}`);
});
exports.forgotPost = forgotPost;
const otpPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.query.email;
    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhập mã OTP",
        email: email
    });
});
exports.otpPassword = otpPassword;
const otpPasswordPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const otp = req.body.otp;
    const result = yield forgot_password_model_1.default.findOne({
        email: email,
        otp: otp
    });
    if (!result) {
        req.flash("error", "Mã OTP không hợp lệ!");
        res.redirect("back");
        return;
    }
    const user = yield user_model_1.default.findOne({
        email: email
    });
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/user/password/reset");
});
exports.otpPasswordPost = otpPasswordPost;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đổi mật khẩu",
    });
});
exports.resetPassword = resetPassword;
const resetPasswordPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const tokenUser = req.cookies.tokenUser;
    if ((0, md5_1.default)(password) != (0, md5_1.default)(confirmPassword)) {
        req.flash("error", "Xác thực mật khẩu lại không đúng!");
        res.redirect("back");
    }
    else {
        yield user_model_1.default.updateOne({ tokenUser: tokenUser }, { password: (0, md5_1.default)(password) });
        req.flash("success", "Đổi mật khẩu thành công!");
        res.redirect("/topics");
    }
});
exports.resetPasswordPost = resetPasswordPost;
const userInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield user_model_1.default.findOne({ _id: id });
        res.render("client/pages/user/info", {
            pageTitle: "Thông tin người dùng",
            myUser: user
        });
    }
    catch (error) {
        req.flash("error", "Error!");
        res.redirect("back");
    }
});
exports.userInfo = userInfo;
const editInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ _id: req.params.id }).select("-password");
    res.render("client/pages/user/edit", {
        pageTitle: "Chỉnh sửa thông tin",
        user: user,
    });
});
exports.editInfo = editInfo;
const editInfoPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        yield user_model_1.default.updateOne({ _id: id }, req.body);
        req.flash("success", "Cập nhật thông tin thành công!");
    }
    catch (error) {
        req.flash("error", "Cập nhật thông tin thất bại!");
    }
    res.redirect(`/user/info/${id}`);
});
exports.editInfoPatch = editInfoPatch;
