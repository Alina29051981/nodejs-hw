import express from 'express';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';
import * as notesController from '../controllers/notesController.js';

import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

const router = express.Router();

router.get(
  '/notes',
  authenticate,
  celebrate(getAllNotesSchema),
  notesController.getAllNotes,
);

router.get(
  '/notes/:noteId',
  authenticate,
  celebrate(noteIdSchema),
  notesController.getNoteById,
);

router.post(
  '/notes',
  authenticate,
  celebrate(createNoteSchema),
  notesController.createNote,
);

router.delete(
  '/notes/:noteId',
  authenticate,
  celebrate(noteIdSchema),
  notesController.deleteNote,
);

router.patch(
  '/notes/:noteId',
  authenticate,
  celebrate(updateNoteSchema),
  notesController.updateNote,
);

export default router;
