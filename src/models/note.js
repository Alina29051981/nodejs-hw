import mongoose from 'mongoose';

const allowedTags = [
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
  'Ideas',
  'Travel',
  'Finance',
  'Health',
  'Important',
  'Todo',
];

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, trim: true, default: '' },
    tag: { type: String, enum: allowedTags, default: 'Todo' },
  },
  { timestamps: true },
);

export const Note = mongoose.model('Note', noteSchema, 'notes');
