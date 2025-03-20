import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSun, FaMoon, FaEdit, FaTrash, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const NotesApp = () => {
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("notes")) || []);
  const [newNote, setNewNote] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 5;

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.className = theme === "dark" ? "bg-dark text-light" : "bg-light text-dark";
  }, [theme]);

  const addOrUpdateNote = () => {
    if (newNote.trim() !== "") {
      if (editIndex !== null) {
        const updatedNotes = [...notes];
        updatedNotes[editIndex] = newNote;
        setNotes(updatedNotes);
        setEditIndex(null);
      } else {
        setNotes([...notes, newNote]);
      }
      setNewNote("");
    }
  };

  const deleteNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const editNote = (index) => {
    setNewNote(notes[index]);
    setEditIndex(index);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const totalPages = Math.ceil(notes.length / notesPerPage);
  const startIndex = (currentPage - 1) * notesPerPage;
  const paginatedNotes = notes.slice(startIndex, startIndex + notesPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={`container mt-4 p-4 rounded ${theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"}`}>
      <h2 className="mb-3 text-center p-2 fw-bold">Notes App</h2>
      <button className="btn btn-outline-secondary position-fixed top-0 end-0 m-3" onClick={toggleTheme}>
        {theme === "light" ? <FaMoon size={20} /> : <FaSun size={20} />}
      </button>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control rounded shadow-sm"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Enter a note..."
        />
        <button onClick={addOrUpdateNote} className={`btn ${editIndex !== null ? "btn-success" : "btn-primary"}`}>
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>
      <div className="row">
        {paginatedNotes.map((note, index) => (
          <div key={index} className="col-md-4 mb-3">
            <div className={`card shadow-sm ${theme === "dark" ? "bg-secondary text-white" : "bg-white text-dark"}`}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <span>{note}</span>
                <div>
                  <button onClick={() => editNote(startIndex + index)} className="btn btn-warning btn-sm me-2">
                    <FaEdit />
                  </button>
                  <button onClick={() => deleteNote(startIndex + index)} className="btn btn-danger btn-sm">
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-center align-items-center mt-3">
        <button className="btn btn-outline-primary me-2" onClick={prevPage} disabled={currentPage === 1}>
          <FaArrowLeft />
        </button>
        <span className="fw-bold">Page {currentPage} of {totalPages}</span>
        <button className="btn btn-outline-primary ms-2" onClick={nextPage} disabled={currentPage === totalPages}>
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default NotesApp;
