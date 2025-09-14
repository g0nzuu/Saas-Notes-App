import React, {useState, useEffect} from 'react';

export default function NoteModal({ isOpen, onClose, onSave, initial }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [content, setContent] = useState(initial?.content || '');

  useEffect(()=> {
    if (isOpen) {
      setTitle(initial?.title || '');
      setContent(initial?.content || '');
    }
  }, [isOpen, initial]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>
      <div className="bg-white rounded-xl shadow-lg z-10 w-11/12 max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">{initial ? 'Edit Note' : 'Create Note'}</h2>
        <input className="w-full border px-3 py-2 rounded mb-3" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="w-full border px-3 py-2 rounded mb-3" rows="6" placeholder="Content" value={content} onChange={e=>setContent(e.target.value)} />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
          <button onClick={()=> onSave({ title, content })} className="px-4 py-2 rounded bg-indigo-600 text-white">Save</button>
        </div>
      </div>
    </div>
  );
}
