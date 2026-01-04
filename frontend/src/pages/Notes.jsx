import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchNotes = async () => {
    try {
      if (!token) return navigate("/");
      const res = await axios.get(`${API}/notes`, {  headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
         } });
      setNotes(res.data);
    } catch (err) {
      console.error("Fetch notes error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };

  const addNote = async () => {
    if (!title.trim() || !description.trim()) {
      setError("Please fill in both title and description");
      return;
    }
    try {
      setError("");
      if (!token) return navigate("/");
      await axios.post(
        `${API}/notes`,
        { title, description },
        { headers:{
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      } } 
      );
      setTitle("");
      setDescription("");
      fetchNotes();
    } catch (err) {
      console.error("Add note error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        setError("Failed to add note: " + (err.response?.data?.msg || err.message));
      }
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }
    try {
      if (!token) return navigate("/");
      await axios.delete(`${API}/notes/${id}`, { headers: { "Content-Type": "application/json", "auth-token": localStorage.getItem("token") } });
      fetchNotes();
    } catch (err) {
      console.error("Delete note error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      fetchNotes();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">My Notes</h1>
          <button 
            onClick={logout} 
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition transform hover:scale-105 active:scale-95"
          >
            Logout
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Note</h2>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 mb-4 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Note title..."
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                placeholder="Note content..."
                rows="4"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <button
              onClick={addNote}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-lg transition transform hover:scale-105 active:scale-95"
            >
              Add Note
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No notes yet. Create one to get started!</p>
            </div>
          ) : (
            notes.map(note => (
              <div key={note._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{note.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{note.description}</p>
                <button
                  onClick={() => deleteNote(note._id)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition transform hover:scale-105 active:scale-95"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
