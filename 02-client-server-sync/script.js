/**
 * Module 02: Client-Server Integration
 * 
 * Goal: Connect to a real REST API to GET books and POST new books.
 * Handles network errors robustly.
 */

const API_BASE_URL = 'http://localhost:3000/api'; // Pointing to our Backend Masterclass Order Service

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const bookListContainer = document.getElementById('book-list');
    const loadingIndicator = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    
    const addBookForm = document.getElementById('add-book-form');
    const submitBtn = document.getElementById('submit-btn');
    const formError = document.getElementById('form-error');
    const formSuccess = document.getElementById('form-success');

    // ==========================================
    // DATA FETCHING (GET)
    // ==========================================
    async function fetchBooks() {
        loadingIndicator.style.display = 'block';
        errorMessage.classList.add('hidden');
        
        try {
            // Note: We use the actual API URL now instead of a static JSON file
            // Make sure the Backend Masterclass (Module 10 or 11) is already running!
            const response = await fetch(`${API_BASE_URL}/books`);
            
            if (!response.ok) {
                // The server responded, but with an error status code (4xx or 5xx)
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }

            const books = await response.json();
            renderBooks(books);
        } catch (error) {
            console.error("Failed to fetch books:", error);
            
            // This catches both Network errors (backend down) AND our thrown error above
            showError(`Failed to connect to the API. Is your backend running on localhost:3000? Details: ${error.message}`);
            bookListContainer.innerHTML = ''; // Keep it empty on error
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }

    // ==========================================
    // DATA MUTATION (POST)
    // ==========================================
    addBookForm.addEventListener('submit', async (e) => {
        // 1. Prevent the default browser behavior (which is to reload the page)
        e.preventDefault();

        // 2. Clear previous messages & disable button to prevent double-submits
        formError.classList.add('hidden');
        formSuccess.classList.add('hidden');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        // 3. Extract data from the form
        // FormData is a built-in browser API that easily reads form inputs
        const formData = new FormData(addBookForm);
        
        // Build the payload object matching what our backend Zod schema expects
        const payload = {
            title: formData.get('title'),
            author: formData.get('author'),
            pages: parseInt(formData.get('pages'), 10),
            published: formData.get('published')
        };

        try {
            // 4. Send the POST request
            const response = await fetch(`${API_BASE_URL}/books`, {
                method: 'POST',
                headers: {
                    // Tell the server we are sending JSON data
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(payload)
            });

            // Parse response body containing error details or the new book
            const data = await response.json();

            if (!response.ok) {
                // E.g., validation failed on the backend
                throw new Error(data.error || 'Failed to create book');
            }

            // 5. Success UI Update
            formSuccess.textContent = 'Book added successfully!';
            formSuccess.classList.remove('hidden');
            
            // Clear the form inputs
            addBookForm.reset();

            // Refetch the books from the server to update our catalog view
            fetchBooks();

        } catch (error) {
            console.error("Failed to add book:", error);
            formError.textContent = error.message;
            formError.classList.remove('hidden');
        } finally {
            // Re-enable the button regardless of success or failure
            submitBtn.disabled = false;
            submitBtn.textContent = 'Add to Catalog';
        }
    });

    // ==========================================
    // RENDERING LOGIC
    // ==========================================
    function renderBooks(books) {
        bookListContainer.innerHTML = '';

        if (books.length === 0) {
            bookListContainer.innerHTML = '<p class="loading">No books in the catalog. Add one above!</p>';
            return;
        }

        books.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card';
            
            // Destructure the book properties matching the real API response
            const { title, author, pages, published } = book;

            card.innerHTML = `
                <div class="book-details">
                    <h3>${title}</h3>
                    <p class="author">by ${author}</p>
                    <p style="color: var(--text-muted); font-size: 0.85rem;">
                        ${pages} pages • Published ${published}
                    </p>
                </div>
            `;

            bookListContainer.appendChild(card);
        });
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    // Initial fetch on page load
    fetchBooks();
});
