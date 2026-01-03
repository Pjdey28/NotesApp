import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
    try {
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
        alert("Add note failed: " + (err.response?.data?.msg || err.message));
      }
    }
  };

  const deleteNote = async (id) => {
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
    <div className="max-w-xl mx-auto mt-10">
      <button onClick={logout} className="mb-4 text-red-500">
        Logout
      </button>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <textarea
        className="border p-2 w-full mb-2"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <button
        onClick={addNote}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Note
      </button>

      {notes.map(note => (
        <div key={note._id} className="border p-3 mb-2 rounded">
          <h3 className="font-bold">{note.title}</h3>
          <p>{note.description}</p>
          <button
            onClick={() => deleteNote(note._id)}
            className="text-red-500 mt-2"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
