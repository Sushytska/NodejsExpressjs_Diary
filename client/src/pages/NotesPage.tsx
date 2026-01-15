import { useEffect, useMemo, useState } from 'react';
import { fetchNotes, createNote, type Note, updateNote, deleteNote } from '../api/notes';
import { logout } from '../api/auth';
import { NoteForm } from '../components/NoteForm';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [editingNote, setEditingNote] = useState<Note | null>(null);

  async function refreshNotes() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotes();
      setNotes(data.notes);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshNotes();
  }, []);

  const sortedNotes = useMemo(() => {
    const list = Array.isArray(notes) ? notes : [];
    console.log(list);
    return [...list].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [notes]);

  async function handleCreateNote(title: string, content: string) {
    await createNote(title, content);
    await refreshNotes();
  }

  async function handleUpdateNote(title: string, content: string) {
    if (!editingNote) return;
    await updateNote(editingNote._id, title, content);
    setEditingNote(null);
    await refreshNotes();
  }

  async function handleDeleteNote(id: string) {
    await deleteNote(id);
    await refreshNotes();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto flex justify-end mb-4" style={{ textAlign: 'right' }}>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
          onClick={async () => {
            try {
              await logout();
            } finally {
              window.location.reload();
            }
          }}
        >
          Logout
        </button>
      </div>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">My Notes</h1>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <h3>{editingNote ? 'Edit note' : 'Create note'}</h3>
        {loading ? (
          <div className="text-center">Loading notes...</div>
        ) : (
          <>
            {editingNote ? (
              <NoteForm
                initialTitle={editingNote.title}
                initialContent={editingNote.content}
                onSubmit={handleUpdateNote}
                onCancel={() => setEditingNote(null)}
              />
            ) : (
              <NoteForm onSubmit={handleCreateNote} onCancel={() => {}} />
            )}
            <div className="mt-8 space-y-4">
              {sortedNotes.map((note) => (
                <div key={note._id} className="bg-white p-4 rounded shadow">
                  <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
                  <p className="text-gray-700 mb-4 whitespace-pre-wrap">{note.content}</p>
                  <div className="flex justify-end space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
                      onClick={() => setEditingNote(note)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                      onClick={() => handleDeleteNote(note._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
