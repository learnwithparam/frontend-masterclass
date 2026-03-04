# Module 02: Client-Server Integration (`02-client-server-sync`)

In the real world, data isn't hardcoded in a local `books.json` file. Data lives in databases managed by a backend API. This module connects our static frontend to the dynamic backend we built in the `backend-masterclass`.

## Concepts Covered

1. **The Real `fetch` API:**
   We are now pointing `fetch()` to `http://localhost:3000/api/books`. This introduces concepts like Network Latency (loading states) and Backend Downtime (error states).

2. **HTTP Verbs:**
   - `GET`: Used to *read* data. Calling `fetch(URL)` defaults to a GET request.
   - `POST`: Used to *create/write* data. To send data, we configure `fetch` with `{ method: 'POST', body: ... }`.

3. **HTTP Headers & JSON Serialization:**
   When sending a POST request to our API, we cannot send raw JavaScript objects. We must do two things:
   - Stringify the object: `JSON.stringify(payload)`
   - Tell the server it's receiving JSON via HTTP Headers: `'Content-Type': 'application/json'`

4. **Robust Error Handling (`try/catch`):**
   Junior engineers often assume `.json()` will always succeed. But what if the backend is offline? Or what if it returns a `400 Bad Request` HTML page instead of JSON? We show how to explicitly check `response.ok` before parsing.

5. **HTML Form Control & Prevention:**
   Clicking a `<button type="submit">` normally refreshes the entire page (the default HTML behavior). We use `e.preventDefault()` to stop the refresh and let Javascript handle the network request seamlessly behind the scenes (AJAX).

## How to Run This Module

**Important:** This module requires the Backend API to be running!

1. Open a new terminal tab and navigate to the backend project.
```bash
cd /Users/param/learn/learnwithparam/lwp-workshops/backend-masterclass/11-ship-it
make run-prod
```
*(Make sure the Order Service is running on port 3000)*

2. Open another terminal tab and run this frontend project locally:
```bash
cd /Users/param/learn/learnwithparam/lwp-workshops/fullstack-masterclass-complex/02-client-server-sync
npx serve .
```

3. Open your browser and interact with the live API! Try adding a book and watch the catalog update automatically.
