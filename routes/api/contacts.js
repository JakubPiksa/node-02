const express = require('express');
const router = express.Router();
const { updateStatusContact } = require('../../controllers/contactController');
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../../services/contactSchemaMongoose');


router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});


router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);
    res.json(contact);
  } catch (error) {
    next(error);
  }
});


router.post('/', async (req, res, next) => {
    try {
        const newContact = await addContact(req.body)
        res.status(201).json(newContact)
    } catch (err) {
        next(err)
    }
})


router.delete('/:contactId', async (req, res, next) => {
  try {
    await removeContact(req.params.contactId);
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    next(error);
  }
});


router.put('/:contactId', async (req, res, next) => {
  try {
    const updatedContact = await updateContact(req.params.contactId, req.body);
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
});


router.patch('/:contactId/favorite', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;
    if (favorite === undefined) {
      return res.status(400).json({ message: 'Missing field favorite' });
    }
    const updatedContact = await updateStatusContact(contactId, favorite);
    if (!updatedContact) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(updatedContact);
  } catch (err) {
    next(err);
  }
});




module.exports = router;
