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
exports.search = void 0;
const Community_1 = __importDefault(require("../models/Community"));
const Post_1 = require("../models/Post");
const schoolWork_1 = require("../models/schoolWork");
const User_1 = __importDefault(require("../models/User"));
const match_sorter_1 = require("match-sorter");
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queryTypes = Object.keys(req.query).filter((key) => {
        return key !== "keyword";
    });
    const searchString = req.query.keyword;
    const dbqueries = {
        user: User_1.default.find({
            $or: [{ "profile.fullName": { $regex: searchString, $options: "i" } }]
        }).select("-__v -createdAt -updatedAt -profile.education +profile.picture -profile.dob -email -fullName -role -profile.communities"),
        community: Community_1.default.find({
            $or: [
                { name: { $regex: searchString, $options: "i" } },
                { description: { $regex: searchString, $options: "i" } }
            ]
        })
            .select("-__v -updatedAt -members")
            .populate({ path: "admin", select: "profile.fullName profile.picture" }),
        post: Post_1.PostModel.find({
            $or: [{ body: { $regex: searchString, $options: "i" } }]
        })
            .select("-media -comments -upvoteBy -__v -updatedAt")
            .populate({ path: "author", select: "profile.fullName profile.picture" }),
        schoolWork: schoolWork_1.SchoolWork.find({
            $or: [
                { title: { $regex: searchString, $options: "i" } },
                { description: { $regex: searchString, $options: "i" } }
            ]
        }).populate({
            path: "userID",
            select: "profile.fullName profile.picture"
        })
    };
    let types;
    if (queryTypes.length === 0) {
        types = Object.keys(dbqueries);
    }
    else {
        types = queryTypes;
    }
    let dbData = new Array();
    for (const type of types) {
        let items = yield dbqueries[type];
        items = items.map((item) => (Object.assign(Object.assign({}, item.toObject()), { type: type })));
        dbData.push(...items);
    }
    (0, match_sorter_1.matchSorter)(dbData, searchString === null || searchString === void 0 ? void 0 : searchString.toString(), {
        keys: ["profile.fullName", "name", "body", "title", "description"]
    });
    return res.status(200).json(dbData);
});
exports.search = search;
