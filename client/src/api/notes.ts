import http from './http';

export type Note = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

type FetchNotesResponse = {
  notes: Note[];
};

export async function fetchNotes(): Promise<FetchNotesResponse> {
  const response = await http.get<FetchNotesResponse>('/api/notes');
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await http.get<Note>(`/api/notes/${id}`);
  return response.data;
}

export async function createNote(title: string, content: string): Promise<Note> {
  const response = await http.post<Note>('/api/notes', { title, content });
  return response.data;
}

export async function updateNote(id: string, title: string, content: string): Promise<Note> {
  const response = await http.patch<Note>(`/api/notes/${id}`, { title, content });
  return response.data;
}

export async function deleteNote(id: string): Promise<void> {
  await http.delete(`/api/notes/${id}`);
}
