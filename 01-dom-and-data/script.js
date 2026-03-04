/**
 * Module 01: The DOM & Data Fetching
 * 
 * Goal: Read from `books.json` and inject HTML elements into `#book-list`
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Identify the structural containers in the DOM
    const bookListContainer = document.getElementById('book-list');
    const loadingIndicator = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');

    // 2. Define an async function to fetch data
    async function fetchBooks() {
        try {
            // Initiate the HTTP request to the local file
            const response = await fetch('./books.json');
            
            // Check if the response was successful
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse the JSON body
            const books = await response.json();
            
            // Render the books to the DOM
            renderBooks(books);
        } catch (error) {
            console.error("Failed to fetch books:", error);
            showError("Could not load the catalog. Ensure 'books.json' exists and you are running via a local server (e.g., Live Server or python -m http.server).");
        } finally {
            // Always hide the loading indicator when done (success or fail)
            loadingIndicator.style.display = 'none';
        }
    }

    // 3. Define the rendering logic (Imperative DOM manipulation)
    function renderBooks(books) {
        // Clear anything currently in the container
        bookListContainer.innerHTML = '';

        // Iterate over the data array
        books.forEach(book => {
            // Create a wrapper <div> for the card
            const card = document.createElement('div');
            card.className = 'book-card';
            
            // If the book is out of stock, add a modifier class
            if (book.stock === 0) {
                card.classList.add('out-of-stock');
            }

            // Construct the inner HTML entirely using vanilla JS
            card.innerHTML = `
                <div class="book-details">
                    <h3>${book.title}</h3>
                    <p class="author">by ${book.author}</p>
                    <p class="price">$${book.price.toFixed(2)}</p>
                </div>
                <div class="book-actions">
                    <span class="stock-badge ${book.stock > 0 ? 'in-stock' : 'empty'}">
                        ${book.stock > 0 ? `${book.stock} in stock` : 'Out of Stock'}
                    </span>
                    <button ${book.stock === 0 ? 'disabled' : ''}>
                        ${book.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                    </button>
                </div>
            `;

            // Append the fully constructed card to the DOM
            bookListContainer.appendChild(card);
        });
    }

    // Helper to display errors visually
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    // 4. Kick off the fetch when the script loads
    fetchBooks();
});
