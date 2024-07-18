const Note = require('../models/noteModel');

// Get all notes for a user
exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id, isTrashed: false });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single note by ID
exports.getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        console.log(note,"****")
        if (!note || note.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Create a new note
exports.createNote = async (req, res) => {
    const { title, content, tags, bgColor, dueDate } = req.body;
    try {
        const note = new Note({
            user: req.user.id,
            title,
            content,
            tags,
            bgColor,
            dueDate
        });
        const createdNote = await note.save();
        res.status(201).json(createdNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an existing note
exports.updateNote = async (req, res) => {
    const { title, content, tags, bgColor, dueDate, isTrashed } = req.body;
    try {
        let note = await Note.findById(req.params.id);
        if (!note || note.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Note not found' });
        }
        note.title = title || note.title;
        note.content = content || note.content;
        note.tags = tags || note.tags;
        note.bgColor = bgColor || note.bgColor;
        note.dueDate = dueDate || note.dueDate;
        note.isTrashed = isTrashed !== undefined ? isTrashed : note.isTrashed;
        const updatedNote = await note.save();
        res.json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a note (soft delete - move to trash)
exports.deleteNote = async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        if (!note || note.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Note not found' });
        }
        note.isTrashed = true;
        const trashedNote = await note.save();
        res.json(trashedNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get trashed notes for a user
exports.getTrashedNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id, isTrashed: true });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Permanently delete a note
exports.permanentlyDeleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note || note.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Note not found' });
        }
        await note.remove();
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
