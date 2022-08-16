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
exports.getOtherCommunities = exports.joinCommunity = exports.getJoinRequests = exports.leaveCommunity = exports.removeMember = exports.addMember = exports.getCommunityMembers = exports.searchCommunity = exports.deleteCommunity = exports.viewCommunity = exports.editCommunity = exports.createCommunity = void 0;
const community_validator_1 = require("../validators/community.validator");
const Community_1 = __importDefault(require("../models/Community"));
const mongoose_1 = require("mongoose");
const User_1 = __importDefault(require("../models/User"));
const notification_1 = require("../utils/notification");
const CommRequest_1 = require("../models/CommRequest");
const Post_1 = require("../models/Post");
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
    const newCommunity = new Community_1.default(Object.assign(Object.assign({ admin: user._id }, valData.value), { members: [
            {
                info: user._id,
                role: "admin"
            }
        ], numberOfMembers: 1 }));
    const savedCommunity = yield newCommunity.save();
    user.profile.communities.push(savedCommunity._id);
    yield user.save();
    return res.status(201).json(savedCommunity);
});
exports.createCommunity = createCommunity;
const editCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = req.user;
    const commID = new mongoose_1.Types.ObjectId(req.params.commID);
    const dbCommunity = yield Community_1.default.findById({
        _id: commID
    });
    if (!dbCommunity)
        return res.status(404).json({ message: "Community not found" });
    if (dbCommunity.admin.toString() !== user._id.toString())
        return res.sendStatus(401);
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
    const updatedCommunity = yield Community_1.default.findByIdAndUpdate({ _id: commID }, valData.value, { new: true });
    res.status(200).json(updatedCommunity);
    const admin = yield User_1.default.findOne({ _id: dbCommunity.admin._id }).select("profile.fullName");
    const notification = {
        message: `${(_a = admin === null || admin === void 0 ? void 0 : admin.profile) === null || _a === void 0 ? void 0 : _a.fullName} updated ${dbCommunity.name} community`,
        type: "community",
        user: dbCommunity.admin._id,
        community: dbCommunity._id
    };
    yield (0, notification_1.sendNotification)(notification, dbCommunity._id);
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
    const communityPostCount = yield Post_1.PostModel.find({
        communityID: dbCommunity._id
    }).count();
    return res
        .status(200)
        .json(Object.assign(Object.assign({}, dbCommunity.toObject()), { postCount: communityPostCount }));
});
exports.viewCommunity = viewCommunity;
const deleteCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commID = new mongoose_1.Types.ObjectId(req.params.commID);
    const community = yield Community_1.default.findById(commID);
    if (!community)
        return res.sendStatus(404);
    if (community.admin.toString() !== req.user._id.toString())
        return res.sendStatus(403);
    yield (community === null || community === void 0 ? void 0 : community.delete());
    return res.sendStatus(200);
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
const getCommunityMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const communityID = req.params.commID;
    const limit = +req.query.limit || 20;
    const skip = +req.query.skip || 0;
    const dbCommunity = yield Community_1.default.findById(communityID)
        .select(["-__v", "-updatedAt"])
        .populate([
        {
            path: "members.info",
            select: "profile.fullName profile.picture"
        }
    ]);
    if (!dbCommunity)
        return res.status(404).json({ message: "Community not found" });
    const memebers = (_b = dbCommunity.members) === null || _b === void 0 ? void 0 : _b.slice(skip, skip + limit);
    return res.json(memebers);
});
exports.getCommunityMembers = getCommunityMembers;
const addMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f, _g;
    const commID = req.params.commID;
    const requestID = req.body.requestID;
    const action = req.query.action;
    if (!requestID) {
        return res.status(400).json({ message: "requestID is required" });
    }
    if (action === "reject") {
        yield CommRequest_1.JoinCommunity.findOneAndDelete({ _id: requestID });
        return res.sendStatus(200);
    }
    const request = yield CommRequest_1.JoinCommunity.findOne({
        _id: requestID
    }).populate({
        path: "community",
        select: "name admin"
    });
    if (!request)
        return res.status(404).json({ message: "request with this Id not found" });
    const community = yield Community_1.default.findOne({ _id: commID });
    if (!community)
        return res.status(404).json({ message: "Community not found" });
    if (request.community.admin.toString() !== req.user._id.toString())
        return res.status(401).json({
            message: "You are unauthorized to add user to this community"
        });
    const isMember = (_c = community.members) === null || _c === void 0 ? void 0 : _c.some((member) => {
        var _a;
        return (_a = member === null || member === void 0 ? void 0 : member.info) === null || _a === void 0 ? void 0 : _a.equals(requestID);
    });
    if (isMember)
        return res
            .status(200)
            .json({ message: "User is already a member of this community" });
    const user = yield User_1.default.findById(request.user._id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    (_e = (_d = user.profile) === null || _d === void 0 ? void 0 : _d.communities) === null || _e === void 0 ? void 0 : _e.push(community._id);
    (_f = community.members) === null || _f === void 0 ? void 0 : _f.push({ info: requestID, role: "member" });
    community.numberOfMembers += 1;
    user.save();
    community.save();
    yield request.delete();
    res.status(200).json({ message: "New Member has been added successfully" });
    const admin = yield User_1.default.findOne({ _id: community.admin._id }).select("profile.fullName");
    const notification = {
        message: `${(_g = admin === null || admin === void 0 ? void 0 : admin.profile) === null || _g === void 0 ? void 0 : _g.fullName} added you to ${community.name}`,
        type: "community",
        user: community.admin._id,
        community: community._id,
        userID: user._id
    };
    yield (0, notification_1.sendNotification)(notification, user._id);
});
exports.addMember = addMember;
const removeMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j, _k, _l, _m;
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
    const isMember = (_h = community.members) === null || _h === void 0 ? void 0 : _h.some((member) => {
        var _a;
        return (_a = member === null || member === void 0 ? void 0 : member.info) === null || _a === void 0 ? void 0 : _a.equals(user === null || user === void 0 ? void 0 : user._id);
    });
    if (!isMember)
        return res
            .status(400)
            .json({ message: "User is not a member of this community" });
    const newMemberList = (_j = community.members) === null || _j === void 0 ? void 0 : _j.filter((member) => {
        var _a;
        return ((_a = member.info) === null || _a === void 0 ? void 0 : _a.toString()) !== (user === null || user === void 0 ? void 0 : user._id.toString());
    });
    const newCommunityList = (_l = (_k = user === null || user === void 0 ? void 0 : user.profile) === null || _k === void 0 ? void 0 : _k.communities) === null || _l === void 0 ? void 0 : _l.filter((comm) => {
        return comm.toString() !== community._id.toString();
    });
    community.members = newMemberList;
    if ((_m = user === null || user === void 0 ? void 0 : user.profile) === null || _m === void 0 ? void 0 : _m.communities) {
        user.profile.communities = newCommunityList;
    }
    community.save();
    user === null || user === void 0 ? void 0 : user.save();
    return res.sendStatus(200);
});
exports.removeMember = removeMember;
const leaveCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _o, _p, _q, _r, _s;
    const commID = req.params.commID;
    const userID = req.user._id;
    const user = yield User_1.default.findOne({ _id: userID });
    const community = yield Community_1.default.findOne({ _id: commID });
    if (!community)
        return res.status(404).json({ message: "Community not found" });
    if (community.admin.toString() === userID.toString())
        return res.status(403).json({ message: "You cannot leave this community" });
    const isMember = (_o = community.members) === null || _o === void 0 ? void 0 : _o.some((member) => {
        var _a;
        return (_a = member === null || member === void 0 ? void 0 : member.info) === null || _a === void 0 ? void 0 : _a.equals(user === null || user === void 0 ? void 0 : user._id.toString());
    });
    if (!isMember)
        return res
            .status(400)
            .json({ message: "You are not a member of this community" });
    const newMemberList = (_p = community.members) === null || _p === void 0 ? void 0 : _p.filter((member) => {
        return member.info.toString() !== (user === null || user === void 0 ? void 0 : user._id.toString());
    });
    const newCommunityList = (_r = (_q = user === null || user === void 0 ? void 0 : user.profile) === null || _q === void 0 ? void 0 : _q.communities) === null || _r === void 0 ? void 0 : _r.filter((comm) => {
        return comm._id.toString() !== community._id.toString();
    });
    community.members = newMemberList;
    if ((_s = user === null || user === void 0 ? void 0 : user.profile) === null || _s === void 0 ? void 0 : _s.communities) {
        user.profile.communities = newCommunityList;
    }
    community.save();
    user === null || user === void 0 ? void 0 : user.save();
    return res.sendStatus(200);
});
exports.leaveCommunity = leaveCommunity;
const getJoinRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const commID = req.params.commID;
    const community = yield Community_1.default.findOne({ _id: commID });
    if (!community)
        return res.status(404).json({ message: "Community not found" });
    if (community.admin.toString() !== user._id.toString()) {
        return res.status(401).json({ message: "You are unauthorized" });
    }
    const requests = yield CommRequest_1.JoinCommunity.find({ community: commID }).populate([
        { path: "community", select: "name picture description" },
        { path: "user", select: "profile.fullName profile.picture" }
    ]);
    console.log(requests);
    return res.json(requests);
});
exports.getJoinRequests = getJoinRequests;
const joinCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _t;
    const user = req.user;
    const commID = req.params.commID;
    const community = yield Community_1.default.findOne({ _id: commID });
    if (!community)
        return res.status(404).json({ message: "Community not found" });
    const isMember = (_t = community.members) === null || _t === void 0 ? void 0 : _t.some((member) => {
        var _a;
        return (_a = member === null || member === void 0 ? void 0 : member.info) === null || _a === void 0 ? void 0 : _a.equals(user === null || user === void 0 ? void 0 : user._id);
    });
    if (isMember)
        return res
            .status(200)
            .json({ message: "You are member of this community" });
    yield new CommRequest_1.JoinCommunity({
        community: community._id,
        user: user._id
    }).save();
    return res.sendStatus(200);
});
exports.joinCommunity = joinCommunity;
const getOtherCommunities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
});
exports.getOtherCommunities = getOtherCommunities;
