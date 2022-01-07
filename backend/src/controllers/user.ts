import User from "../models/User";
import { IUSer } from "../types/user";
import { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  try {
    const { firstname, email, lastname, password, otherNames }: IUSer =
      req.body;

    const isExists = await User.findOne({ email });

    if (isExists) {
      res.status(403).json({ message: "User already exists" });
    } else {
      const user = await User.create({
        firstname,
        email,
        lastname,
        password,
        otherNames
      });
      return res.status(201).json({ message: "User created" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};
