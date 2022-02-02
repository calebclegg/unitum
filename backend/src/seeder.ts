import users from "./data/users";
import { communities } from "./data/community";
import { posts } from "./data/posts";
import User, { Education } from "./models/User";
import { education } from "./data/users";
import CommunityModel from "./models/Community";
import { PostModel } from "./models/Post";
import connectDB from "./config/db";
import { config } from "dotenv-flow";

config();
const db = connectDB();

export const importData = async () => {
  try {
    await User.deleteMany();
    await CommunityModel.deleteMany();
    await PostModel.deleteMany();

    // const educations = await Education.insertMany(education);

    // users.forEach((user) => {
    //   return (user.profile.education = [educations[0]._id]);
    // });
    const createdUsers = await User.insertMany(users);

    let i = 0;
    const communitiesL = communities.map((community) => {
      const comm = { ...community, admin: createdUsers[i]._id };
      i++;
      return comm;
    });

    const savedCommunities = await CommunityModel.insertMany(communitiesL);

    const postL = posts.map((post) => {
      let i = 0;
      const pos = { ...post, author: createdUsers[i]._id };
      i++;
      return pos;
    });

    const savedPosts = await PostModel.insertMany(postL);

    (await db).connection.close();
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    (await db).connection.close();
    process.exit(1);
  }
};

export const destroyData = async () => {
  try {
    await User.deleteMany();
    await CommunityModel.deleteMany();
    await PostModel.deleteMany();

    (await db).connection.close();
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    (await db).connection.close();
    process.exit(1);
  }
};

export const runSeeder = async () => {
  if (process.env.NODE_ENV === "development") {
    await importData();
  }
};
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
