import createError from 'http-errors';
import { Note } from '../models/note.js';
import { TAGS } from '../constants/tags.js';

export const getAllNotes = async (req, res, next) => {
  try {
    let { page = 1, perPage = 10, tag, search } = req.query;

    page = Number(page);
    perPage = Number(perPage);

    if (!Number.isInteger(page) || page < 1) page = 1;
    if (!Number.isInteger(perPage) || perPage < 1) perPage = 10;

    const MAX_PER_PAGE = 100;
    if (perPage > MAX_PER_PAGE) perPage = MAX_PER_PAGE;

    const filter = {};

    if (tag) {
      if (!TAGS.includes(tag)) {
        throw createError(400, `Invalid tag. Allowed tags: ${TAGS.join(', ')}`);
      }
      filter.tag = tag;
    }

    if (search?.trim()) {
      filter.$text = { $search: search };
    }

    const skip = (page - 1) * perPage;

    let notesQuery = Note.find(filter);

    if (search?.trim()) {
      notesQuery = notesQuery
        .select({
          score: { $meta: 'textScore' },
          title: 1,
          content: 1,
          tag: 1,
          createdAt: 1,
          updatedAt: 1,
        })
        .sort({ score: { $meta: 'textScore' } });
    } else {
      notesQuery = notesQuery
        .select({ title: 1, content: 1, tag: 1, createdAt: 1, updatedAt: 1 })
        .sort({ createdAt: -1 });
    }

    const [totalNotes, notes] = await Promise.all([
      Note.countDocuments(filter),
      notesQuery.skip(skip).limit(perPage).exec(),
    ]);

    const totalPages = totalNotes === 0 ? 0 : Math.ceil(totalNotes / perPage);

    res.status(200).json({ page, perPage, totalNotes, totalPages, notes });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);
    if (!note) throw createError(404, 'Note not found');
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const { title, content = '', tag = 'Todo' } = req.body || {};

    if (!title) throw createError(400, 'Title is required');
    if (tag && !TAGS.includes(tag)) {
      throw createError(400, `Invalid tag. Allowed tags: ${TAGS.join(', ')}`);
    }

    const newNote = await Note.create({ title, content, tag });
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const update = req.body || {};

    if (!update.title && !update.content && !update.tag) {
      throw createError(
        400,
        'At least one of title, content, or tag must be provided',
      );
    }

    if (update.tag && !TAGS.includes(update.tag)) {
      throw createError(400, `Invalid tag. Allowed tags: ${TAGS.join(', ')}`);
    }

    const updatedNote = await Note.findByIdAndUpdate(noteId, update, {
      new: true,
      runValidators: true,
    });

    if (!updatedNote) throw createError(404, 'Note not found');
    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const deletedNote = await Note.findByIdAndDelete(noteId);
    if (!deletedNote) throw createError(404, 'Note not found');
    res.status(200).json(deletedNote);
  } catch (error) {
    next(error);
  }
};
