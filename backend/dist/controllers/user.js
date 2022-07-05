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
exports.getUserCommunities = exports.getUserPosts = exports.markAllAsRead = exports.deleteNotification = exports.getUnreadNotifications = exports.deleteSchoolwork = exports.updateSchoolwork = exports.newSchoolWork = exports.getUserSchoolWork = exports.editEducation = exports.followUser = exports.unfollowUser = exports.updateUserInfo = exports.userInfo = void 0;
const schoolWork_1 = require("../models/schoolWork");
const User_1 = __importDefault(require("../models/User"));
const Notification_1 = require("../models/Notification");
const schoolWork_validator_1 = require("../validators/schoolWork.validator");
const user_validator_1 = require("../validators/user.validator");
const Post_1 = require("../models/Post");
const SavedPost_1 = require("../models/SavedPost");
const userInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customRequest = req;
    const user = yield User_1.default.findOne({ _id: customRequest.user._id })
        .select("-role -fullName -__v -createdAt -updatedAt")
        .populate([
        {
            path: "profile.schoolWork",
            select: "-__v -userID -updatedAt"
        },
        { path: "profile.communities", select: "-__v -updatedAt -members" },
        { path: "profile.followers", select: "fullname picture" },
        { path: "profile.following", select: "fullname picture" }
    ]);
    return res.status(200).json(user);
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
        const field = key;
        if (typeof value === "object") {
            Object.entries(value).forEach(([key, value]) => {
                user.profile[field][key] = value;
            });
        }
        else {
            user.profile[key] = value;
        }
    });
    console.log(user);
    yield user.save();
    return res.sendStatus(200);
});
exports.updateUserInfo = updateUserInfo;
const unfollowUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const userID = req.params.userID;
    console.log(userID);
    const user = yield User_1.default.findOne({ id: userID });
    if (!user)
        return res.status(404).json({ message: "User not found" });
    const following = (_b = (_a = user.profile) === null || _a === void 0 ? void 0 : _a.followers) === null || _b === void 0 ? void 0 : _b.some((id) => {
        return id.equals(req.user._id);
    });
    if (!following)
        return res.sendStatus(200);
    const newFollowersList = (_c = user.profile.followers) === null || _c === void 0 ? void 0 : _c.filter((id) => {
        return id.toString() !== req.user._id.toString();
    });
    user.profile.followers = newFollowersList;
    user.profile.followersCount = newFollowersList.length;
    user.save();
    const user1 = req.user;
    const newFollowingList = (_d = user1.profile.following) === null || _d === void 0 ? void 0 : _d.filter((id) => {
        return id.toString() !== (user === null || user === void 0 ? void 0 : user._id.toString());
    });
    user1.profile.followingCount = newFollowingList.length;
    user1.save();
    return res.sendStatus(200);
});
exports.unfollowUser = unfollowUser;
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g, _h;
    const userID = req.params.userID;
    console.log(userID);
    const user = yield User_1.default.findOne({ id: userID });
    if (!user)
        return res.status(404).json({ message: "User not found" });
    const following = (_f = (_e = user.profile) === null || _e === void 0 ? void 0 : _e.followers) === null || _f === void 0 ? void 0 : _f.some((id) => {
        return id.equals(req.user._id);
    });
    if (following)
        return res.sendStatus(200);
    (_h = (_g = user.profile) === null || _g === void 0 ? void 0 : _g.followers) === null || _h === void 0 ? void 0 : _h.push(req.user._id);
    user.profile.followersCount += 1;
    user.save();
    const user1 = req.user;
    user1.profile.following.push(user._id);
    user1.profile.followingCount += 1;
    user1.save();
    return res.sendStatus(200);
});
exports.followUser = followUser;
// export const getEducation = async (req: any, res: Response) => {
//   const edID = req.params.edID;
//   const education = await Education.findOne({ _id: edID }).populate({
//     path: "user",
//     select:
//       "-__v -updatedAt -createdAt -role -fullName -profile.dob -profile.communities -profile.education -profile.schoolWork -profile.unicoyn"
//   });
//   if (!education)
//     return res.status(404).json({ message: "Education not found" });
//   return res.status(200).json(education);
// };
// export const addNewEducation = async (req: any, res: Response) => {
//   const valData = await validateEducationData(req.body);
//   let errors;
//   if (valData.error) {
//     errors = valData.error.details.map((error: any) => ({
//       label: error.context?.label,
//       message: error.message
//     }));
//     return res
//       .status(400)
//       .json({ message: "Some fields are invalid/required", errors: errors });
//   }
//   const newEducation = await new Education({
//     ...valData.value,
//     user: req.user._id
//   }).save();
//   const user = await User.findOne({ _id: req.user._id });
//   user?.profile?.education?.push(newEducation._id);
//   await user?.save();
//   return res.status(201).json(newEducation);
// };
const editEducation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    const user = req.user;
    console.log(req.body);
    const valData = yield (0, user_validator_1.validateEducationEditData)(req.body);
    console.log(valData.value);
    let errors;
    if (!((_j = user === null || user === void 0 ? void 0 : user.profile) === null || _j === void 0 ? void 0 : _j.education)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        user.profile.education = {
            school: {
                name: "",
                url: ""
            },
            degree: "",
            fieldOfStudy: "",
            startDate: new Date(),
            endDate: new Date(),
            grade: 0
        };
    }
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
    Object.entries(valData.value).forEach(([key, value]) => {
        var _a;
        const field = key;
        if (typeof value === "object") {
            Object.entries(value).forEach(([key, value]) => {
                var _a;
                ((_a = user.profile) === null || _a === void 0 ? void 0 : _a.education)[field][key] = value;
            });
        }
        else {
            ((_a = user.profile) === null || _a === void 0 ? void 0 : _a.education)[key] = value;
        }
    });
    console.log(user);
    yield user.save();
    return res.sendStatus(200);
});
exports.editEducation = editEducation;
// export const deleteEducation = async (req: any, res: Response) => {
//   const edID = new Types.ObjectId(req.params.edID);
//   const edu = await Education.findOne({ _id: edID, user: req.user._id });
//   if (!edu)
//     return res.status(404).json({
//       message: "Couldn't find education details tha belonged to you"
//     });
//   await edu.delete();
//   return res.sendStatus(200);
// };
const getUserSchoolWork = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const works = yield schoolWork_1.SchoolWork.find({ userID: user._id })
        .sort({
        createdAt: -1
    })
        .populate({ path: "userID", select: "profile.fullName profile.picture" });
    return res.json(works);
});
exports.getUserSchoolWork = getUserSchoolWork;
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
    const newWork = yield new schoolWork_1.SchoolWork(valData.value).save();
    user.profile.schoolWork.push(newWork._id);
    user.profile.unicoyn += 1;
    user.save();
    return res.status(201).json(newWork);
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
    const work = yield schoolWork_1.SchoolWork.findOneAndUpdate({ _id: workID, userID: user._id }, valData.value, { new: true });
    if (!work)
        return res.status(404).json({ message: "School work not found" });
    return res.status(200).json(work);
});
exports.updateSchoolwork = updateSchoolwork;
const deleteSchoolwork = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _k;
    const user = req.user;
    const workID = req.params.workID;
    const work = yield schoolWork_1.SchoolWork.findOne({ _id: workID });
    if (!work)
        return res.status(404).json({ message: "School work not found" });
    if (!((_k = work.userID) === null || _k === void 0 ? void 0 : _k.toString()) !== user._id.toString())
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
            select: "profile.fullName profile.picture"
        },
        {
            path: "community",
            select: "name"
        },
        {
            path: "post",
            select: "body"
        }
    ])
        .sort({ createdAt: -1 });
    return res.status(200).json(notifications);
});
exports.getUnreadNotifications = getUnreadNotifications;
const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const notificationID = req.params.notID;
    yield Notification_1.Notification.findByIdAndDelete({
        _id: notificationID,
        userID: user._id
    });
    return res.sendStatus(200);
});
exports.deleteNotification = deleteNotification;
const markAllAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    yield Notification_1.Notification.deleteMany({ userID: user._id });
    return res.sendStatus(200);
});
exports.markAllAsRead = markAllAsRead;
const getUserPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = +req.query.limit || 10;
    const skip = +req.query.skip || 0;
    const dbposts = yield Post_1.PostModel.find({ author: req.user._id })
        .sort("createdAt")
        .select("-comments")
        .populate([
        { path: "communityID", select: "-__v -members" },
        { path: "author", select: "profile.fullName profile.picture" }
    ])
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
    const savedPosts = yield SavedPost_1.SavedPost.findOne({ userID: req.user._id });
    const posts = dbposts.map((post) => {
        var _a, _b;
        const upvoted = (_a = post.upvoteBy) === null || _a === void 0 ? void 0 : _a.some((objectid) => {
            return objectid.equals(req.user._id);
        });
        const downvoted = (_b = post.downVoteBy) === null || _b === void 0 ? void 0 : _b.some((objectid) => {
            return objectid.equals(req.user._id);
        });
        let saved = false;
        if (savedPosts) {
            saved = savedPosts.posts.some((objectid) => {
                return objectid.equals(post._id);
            });
        }
        post = Object.assign(Object.assign({}, post.toObject()), { saved: saved, upvoted: upvoted, downvoted: downvoted });
        delete post.upvoteBy;
        delete post.downVoteBy;
        return post;
    });
    return res.json(posts);
});
exports.getUserPosts = getUserPosts;
const getUserCommunities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _l;
    const user = yield User_1.default.findOne({ _id: req.user._id }).populate({
        path: "profile.communities",
        select: "-__v -members",
        populate: {
            path: "admin",
            select: "profile.fullName profile.picture"
        }
    });
    const communities = (_l = user.profile) === null || _l === void 0 ? void 0 : _l.communities;
    return res.json(communities);
});
exports.getUserCommunities = getUserCommunities;
