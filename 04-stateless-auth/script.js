/**
 * Module 04: Client-Side Security & State
 * 
 * Concepts: JWT tokens, localStorage, Authorization headers, conditional UI.
 */

const API_BASE_URL = 'http://localhost:3000/api';
const TOKEN_KEY = 'bookstore_jwt'; // Key for localStorage

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const loginPanel = document.getElementById('login-panel');
    const registerPanel = document.getElementById('register-panel');
    const addBookPanel = document.getElementById('add-book-panel');
    const authStatus = document.getElementById('auth-status');
    const logoutBtn = document.getElementById('logout-btn');
    const bookList = document.getElementById('book-list');
    const loading = document.getElementById('loading');
    const errorMsg = document.getElementById('error-message');

    // --- Auth State Management ---

    /** Read the token from localStorage */
    function getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    /** Save the token to localStorage */
    function setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    }

    /** Remove the token from localStorage */
    function removeToken() {
        localStorage.removeItem(TOKEN_KEY);
    }

    /** Update the entire UI based on whether a token exists */
    function updateAuthUI() {
        const token = getToken();
        if (token) {
            // User is logged in
            loginPanel.classList.add('hidden');
            registerPanel.classList.add('hidden');
            addBookPanel.classList.remove('hidden');
            logoutBtn.classList.remove('hidden');
            authStatus.textContent = '🔓 Authenticated';
            authStatus.className = 'auth-badge authenticated';
        } else {
            // User is logged out
            loginPanel.classList.remove('hidden');
            registerPanel.classList.add('hidden');
            addBookPanel.classList.add('hidden');
            logoutBtn.classList.add('hidden');
            authStatus.textContent = '🔒 Guest';
            authStatus.className = 'auth-badge guest';
        }
    }

    // --- Auth Actions ---

    // Toggle between Login and Register forms
    document.getElementById('show-register').addEventListener('click', (e) => {
        e.preventDefault();
        loginPanel.classList.add('hidden');
        registerPanel.classList.remove('hidden');
    });

    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        registerPanel.classList.add('hidden');
        loginPanel.classList.remove('hidden');
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        removeToken();
        updateAuthUI();
    });

    // Login Form
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const loginError = document.getElementById('login-error');
        loginError.classList.add('hidden');

        const fd = new FormData(e.target);
        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: fd.get('username'),
                    password: fd.get('password')
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');

            // Store the JWT token the server returned
            setToken(data.token);
            updateAuthUI();
        } catch (err) {
            loginError.textContent = err.message;
            loginError.classList.remove('hidden');
        }
    });

    // Register Form
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const regError = document.getElementById('register-error');
        regError.classList.add('hidden');

        const fd = new FormData(e.target);
        const username = fd.get('username');
        const password = fd.get('password');
        try {
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Registration failed');

            // Backend register returns user object (no token), so auto-login
            const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const loginData = await loginRes.json();
            if (!loginRes.ok) throw new Error(loginData.error || 'Auto-login failed');

            setToken(loginData.token);
            updateAuthUI();
        } catch (err) {
            regError.textContent = err.message;
            regError.classList.remove('hidden');
        }
    });

    // --- Book CRUD (with Authorization Header) ---

    document.getElementById('add-book-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formSuccess = document.getElementById('form-success');
        const formError = document.getElementById('form-error');
        const submitBtn = document.getElementById('submit-btn');
        formSuccess.classList.add('hidden');
        formError.classList.add('hidden');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        const fd = new FormData(e.target);
        const payload = {
            title: fd.get('title'),
            author: fd.get('author'),
            pages: parseInt(fd.get('pages'), 10),
            published: fd.get('published')
        };

        try {
            const res = await fetch(`${API_BASE_URL}/books`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // THE KEY CONCEPT: Attach the JWT as a Bearer token
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed');

            formSuccess.textContent = 'Book added!';
            formSuccess.classList.remove('hidden');
            e.target.reset();
            fetchBooks();
        } catch (err) {
            formError.textContent = err.message;
            formError.classList.remove('hidden');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Add Book';
        }
    });

    async function fetchBooks() {
        loading.classList.remove('hidden');
        errorMsg.classList.add('hidden');
        bookList.innerHTML = '';

        try {
            const res = await fetch(`${API_BASE_URL}/books`);
            if (!res.ok) throw new Error(`Server returned ${res.status}`);
            renderBooks(await res.json());
        } catch (err) {
            errorMsg.querySelector('.msg-text').textContent = err.message;
            errorMsg.classList.remove('hidden');
        } finally {
            loading.classList.add('hidden');
        }
    }

    function renderBooks(books) {
        bookList.innerHTML = '';
        if (!books.length) {
            bookList.innerHTML = '<p class="text-muted" style="grid-column:1/-1;text-align:center;">No books yet.</p>';
            return;
        }
        books.forEach(({ title, author, pages, published }) => {
            const card = document.createElement('article');
            card.className = 'book-card';
            card.innerHTML = `
                <div><h3 class="book-title">${title}</h3><p class="book-author">by ${author}</p></div>
                <div class="book-stats">
                    <span class="tag">${pages} Pages</span>
                    <span class="tag">Pub: ${published}</span>
                </div>
            `;
            bookList.appendChild(card);
        });
    }

    // --- Init ---
    updateAuthUI();
    fetchBooks();
});
