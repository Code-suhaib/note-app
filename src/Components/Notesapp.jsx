import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const NotesApp = () => {
  // State for notes
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("notes")) || []);
  const [newNote, setNewNote] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  // State for theme
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 5;

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.className = theme === "dark" ? "bg-dark text-light" : "bg-light text-dark";
  }, [theme]);

  // Function to add or update a note
  const addOrUpdateNote = () => {
    if (newNote.trim() !== "") {
      if (editIndex !== null) {
        // Update note
        const updatedNotes = [...notes];
        updatedNotes[editIndex] = newNote;
        setNotes(updatedNotes);
        setEditIndex(null);
      } else {
        // Add new note
        setNotes([...notes, newNote]);
      }
      setNewNote("");
    }
  };

  // Function to delete a note
  const deleteNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  // Function to edit a note
  const editNote = (index) => {
    setNewNote(notes[index]);
    setEditIndex(index);
  };

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Pagination logic
  const totalPages = Math.ceil(notes.length / notesPerPage);
  const startIndex = (currentPage - 1) * notesPerPage;
  const paginatedNotes = notes.slice(startIndex, startIndex + notesPerPage);

  // Change page
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
    <div className={`container mt-4 ${theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"}`}>
      <h2 className="mb-3 text-center p-2">Notes App</h2>

      {/* Theme Toggle Button */}
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-secondary" onClick={toggleTheme}>
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </div>

      {/* Input Field */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Enter a note..."
        />
        <button onClick={addOrUpdateNote} className={`btn ${editIndex !== null ? "btn-success" : "btn-primary"}`}>
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      {/* Notes List */}
      <ul className="list-group">
        {paginatedNotes.map((note, index) => (
          <li key={index} className={`list-group-item d-flex justify-content-between align-items-center ${theme === "dark" ? "bg-secondary text-white" : ""}`}>
            {note}
            <div>
              <button onClick={() => editNote(startIndex + index)} className="btn btn-warning btn-sm me-2">Edit</button>
              <button onClick={() => deleteNote(startIndex + index)} className="btn btn-danger btn-sm">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button className="btn btn-outline-primary" onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span className="fw-bold">Page {currentPage} of {totalPages}</span>
        <button className="btn btn-outline-primary" onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default NotesApp;
