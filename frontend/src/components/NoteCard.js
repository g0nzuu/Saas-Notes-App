import React from 'react';

export default function NoteCard({ note, onEdit, onDelete }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold">{note.title}</h3>
        <div className="space-x-2">
          <button onClick={() => onEdit(note)} className="text-indigo-600 hover:underline">Edit</button>
          <button onClick={() => onDelete(note._id)} className="text-red-600 hover:underline">Delete</button>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2">{note.content?.length > 150 ? note.content.substring(0,150) + '...' : note.content}</p>
    </div>
  );
}
