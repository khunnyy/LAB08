import fs from "fs";
import path from "path";

export type Book = {
  bookNo: number;
  bookName: string;
};

type DbShape = { books: Book[] };

const dbPath = path.join(process.cwd(), "data", "books.json");

function readDb(): DbShape {
  if (!fs.existsSync(dbPath)) {
    const dir = path.dirname(dbPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const initialData: DbShape = { books: [] };
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), "utf-8");

    return initialData;
  }

  const fileText = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(fileText);
}

// TODO 2: Implement writeDb(db: DbShape)
function writeDb(db: DbShape) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
}

// TODO 3
export function readBooks(): Book[] {
  return readDb().books;
}

// TODO 4
export function addBook(bookName: string): Book {
  const db = readDb();

  const maxBookNo =
    db.books.length > 0
      ? Math.max(...db.books.map((b) => b.bookNo))
      : 0;

  const newBook: Book = {
    bookNo: maxBookNo + 1,
    bookName,
  };

  db.books.push(newBook);
  writeDb(db);

  return newBook;
}
  export function deleteBook(bookNo: number): boolean {
  const db = readDb();

  const index = db.books.findIndex(b => b.bookNo === bookNo);

  if (index === -1) {
    return false;
  }

  db.books.splice(index, 1);
  writeDb(db);

  return true;
}
export function searchBooks(keyword: string): Book[] {
  const db = readDb();
  const lower = keyword.toLowerCase();

  return db.books.filter(b =>
    b.bookName.toLowerCase().includes(lower)
  );
}


