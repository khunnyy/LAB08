import express, { Request, Response } from "express";
import path from "path";
import { addBook, readBooks, deleteBook, searchBooks } 
  from "./services/bookFileDb";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

// Home
app.get("/", (req: Request, res: Response) => {
  return res.sendFile(
    path.join(process.cwd(), "public", "index.html")
  );
});

// Get all books
app.get("/books", (req: Request, res: Response) => {
  const books = readBooks();
  return res.json(books);
});

// Add book
app.post("/books/add", (req: Request, res: Response) => {
  try {
    const bookName = (req.body.bookName || "").trim();

    if (!bookName) {
      return res.status(400).send("bookName is required");
    }

    addBook(bookName);
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

// Delete 
app.delete("/books/:bookNo", (req: Request, res: Response) => {
  try {
    const bookNo = parseInt(req.params.bookNo, 10);

    if (isNaN(bookNo)) {
      return res.status(400).send("Invalid bookNo");
    }

    const success = deleteBook(bookNo);

    if (!success) {
      return res.status(404).send("Book not found");
    }

    return res.status(200).send("Book deleted");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

// Search
app.get("/books/search", (req: Request, res: Response) => {
  const keyword = (req.query.q as string || "").trim();

  if (!keyword) {
    return res.json([]);
  }

  const results = searchBooks(keyword);
  return res.json(results);
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
