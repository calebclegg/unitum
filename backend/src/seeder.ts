import users from "./data/users";
import { communities } from "./data/community";
import { posts } from "./data/posts";
import User, { Education } from "./models/User";
import { Chat, Message } from "./models/Chat";
import { chats, messages } from "./data/chat";
import { education } from "./data/users";
import CommunityModel from "./models/Community";
import { CommentModel, PostModel } from "./models/Post";
import connectDB from "./config/db";
import { config } from "dotenv-flow";
import { SchoolWork } from "./models/schoolWork";

config();
const db = connectDB();

export const importData = async () => {
  try {
    await User.deleteMany();
    await CommunityModel.deleteMany();
    await PostModel.deleteMany();
    await CommentModel.deleteMany();
    await Education.deleteMany();
    await SchoolWork.deleteMany();
    await Chat.deleteMany();
    await Message.deleteMany();

    const createdUsers = await User.insertMany(users);

    let i = 0;
    const communitiesL = communities.map((community) => {
      const comm = { ...community, admin: createdUsers[i]._id };
      i++;
      return comm;
    });

    const savedCommunities = await CommunityModel.insertMany(communitiesL);

    const user = createdUsers[0];
    user.profile?.communities?.push(savedCommunities[1]._id);
    await user.save();

    let k = 0;
    const postL = posts.map((post) => {
      const pos = { ...post, author: createdUsers[k]._id };
      k++;
      return pos;
    });
    console.log("chatL");

    const savedPosts = await PostModel.insertMany(postL);
    let j = 0;
    const chatL = chats.map((chat) => {
      console.log("chatL");
      const chatObj = {
        ...chat,
        participant: [createdUsers[j]._id, createdUsers[j + 1]._id]
      };
      j++;
      console.log("chatL");
      return chatObj;
    });

    const savedChats = await Chat.insertMany(chatL);

    let l = 0;
    const messageL = messages.map((message) => {
      const messageObj = {
        ...message,
        from: savedChats[0].participant[0],
        to: savedChats[0].participant[1],
        chatID: savedChats[0]._id
      };
      return messageObj;
    });

    const savedMessages = await Message.insertMany(messageL);
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
    await CommentModel.deleteMany();
    await Education.deleteMany();
    await SchoolWork.deleteMany();

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
