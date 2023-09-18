// const Joi = require('joi');
const Contact = require('../models/contacts');

// const validateContact = (contact) => {
//   const schema = Joi.object({
//     name: Joi.string().required(),
//     email: Joi.string().email().required(),
//     phone: Joi.string().required(),
//     favorite: Joi.boolean().invalid(false).required(),
//   });

//   return schema.validate(contact);
// };


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

const addContact = async (name, email, phone, favorite) => {
  try {
    const newContact = new Contact({
      name,
      email,
      phone,
      favorite
    });

    return await newContact.save();
  } catch (error) {
    throw new Error('Could not create contact: ' + error.message);
  }
};


const updateContact = async (contactId, body) => {
  return await Contact.findByIdAndUpdate(contactId, body, { new: true });
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
