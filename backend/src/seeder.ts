import users from "./data/users";
import { communities } from "./data/community";
import User from "./models/User"
import CommunityModel from "./models/Community";
import { PostModel } from "./models/Post"
import connectDB from "./config/db";
import { config } from "dotenv-flow";

config()
const db = connectDB()

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
    (await db).connection.close()
    process.exit()
  } catch (error) {
    console.error(`${error}`);
    (await db).connection.close()
    process.exit(1)
  }
};

export const destroyData = async () => {
  try {
    await User.deleteMany();
    await CommunityModel.deleteMany();
    await PostModel.deleteMany();

    console.log("Data Destroyed!");
    (await db).connection.close()
    process.exit()
  } catch (error) {
    console.error(`${error}`);
    (await db).connection.close()
    process.exit(1)
  }
};

export const runSeeder = async () => {
  if (process.env.NODE_ENV === "development") {
    await importData()
  }
}
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}