import express from 'express';
import * as notesController from '../controllers/notesController.js';
import { celebrate } from 'celebrate';
import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

const router = express.Router();

router.get('/notes', celebrate(getAllNotesSchema), notesController.getAllNotes);
router.get(
  '/notes/:noteId',
  celebrate(noteIdSchema),
  notesController.getNoteById,
);
router.post('/notes', celebrate(createNoteSchema), notesController.createNote);
router.delete(
  '/notes/:noteId',
  celebrate(noteIdSchema),
  notesController.deleteNote,
);
router.patch(
  '/notes/:noteId',
  celebrate(updateNoteSchema),
  notesController.updateNote,
);

export default router;
