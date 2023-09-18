const Contact = require('../models/contacts');

const updateStatusContact = async (contactId, favorite) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { favorite },
      { new: true }
    );
    return updatedContact;
  } catch (error) {
    throw new Error('Could not update contact favorite status');
  }
};

module.exports = {
  updateStatusContact,
};
