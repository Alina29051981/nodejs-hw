import express from 'express';
import * as notesController from '../controllers/notesController.js';

const router = express.Router();

router.get('/', notesController.getAllNotes);
router.get('/:noteId', notesController.getNoteById);
router.post('/', notesController.createNote);
router.patch('/:noteId', notesController.updateNote);
router.delete('/:noteId', notesController.deleteNote);

export default router;
