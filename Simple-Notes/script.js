let notes = [];
let editId = null;

function loadFromLocalStorage() {
    const savedNotes = localStorage.getItem('smartNotes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
    }
    renderNotes();
}

function saveToLocalStorage() {
    localStorage.setItem('smartNotes', JSON.stringify(notes));
}

function getPreview(content) {
    if (content.length <= 100) return content;
    return content.substring(0, 100) + '...';
}

function addNote(title, content) {
    const newNote = {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        completed: false,
        createdAt: new Date().toLocaleString('id-ID')
    };
    notes.unshift(newNote);
    saveToLocalStorage();
    renderNotes();
}

function updateNote(id, title, content) {
    const index = notes.findIndex(note => note.id === id);
    if (index !== -1) {
        notes[index].title = title.trim();
        notes[index].content = content.trim();
        saveToLocalStorage();
        renderNotes();
    }
}

function deleteNote(id) {
    const confirmation = confirm('Yakin ingin menghapus catatan ini?');
    if (confirmation) {
        notes = notes.filter(note => note.id !== id);
        saveToLocalStorage();
        renderNotes();
        if (editId === id) {
            resetForm();
        }
    }
}

function toggleComplete(id) {
    const index = notes.findIndex(note => note.id === id);
    if (index !== -1) {
        notes[index].completed = !notes[index].completed;
        saveToLocalStorage();
        renderNotes();
    }
}

function editNote(id) {
    const note = notes.find(note => note.id === id);
    if (note) {
        editId = id;
        document.getElementById('title').value = note.title;
        document.getElementById('content').value = note.content;
        document.getElementById('formTitle').textContent = 'Edit Catatan';
        document.getElementById('submitBtn').textContent = 'Simpan Perubahan';
        document.getElementById('cancelBtn').style.display = 'inline-block';
        document.getElementById('title').focus();
    }
}

function resetForm() {
    editId = null;
    document.getElementById('noteForm').reset();
    document.getElementById('formTitle').textContent = 'Tambah Catatan Baru';
    document.getElementById('submitBtn').textContent = 'Simpan Catatan';
    document.getElementById('cancelBtn').style.display = 'none';
}

function renderNotes() {
    const container = document.getElementById('notesContainer');
    
    if (notes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 4rem;">📭</div>
                <p>Belum ada catatan</p>
                <small>Mulai buat catatan pertamamu di atas!</small>
            </div>
        `;
        return;
    }

    let notesHtml = '<div class="notes-grid">';
    for (let note of notes) {
        const completedClass = note.completed ? 'completed' : '';
        const checkedAttr = note.completed ? 'checked' : '';
        
        notesHtml += `
            <div class="note-card ${completedClass}">
                <div class="note-header">
                    <div class="note-title">${escapeHtml(note.title)}</div>
                </div>
                <div class="note-preview">${escapeHtml(getPreview(note.content))}</div>
                <div class="note-footer">
                    <label class="checkbox-container">
                        <input type="checkbox" ${checkedAttr} onchange="toggleComplete(${note.id})">
                        <span>Selesai</span>
                    </label>
                    <div class="action-buttons">
                        <button class="btn btn-warning btn-sm" onclick="editNote(${note.id})">✏️ Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteNote(${note.id})">🗑️ Hapus</button>
                    </div>
                </div>
                <small style="display: block; margin-top: 0.5rem; color: #999; font-size: 11px;">
                    📅 ${note.createdAt}
                </small>
            </div>
        `;
    }
    notesHtml += '</div>';
    container.innerHTML = notesHtml;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.getElementById('noteForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    
    if (!title.trim()) {
        alert('Judul catatan tidak boleh kosong!');
        return;
    }
    
    if (!content.trim()) {
        alert('Isi catatan tidak boleh kosong!');
        return;
    }
    
    if (editId !== null) {
        updateNote(editId, title, content);
        resetForm();
    } else {
        addNote(title, content);
        resetForm();
    }
});

document.getElementById('cancelBtn').addEventListener('click', function() {
    resetForm();
});

loadFromLocalStorage();
