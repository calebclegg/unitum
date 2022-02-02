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
exports.leaveCommunity = exports.removeMember = exports.addMember = exports.searchCommunity = exports.deleteCommunity = exports.viewCommunity = exports.editCommunity = exports.createCommunity = void 0;
const community_validator_1 = require("../validators/community.validator");
const Community_1 = __importDefault(require("../models/Community"));
const mongoose_1 = require("mongoose");
const User_1 = __importDefault(require("../models/User"));
const notification_1 = require("../utils/notification");
const createCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const valData = yield (0, community_validator_1.validateCommCreateData)(req.body);
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
    const newCommunity = new Community_1.default(Object.assign({ admin: user._id }, valData.value));
    try {
        const savedCommunity = yield newCommunity.save();
        user.profile.communities.push(savedCommunity._id);
        user.save();
        return res.status(201).json(savedCommunity);
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.createCommunity = createCommunity;
const editCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = req.user;
    const commID = new mongoose_1.Types.ObjectId(req.params.commID);
    const dbCommunity = yield Community_1.default.findById({
        _id: commID
    }).populate({ path: "admin", select: "profile.fullName" });
    if (!dbCommunity)
        return res.status(404).json({ message: "Community not found" });
    if (dbCommunity.admin.toString() !== user._id.toString())
        return res.sendStatus(403);
    const valData = yield (0, community_validator_1.validateCommEditData)(req.body);
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
        const updatedCommunity = yield Community_1.default.findByIdAndUpdate({ _id: commID }, valData.value, { new: true });
        res.status(200).json(updatedCommunity);
        const admin = yield User_1.default.findOne({ _id: dbCommunity.admin._id }).select("profile.fullName");
        const notification = {
            message: `${(_a = admin === null || admin === void 0 ? void 0 : admin.profile) === null || _a === void 0 ? void 0 : _a.fullName} updated ${dbCommunity.name} community`,
            type: "community",
            user: dbCommunity.admin._id,
            community: dbCommunity._id
        };
        yield (0, notification_1.sendNotification)(req.socket, notification, dbCommunity._id);
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.editCommunity = editCommunity;
const viewCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commID = new mongoose_1.Types.ObjectId(req.params.commID);
    const dbCommunity = yield Community_1.default.findById(commID)
        .select(["-__v", "-updatedAt"])
        .populate([
        {
            path: "admin",
            select: ["profile.fullName", "email", "profile.picture"]
        },
        {
            path: "members.info",
            select: "-fullName -role -profile.dob -profile.communities -profile.schoolWork -profile.education -__v"
        }
    ]);
    if (!dbCommunity)
        return res.status(404).json({ message: "Community not found" });
    return res.status(200).json(dbCommunity);
});
exports.viewCommunity = viewCommunity;
const deleteCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commID = new mongoose_1.Types.ObjectId(req.params.commID);
    const community = yield Community_1.default.findById(commID);
    if (!community)
        return res.sendStatus(404);
    if (community && community._id.toString() !== req.user._id.toString())
        return res.sendStatus(403);
    try {
        yield (community === null || community === void 0 ? void 0 : community.delete());
        return res.sendStatus(200);
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.deleteCommunity = deleteCommunity;
const searchCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const communityName = req.query.search;
    const limit = req.query.limit || 10;
    const skip = req.query.offset || 0;
    let communities;
    if (!communityName) {
        communities = yield Community_1.default.find({})
            .skip(skip)
            .limit(limit)
            .populate({
            path: "admin",
            select: ["profile.fullName", "email", "profile.picture"]
        })
            .select("-members -__v -updatedAt");
    }
    else {
        communities = yield Community_1.default.find({
            $text: { $search: communityName }
        })
            .skip(skip)
            .limit(limit)
            .populate({
            path: "admin",
            select: ["profile.fullName", "email", "profile.picture"]
        })
            .select("-members -__v -updatedAt");
    }
    if (!communities)
        return res.sendStatus(404);
    return res.status(200).json(communities);
});
exports.searchCommunity = searchCommunity;
const addMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e, _f;
    const commID = req.params.commID;
    const userID = req.body.userID;
    if (!userID) {
        return res.status(400).json({ message: "userID is required" });
    }
    const user = yield User_1.default.findOne({ _id: userID });
    if (!user)
        return res.status(404).json({ message: "User with this Id not found" });
    const community = yield Community_1.default.findOne({ _id: commID });
    if (!community)
        return res.status(404).json({ message: "Community not found" });
    if (community.admin.toString() !== req.user._id.toString())
        return res
            .status(401)
            .json({ message: "You are unauthorized to add user to this community" });
    const isMember = (_b = community.members) === null || _b === void 0 ? void 0 : _b.some((member) => {
        var _a;
        return (_a = member === null || member === void 0 ? void 0 : member.info) === null || _a === void 0 ? void 0 : _a.equals(userID);
    });
    if (isMember)
        return res
            .status(200)
            .json({ message: "User is already a member of this community" });
    (_d = (_c = user.profile) === null || _c === void 0 ? void 0 : _c.communities) === null || _d === void 0 ? void 0 : _d.push(community._id);
    (_e = community.members) === null || _e === void 0 ? void 0 : _e.push({ info: userID, role: "member" });
    community.numberOfMembers += 1;
    try {
        user.save();
        community.save();
        res.status(200).json({ message: "New Member has been added successfully" });
        const admin = yield User_1.default.findOne({ _id: community.admin._id }).select("profile.fullName");
        const notification = {
            message: `${(_f = admin === null || admin === void 0 ? void 0 : admin.profile) === null || _f === void 0 ? void 0 : _f.fullName} added you to ${community.name}`,
            type: "community",
            user: community.admin._id,
            community: community._id,
            userID: user._id
        };
        yield (0, notification_1.sendNotification)(req.socket, notification, user._id);
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.addMember = addMember;
const removeMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h, _j, _k, _l;
    const commID = req.params.commID;
    const userID = req.body.userID;
    if (!userID)
        return res.status(400).json({ message: "userID is required" });
    const user = yield User_1.default.findOne({ _id: userID });
    const community = yield Community_1.default.findOne({ _id: commID });
    if (!community)
        return res.status(404).json({ message: "Community not found" });
    if (!(community.admin._id.toString() === req.user._id.toString()))
        return res.status(401).json({
            message: "You are unauthorized to remove a member from this community"
        });
    const isMember = (_g = community.members) === null || _g === void 0 ? void 0 : _g.some((member) => {
        var _a;
        return (_a = member === null || member === void 0 ? void 0 : member.info) === null || _a === void 0 ? void 0 : _a.equals(user === null || user === void 0 ? void 0 : user._id);
    });
    if (!isMember)
        return res
            .status(400)
            .json({ message: "User is not a member of this community" });
    const newMemberList = (_h = community.members) === null || _h === void 0 ? void 0 : _h.filter((member) => {
        var _a;
        return ((_a = member.info) === null || _a === void 0 ? void 0 : _a.toString()) !== (user === null || user === void 0 ? void 0 : user._id.toString());
    });
    const newCommunityList = (_k = (_j = user === null || user === void 0 ? void 0 : user.profile) === null || _j === void 0 ? void 0 : _j.communities) === null || _k === void 0 ? void 0 : _k.filter((comm) => {
        return comm.toString() !== community._id.toString();
    });
    community.members = newMemberList;
    if ((_l = user === null || user === void 0 ? void 0 : user.profile) === null || _l === void 0 ? void 0 : _l.communities) {
        user.profile.communities = newCommunityList;
    }
    try {
        community.save();
        user.save();
        return res.sendStatus(200);
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.removeMember = removeMember;
const leaveCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _m, _o, _p, _q, _r;
    const commID = req.params.commID;
    const userID = req.user._id;
    const user = yield User_1.default.findOne({ _id: userID });
    const community = yield Community_1.default.findOne({ _id: commID });
    if (!community)
        return res.status(404).json({ message: "Community not found" });
    const isMember = (_m = community.members) === null || _m === void 0 ? void 0 : _m.some((member) => {
        var _a;
        return (_a = member === null || member === void 0 ? void 0 : member.info) === null || _a === void 0 ? void 0 : _a.equals(user === null || user === void 0 ? void 0 : user._id.toString());
    });
    if (!isMember)
        return res
            .status(400)
            .json({ message: "You are not a member of this community" });
    const newMemberList = (_o = community.members) === null || _o === void 0 ? void 0 : _o.filter((member) => {
        return member.info.toString() !== (user === null || user === void 0 ? void 0 : user._id.toString());
    });
    const newCommunityList = (_q = (_p = user === null || user === void 0 ? void 0 : user.profile) === null || _p === void 0 ? void 0 : _p.communities) === null || _q === void 0 ? void 0 : _q.filter((comm) => {
        return comm._id.toString() !== community._id.toString();
    });
    community.members = newMemberList;
    if ((_r = user === null || user === void 0 ? void 0 : user.profile) === null || _r === void 0 ? void 0 : _r.communities) {
        user.profile.communities = newCommunityList;
    }
    try {
        community.save();
        user.save();
        return res.sendStatus(200);
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.leaveCommunity = leaveCommunity;
