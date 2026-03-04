# Module 01: The DOM & JSON (`01-dom-and-data`)

Welcome to the Fullstack Masterclass! In this course, we will build a modern frontend taking the API from the `backend-masterclass` and turning it into a real application.

But before we jump into React, Next.js, and complex frameworks, we need to understand exactly what those frameworks abstract away. We start with **Vanilla Web Technologies**.

## Concepts Covered

1. **The Document Object Model (DOM):**
   When the browser parses HTML, it creates a tree of objects in memory called the DOM. JavaScript allows us to interact with this tree dynamically using methods like `document.getElementById` and `document.createElement`.

2. **Fetching Data Asynchronously:**
   JavaScript is single-threaded. If it stops to wait for data to load from the network, your entire website freezes! We use `async/await` and the `fetch()` API to ask the browser to get the data in the background, allowing the UI to stay responsive until the data arrives.

3. **Client-Side Rendering (CSR) vs Static HTML:**
   Instead of hardcoding the books into the HTML file, the HTML just has an empty `<div id="book-list"></div>`. Our JavaScript fetches `books.json` and creates `<div class="book-card">` elements *on the fly*.

## Explore the Code
- Look at `index.html`. Notice there are no books inside it!
- Look at `script.js`. See how we use `fetch()` to grab the `books.json` file, and then how much code it takes to manually create `div` elements, assign them classes, and append them using `appendChild`. (Hint: When we learn React, you'll see why we don't want to do this manually!)
- Look at `style.css`. We use CSS variables (`--primary-color`) and CSS Grid (`grid-template-columns`) for a modern, framework-free layout.

## How to Run This Module

Because we are using the `fetch()` API, you cannot simply double-click the `index.html` file in your file explorer. Browsers block local file fetching for security reasons (CORS policies on `file://` protocols).

You must run this over a local HTTP server.

**Option 1: Using Node**
If you have Node/npx installed (which you should from the backend course):
```bash
npx serve .
```

**Option 2: Using Python**
If you have Python installed:
```bash
python3 -m http.server 8000
```
Then, open your browser to `http://localhost:8000`.

**Option 3: VS Code Live Server**
Right-click `index.html` in VS Code and select "Open with Live Server".
