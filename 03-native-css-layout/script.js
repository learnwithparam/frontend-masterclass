/**
 * Module 03: Native Responsive Architecture
 * 
 * Same fetch logic from Module 02, adapted for the new semantic HTML structure.
 */

const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    const bookList = document.getElementById('book-list');
    const loading = document.getElementById('loading');
    const errorMsg = document.getElementById('error-message');
    const retryBtn = document.getElementById('retry-btn');
    const form = document.getElementById('add-book-form');
    const submitBtn = document.getElementById('submit-btn');
    const formError = document.getElementById('form-error');
    const formSuccess = document.getElementById('form-success');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = navLinks.style.display === 'flex';
        navLinks.style.display = isOpen ? 'none' : 'flex';
        if (!isOpen) {
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.background = 'white';
            navLinks.style.padding = '1rem';
            navLinks.style.borderBottom = '1px solid var(--border)';
        }
    });

    retryBtn.addEventListener('click', fetchBooks);

    async function fetchBooks() {
        loading.classList.remove('hidden');
        errorMsg.classList.add('hidden');
        bookList.innerHTML = '';

        try {
            const response = await fetch(`${API_BASE_URL}/books`);
            if (!response.ok) throw new Error(`Server returned ${response.status}`);
            renderBooks(await response.json());
        } catch (err) {
            errorMsg.querySelector('.msg-text').textContent =
                `Cannot connect to the backend. Is it running on port 3000?`;
            errorMsg.classList.remove('hidden');
        } finally {
            loading.classList.add('hidden');
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        formError.classList.add('hidden');
        formSuccess.classList.add('hidden');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        const fd = new FormData(form);
        const payload = {
            title: fd.get('title'),
            author: fd.get('author'),
            pages: parseInt(fd.get('pages'), 10),
            published: fd.get('published')
        };

        try {
            const res = await fetch(`${API_BASE_URL}/books`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create book');

            formSuccess.textContent = 'Book added successfully!';
            formSuccess.classList.remove('hidden');
            form.reset();
            fetchBooks();
        } catch (err) {
            formError.textContent = err.message;
            formError.classList.remove('hidden');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Add Book';
        }
    });

    function renderBooks(books) {
        bookList.innerHTML = '';
        if (!books.length) {
            bookList.innerHTML = '<p class="text-muted" style="grid-column:1/-1;text-align:center;">No books yet. Add one!</p>';
            return;
        }
        books.forEach(({ title, author, pages, published }) => {
            const card = document.createElement('article');
            card.className = 'book-card';
            card.innerHTML = `
                <div>
                    <h3 class="book-title">${title}</h3>
                    <p class="book-author">by ${author}</p>
                </div>
                <div class="book-stats">
                    <span class="tag">${pages} Pages</span>
                    <span class="tag">Pub: ${published}</span>
                </div>
            `;
            bookList.appendChild(card);
        });
    }

    fetchBooks();
});
