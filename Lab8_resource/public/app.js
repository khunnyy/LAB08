const bookListEl = document.getElementById("book-list");
const searchInput = document.getElementById("search-input");
const clearBtn = document.getElementById("clear-search");

async function loadBooks() {
  const res = await fetch("/books");
  const books = await res.json();
  renderBooks(books);
}

function renderBooks(books) {
  if (books.length === 0) {
    bookListEl.innerHTML = "<p>No books found.</p>";
    return;
  }

  bookListEl.innerHTML = books
    .map(b => `
      <div class="book-item">
        <span>${b.bookNo}. ${b.bookName}</span>
        <button data-id="${b.bookNo}" class="delete-btn">
          Delete
        </button>
      </div>
    `)
    .join("");
}

// 🔥 Delete using event delegation
bookListEl.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.getAttribute("data-id");

    if (!confirm("Delete this book?")) return;

    await fetch(`/books/${id}`, {
      method: "DELETE"
    });

    loadBooks();
  }
});

// 🔥 Realtime search
searchInput.addEventListener("input", async () => {
  const keyword = searchInput.value.trim();

  if (!keyword) {
    loadBooks();
    return;
  }

  const res = await fetch(
    `/books/search?q=${encodeURIComponent(keyword)}`
  );

  const books = await res.json();
  renderBooks(books);
});

// Clear search
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  loadBooks();
});

window.addEventListener("DOMContentLoaded", loadBooks);
