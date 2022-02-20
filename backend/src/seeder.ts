import users from "./data/users";
import { communities } from "./data/community";
import { posts } from "./data/posts";
import User, { Education } from "./models/User";
import { Chat, Message } from "./models/Chat";
import { chats, messages } from "./data/chat";
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
      const comm = {
        ...community,
        admin: createdUsers[i]._id,
        members: [
          {
            info: createdUsers[i]._id,
            role: "admin"
          }
        ],
        numberOfMembers: 1
      };
      i++;
      return comm;
    });

    const savedCommunities = await CommunityModel.insertMany(communitiesL);

    let l = 0;
    for (const community of savedCommunities) {
      const user = createdUsers[l];
      user.profile?.communities?.push(community._id);
      await user?.save();
      l++;
    }

    let k = 0;
    const postL = posts.map((post) => {
      const pos = { ...post, author: createdUsers[k]._id };
      k++;
      return pos;
    });

    await PostModel.insertMany(postL);
    let j = 0;
    const chatL = chats.map((chat) => {
      const chatObj = {
        ...chat,
        participant: [createdUsers[j]._id, createdUsers[j + 1]._id]
      };
      j++;
      return chatObj;
    });

    const savedChats = await Chat.insertMany(chatL);

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

    const chat = savedChats[0];
    for (const message of savedMessages) {
      chat.messages?.push(message._id);
    }
    await chat.save();
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
