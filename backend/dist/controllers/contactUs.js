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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContact = exports.getContacts = exports.getContact = exports.newContact = void 0;
const ContactUs_1 = require("../models/ContactUs");
const contact_validator_1 = require("../validators/contact.validator");
const newContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = yield (0, contact_validator_1.validateContactCreateData)(req.body);
    let errors;
    if (error) {
        errors = error.details.map((error) => {
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
    const contact = yield new ContactUs_1.Contact(value).save();
    return res.sendStatus(201);
});
exports.newContact = newContact;
const getContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const contactID = req.params.contactID;
    const contact = yield ContactUs_1.Contact.findOne({ _id: contactID });
    if (!contact)
        return res.status(404).json({ message: "Contact not found" });
    return res.json(contact);
});
exports.getContact = getContact;
const getContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const contactID = req.params.contactID;
    const contacts = yield ContactUs_1.Contact.find({ _id: contactID });
    return res.json(contacts);
});
exports.getContacts = getContacts;
const deleteContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const contactID = req.params.contactID;
    const contact = yield ContactUs_1.Contact.findOne({ _id: contactID });
    if (!contact)
        return res.status(404).json({ message: "Contact not found" });
    yield contact.delete();
    return res.sendStatus(200);
});
exports.deleteContact = deleteContact;
