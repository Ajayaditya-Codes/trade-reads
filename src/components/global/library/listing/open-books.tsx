"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toaster } from "@/components/ui/toaster";
import { Book } from "@/db/types";
import Image from "next/image";
import { useEffect, useState } from "react";

// Caching to avoid refetching unnecessarily
let cachedBooks: Book[] | null = null;
let cachedError: string | null = null;

async function fetchBooks() {
  if (cachedBooks || cachedError)
    return { books: cachedBooks, error: cachedError };

  try {
    const res = await fetch("/api/fetch-books");
    if (!res.ok) throw new Error("Failed to fetch books");

    const data = await res.json();
    cachedBooks = data.books;
    return { books: cachedBooks, error: null };
  } catch {
    cachedError = "Error loading books. Please try again.";
    return { books: null, error: cachedError };
  }
}

export default function OpenBooks() {
  const [books, setBooks] = useState<Book[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks().then(({ books, error }) => {
      setBooks(books);
      setError(error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="w-full my-10 flex flex-wrap gap-5 justify-center">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="w-[150px] h-[300px] rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[300px] my-10 justify-center flex flex-col items-center">
        <p className="max-w-[450px] text-center">{error}</p>;
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="w-full h-[300px] my-10 justify-center flex flex-col items-center">
        <h5 className="max-w-[450px] text-center">
          Once you add books to your shelf, they'll appear here, ready for other
          readers to discover. Start listing and connect with fellow book
          lovers!
        </h5>
      </div>
    );
  }

  return <BooksList books={books} />;
}

function BooksList({ books }: { books: Book[] }) {
  const handleDelete = async (isbn: string, title: string): Promise<void> => {
    const promise = new Promise<void>(async (resolve, reject) => {
      try {
        const response = await fetch("/api/delete-book", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isbn }),
        });

        if (response.ok) {
          resolve();
        } else {
          const errorData = await response.json();
          reject(new Error(errorData.error || "Book deletion failed"));
        }
      } catch {
        reject(new Error("Unexpected error occurred during deletion"));
      }
    });

    toaster.promise(promise, {
      success: {
        title: "Book Deleted",
        description: `${title} was successfully deleted.`,
      },
      error: (error: Error) => ({
        title: "Deletion Failed",
        description: error.message,
      }),
      loading: {
        title: "Deleting Book...",
        description: `Please wait while we delete "${title}".`,
      },
    });

    try {
      await promise;
      window.location.reload();
    } catch {
      return;
    }
  };

  return (
    <div className="w-full overflow-y-scroll flex flex-wrap my-10 gap-5 justify-center">
      {books.map((book) => (
        <div
          key={book.id}
          className="flex flex-col space-y-2 text-center w-[150px]"
        >
          <Image
            src={book.thumbnail}
            alt={book.title}
            width={150}
            height={200}
            className="rounded-lg"
          />
          <Button
            variant="destructive"
            onClick={() => handleDelete(book.isbn, book.title)}
          >
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
}
