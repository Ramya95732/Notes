
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }

    const notesContainer = document.getElementById('notes-container');
    const noteForm = document.getElementById('note-form');
    const searchInput = document.getElementById('search');

    const fetchNotes = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/notes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const notes = await response.json();
            displayNotes(notes);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const displayNotes = (notes) => {
        notesContainer.innerHTML = '';
        notes.forEach(note => {
            const noteDiv = document.createElement('div');
            noteDiv.classList.add('note');
            noteDiv.style.backgroundColor = note.bgColor;
            noteDiv.innerHTML = `
                <h2>${note.title}</h2>
                <p>${note.content}</p>
                <p class="tags">Tags: ${note.tags.join(', ')}</p>
                <div class="note-actions">
                    <i class="fas fa-edit" onclick="editNote('${note._id}')"></i>
                    <i class="fas fa-trash" onclick="deleteNote('${note._id}')"></i>
                </div>
            `;
            notesContainer.appendChild(noteDiv);
        });
    };

    const createOrUpdateNote = async (noteId = null) => {
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());
        const bgColor = document.getElementById('bgColor').value;
        const dueDate = document.getElementById('dueDate').value;

        const noteData = { title, content, tags, bgColor, dueDate };

        try {
            const method = noteId ? 'PUT' : 'POST';
            const url = noteId ? `http://localhost:5000/api/notes/${noteId}` : 'http://localhost:5000/api/notes';
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(noteData)
            });
            const note = await response.json();
            fetchNotes();
            noteForm.reset();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    noteForm && noteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const noteId = noteForm.getAttribute('data-note-id');
        createOrUpdateNote(noteId);
    });

    searchInput && searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const notes = Array.from(notesContainer.children);
        notes.forEach(note => {
            const title = note.querySelector('h2').textContent.toLowerCase();
            const content = note.querySelector('p').textContent.toLowerCase();
            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                note.style.display = 'block';
            } else {
                note.style.display = 'none';
            }
        });
    });

    window.editNote = async (noteId) => {
        try {
            console.log(noteId,"&&&&&&&&")
            const response = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
                
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const note = await response.json();
            document.getElementById('title').value = note.title;
            document.getElementById('content').value = note.content;
            document.getElementById('tags').value = note.tags.join(', ');
            document.getElementById('bgColor').value = note.bgColor;
            document.getElementById('dueDate').value = note.dueDate;
            noteForm.setAttribute('data-note-id', noteId);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    window.deleteNote = async (noteId) => {
        try {
            await fetch(`http://localhost:5000/api/notes/${noteId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchNotes();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    fetchNotes();
});
