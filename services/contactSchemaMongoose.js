const Contact = require('../models/contacts');

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

// const validateContact = (contactId) => {
//   const schema = Joi.object({
//     name: Joi.string().required(),
//     email: Joi.string().email().required(),
//     phone: Joi.string().required(),
//   });
// };

const addContact = async (name, email, phone) => {
  const newContact = new Contact({
    name,
    email,
    phone,
  });
  return await newContact.save();
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
  validateContact
};
