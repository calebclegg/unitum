import { Request, Response } from "express";
import { Contact } from "../models/ContactUs";
import { validateContactCreateData } from "../validators/contact.validator";

export const newContact = async (req: any, res: Response) => {
  try {
    const { error, value } = await validateContactCreateData(req.body);
    let errors;
    if (error) {
      errors = error.details.map((error) => ({
        label: error.context?.label,
        message: error.message
      }));
      return res
        .status(400)
        .json({ message: "Some fields are invalid/required", errors: errors });
    }
    const contact = await new Contact(value).save();
    return res.sendStatus(201);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const getContact = async (req: any, res: Response) => {
  const user = req.user;
  const contactID = req.params.contactID;

  try {
    const contact = await Contact.findOne({ _id: contactID });
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    return res.json(contact);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const getContacts = async (req: any, res: Response) => {
  const user = req.user;
  const contactID = req.params.contactID;

  try {
    const contacts = await Contact.find({ _id: contactID });
    return res.json(contacts);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const deleteContact = async (req: any, res: Response) => {
  const user = req.user;
  const contactID = req.params.contactID;

  try {
    const contact = await Contact.findOne({ _id: contactID });
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    await contact.delete();
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};
