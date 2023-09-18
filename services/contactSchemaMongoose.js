const Joi = require('joi');
const Contact = require('../models/contacts');

const validateContact = (contact) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
  });

  return schema.validate(contact);
};
const listContacts = async () => {
  try {
    return await Contact.find()
  } catch (err) {
    console.log('Error getting contact list: ', err)
    throw err
  }
};

const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

const removeContact = async (contactId) => {
  return await Contact.findByIdAndRemove(contactId);
};

const addContact = async (name, email, phone) => {
  const newContact = new Contact({
    name,
    email,
    phone,
  });

  const validation = validateContact(newContact);
  if (validation.error) {
    throw new Error(validation.error.details[0].message);
  }

  return await newContact.save();
};

const updateContact = async (contactId, body) => {
  return await Contact.findByIdAndUpdate(contactId, body, { new: true });
};

module.exports = {
  validateContact,
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
