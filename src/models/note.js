import mongoose from 'mongoose';
import { TAGS } from '../constants/tags.js';

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, trim: true, default: '' },
    tag: { type: String, enum: TAGS, default: 'Todo', trim: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

noteSchema.index(
  { title: 'text', content: 'text' },
  {
    title: 'NoteTextIndex',
    content: 'NoteTextIndex',
    weights: { title: 10, content: 2 },
    default_language: 'english',
  },
);

export const Note = mongoose.model('Note', noteSchema);
