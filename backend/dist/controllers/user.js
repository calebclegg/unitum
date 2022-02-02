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
exports.deleteNotification = exports.getUnreadNotifications = exports.deleteSchoolwork = exports.updateSchoolwork = exports.newSchoolWork = exports.deleteEducation = exports.editEducation = exports.addNewEducation = exports.getEducation = exports.updateUserInfo = exports.userInfo = void 0;
const mongoose_1 = require("mongoose");
const schoolWork_1 = require("../models/schoolWork");
const User_1 = __importDefault(require("../models/User"));
const User_2 = require("../models/User");
const Notification_1 = require("../models/Notification");
const schoolWork_validator_1 = require("../validators/schoolWork.validator");
const user_validator_1 = require("../validators/user.validator");
// interface IReq extends Request {
//   user: Document<any, any, IUser> &
//     IUser & {
//       _id: Types.ObjectId;
//     };
// }
const userInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customRequest = req;
    try {
        const user = yield User_1.default.findOne({ _id: customRequest.user._id })
            .select("-role -fullName -__v -createdAt -updatedAt")
            .populate([
            {
                path: "profile.schoolWork",
                select: "-__v -userID -updatedAt"
            },
            { path: "profile.communities", select: "-__v -updatedAt -members" },
            { path: "profile.education", select: "-__v -updatedAt -user" }
        ]);
        return res.status(200).json(user);
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.userInfo = userInfo;
const updateUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customRequest = req;
    const user = customRequest.user;
    const valData = yield (0, user_validator_1.validateUserUpdate)(customRequest.body);
    let errors;
    if (valData.error) {
        errors = valData.error.details.map((error) => {
            var _a;
            return ({
                label: (_a = error.context) === null || _a === void 0 ? void 0 : _a.label,
                message: error.message
            });
        });
        return res
            .status(400)
            .json({ message: "Some fields are invalid/required", errors: errors });
    }
    Object.entries(valData.value.profile).forEach(([key, value]) => {
        user.profile[key] = value;
    });
    yield user.save();
    return res.sendStatus(200);
});
exports.updateUserInfo = updateUserInfo;
const getEducation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const edID = req.params.edID;
    try {
        const education = yield User_2.Education.findOne({ _id: edID }).populate({
            path: "user",
            select: "-__v -updatedAt -createdAt -role -fullName -profile.dob -profile.communities -profile.education -profile.schoolWork -profile.unicoyn"
        });
        if (!education)
            return res.status(404).json({ message: "Education not found" });
        return res.status(200).json(education);
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.getEducation = getEducation;
const addNewEducation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const valData = yield (0, user_validator_1.validateEducationData)(req.body);
    let errors;
    if (valData.error) {
        errors = valData.error.details.map((error) => {
            var _a;
            return ({
                label: (_a = error.context) === null || _a === void 0 ? void 0 : _a.label,
                message: error.message
            });
        });
        return res
            .status(400)
            .json({ message: "Some fields are invalid/required", errors: errors });
    }
    try {
        const newEducation = yield new User_2.Education(Object.assign(Object.assign({}, valData.value), { user: req.user._id })).save();
        const user = yield User_1.default.findOne({ _id: req.user._id });
        (_b = (_a = user === null || user === void 0 ? void 0 : user.profile) === null || _a === void 0 ? void 0 : _a.education) === null || _b === void 0 ? void 0 : _b.push(newEducation._id);
        yield (user === null || user === void 0 ? void 0 : user.save());
        return res.status(201).json(newEducation);
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.addNewEducation = addNewEducation;
const editEducation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const valData = yield (0, user_validator_1.validateEducationEditData)(req.body);
    const edID = new mongoose_1.Types.ObjectId(req.params.edID);
    let errors;
    if (valData.error) {
        errors = valData.error.details.map((error) => {
            var _a;
            return ({
                label: (_a = error.context) === null || _a === void 0 ? void 0 : _a.label,
                message: error.message
            });
        });
        return res
            .status(400)
            .json({ message: "Some fields are invalid/required", errors: errors });
    }
    try {
        const updatedEducation = yield User_2.Education.findOneAndUpdate({ _id: edID, user: req.user._id }, valData.value, { new: true });
        if (!updatedEducation)
            return res.status(404).json({
                message: "Couldn't find education details tha belonged to you"
            });
        return res.sendStatus(200);
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.editEducation = editEducation;
const deleteEducation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const edID = new mongoose_1.Types.ObjectId(req.params.edID);
    try {
        const edu = yield User_2.Education.findOne({ _id: edID, user: req.user._id });
        if (!edu)
            return res.status(404).json({
                message: "Couldn't find education details tha belonged to you"
            });
        yield edu.delete();
        return res.sendStatus(200);
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.deleteEducation = deleteEducation;
const newSchoolWork = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const valData = yield (0, schoolWork_validator_1.validateSchoolWorkData)(Object.assign({ userID: user._id.toString() }, req.body));
    let errors;
    if (valData.error) {
        errors = valData.error.details.map((error) => {
            var _a;
            return ({
                label: (_a = error.context) === null || _a === void 0 ? void 0 : _a.label,
                message: error.message
            });
        });
        return res
            .status(400)
            .json({ message: "Some fields are invalid/required", errors: errors });
    }
    try {
        const newWork = yield new schoolWork_1.SchoolWork(valData.value).save();
        user.profile.schoolWork.push(newWork._id);
        user.profile.unicoyn += 1;
        user.save();
        return res.status(201).json(newWork);
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.newSchoolWork = newSchoolWork;
const updateSchoolwork = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const workID = req.params.workID;
    const valData = yield (0, schoolWork_validator_1.validateEditSchoolWorkData)(req.body);
    let errors;
    if (valData.error) {
        errors = valData.error.details.map((error) => {
            var _a;
            return ({
                label: (_a = error.context) === null || _a === void 0 ? void 0 : _a.label,
                message: error.message
            });
        });
        return res
            .status(400)
            .json({ message: "Some fields are invalid/required", errors: errors });
    }
    try {
        const work = yield schoolWork_1.SchoolWork.findOneAndUpdate({ _id: workID, userID: user._id }, valData.value, { new: true });
        if (!work)
            return res.status(404).json({ message: "School work not found" });
        return res.status(200).json(work);
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.updateSchoolwork = updateSchoolwork;
const deleteSchoolwork = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const user = req.user;
    const workID = req.params.workID;
    try {
        const work = yield schoolWork_1.SchoolWork.findOne({ _id: workID });
        if (!work)
            return res.status(404).json({ message: "School work not found" });
        if (!((_c = work.userID) === null || _c === void 0 ? void 0 : _c.toString()) !== user._id.toString())
            return res.sendStatus(401);
        work.delete();
        const newWorkIDs = user.profile.schoolWork.filter((id) => {
            id.toString() !== workID.toString();
        });
        user.profile.shoolWork = newWorkIDs;
        if (newWorkIDs.length > 0) {
            user.profile.unicoyn -= 1;
        }
        user.save();
        return res.sendStatus(200);
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.deleteSchoolwork = deleteSchoolwork;
const getUnreadNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notifications = yield Notification_1.Notification.find({
        userID: req.user._id
    })
        .select("-__v -updatedAt")
        .populate([
        {
            path: "user",
            select: "-fullName -role -__v -profile.communities -profile.education -profile.schoolWork"
        },
        {
            path: "community",
            select: "-__v -updatedAt -members"
        },
        {
            path: "post",
            select: "-__v -upvoteBy"
        }
    ]);
    return res.status(200).json(notifications);
});
exports.getUnreadNotifications = getUnreadNotifications;
const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const notificationIDs = req.query.notIDs;
    try {
        if (Array.isArray(notificationIDs)) {
            yield Notification_1.Notification.findByIdAndDelete({
                _id: { $in: notificationIDs },
                userID: user._id
            });
        }
        else {
            yield Notification_1.Notification.findByIdAndDelete({
                _id: notificationIDs,
                userID: user._id
            });
        }
        return res.sendStatus(200);
    }
    catch (error) {
        res.sendStatus(500);
    }
});
exports.deleteNotification = deleteNotification;
