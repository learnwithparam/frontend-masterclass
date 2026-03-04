# Module 05: Declarative UI & Utility Styling (`05-react-tailwind-foundations`)

This is the moment everything changes. We've spent 4 modules writing imperative, vanilla JavaScript — manually creating DOM elements, toggling classes, and wiring up event listeners. Now we switch to **React**, where UI is a *function of state*.

## The Big Shift: Imperative → Declarative

**Before (Vanilla JS — Module 02):**
```javascript
const card = document.createElement('div');
card.className = 'book-card';
card.innerHTML = `<h3>${title}</h3>`;
bookListContainer.appendChild(card);
```

**After (React — This Module):**
```jsx
function BookCard({ title, author }) {
  return (
    <div className="bg-white rounded-xl p-6">
      <h3>{title}</h3>
      <p>by {author}</p>
    </div>
  );
}
```

You *describe* what the UI should look like. React handles creating, updating, and deleting DOM elements for you.

## Concepts Covered

### 1. Components & Props
A React component is just a function that returns JSX. Data flows *down* via props. `BookCard` receives `title`, `author`, etc. as props and renders them.

### 2. State (`useState`)
`const [books, setBooks] = useState([])` — When you call `setBooks(newData)`, React automatically re-renders the component with the new data. No manual DOM manipulation.

### 3. Side Effects (`useEffect`)
`useEffect(() => { fetchBooks() }, [])` — This runs the fetch *once* after the first render. It replaces `DOMContentLoaded`.

### 4. Tailwind CSS (Utility-First Styling)
Instead of writing `.book-card { background: white; border-radius: 0.75rem; }` in a separate CSS file, we write `className="bg-white rounded-xl"` directly in JSX. Every class maps to exactly one CSS property.

## How to Run
```bash
npm run dev
```
Then open `http://localhost:5173`. Make sure the backend is running on port 3000.
