import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users";
import { communities } from "./data/community";
import User from "./models/User"
import CommunityModel from "./models/Community";
import { PostModel } from "./models/Post"
import connectDB from "./config/db.js";

export const importData = async () => {
  console.log("Importing data ...")
  try {
    await User.deleteMany();
    await CommunityModel.deleteMany();
    await PostModel.deleteMany();

    const createdUsers = await User.insertMany(users);

    const communitiesL = communities.map((community) => {
        let i = 0
        const comm = { ...community, admin: createdUsers[i]._id }
        i++
      return comm;
    });

    const savedCommunities = await CommunityModel.insertMany(communitiesL);


    console.log("Data Imported!");
  } catch (error) {
    console.error(`${error}`);
  }
};

export const destroyData = async () => {
  try {
    await User.deleteMany();
    await CommunityModel.deleteMany();
    await PostModel.deleteMany();

    console.log("Data Destroyed!");
  } catch (error) {
    console.error(`${error}`);
  }
};

export const runSeeder = async () => {
  if (process.env.NODE_ENV === "development") {
    await importData()
  }
}
// if (process.argv[2] === "-d") {
//   destroyData();
// } else {
//   importData();
// }