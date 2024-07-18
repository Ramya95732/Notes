const express = require('express');
const { 
    getNotes, 
    createNote, 
    getNoteById, 
    updateNote, 
    deleteNote, 
    getTrashedNotes, 
    permanentlyDeleteNote 
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getNotes)
    .post(protect, createNote);

router.route('/trashed')
    .get(protect, getTrashedNotes);

router.route('/:id')
    .get(protect, getNoteById)
    .put(protect, updateNote)
    .delete(protect, deleteNote);

router.route('/permanent/:id')
    .delete(protect, permanentlyDeleteNote);

module.exports = router;
