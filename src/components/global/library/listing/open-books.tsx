"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toaster } from "@/components/ui/toaster";
import { Book } from "@/db/types";
import Image from "next/image";
import { Suspense, useState } from "react";

// Fetch books once at the start of the program
let cachedBooks: Book[] | null = null;
let cachedError: string | null = null;

async function fetchBooks() {
  if (cachedBooks || cachedError)
    return { books: cachedBooks, error: cachedError };

  try {
    const res = await fetch("/api/fetch-books?state=open");
    if (!res.ok) throw new Error("Failed to fetch books");

    const data = await res.json();
    cachedBooks = data.books;
    return { books: cachedBooks, error: null };
  } catch (err) {
    cachedError = "Error loading books. Please try again.";
    return { books: null, error: cachedError };
  }
}

function BooksList({
  books,
  error,
}: {
  books: Book[] | null;
  error: string | null;
}) {
  if (error) {
    return <p className="max-w-[450px] text-center">{error}</p>;
  }

  if (!books || books.length === 0) {
    return (
      <h5 className="max-w-[450px] text-center">
        Once you add books to your shelf, they'll appear here, ready for other
        readers to discover. Start listing and connect with fellow book lovers!
      </h5>
    );
  }

  const handler = async (id: number, title: string): Promise<void> => {
    console.log(id, title);
    const promise = new Promise<void>(async (resolve, reject) => {
      try {
        const response = await fetch("/api/delete-book", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bookID: id }),
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
        description: error.message || "An unexpected error occurred.",
      }),
      loading: {
        title: "Deleting Book...",
        description: `Please wait while we delete "${title}".`,
      },
    });

    try {
      await promise;
    } catch {
      return;
    }
  };

  return (
    <div className="w-full flex flex-row space-x-5 flex-grow overflow-y-scroll">
      {books.map((book) => (
        <div
          key={book.id}
          className="flex flex-col space-y-2 text-center min-h-[300px] w-fit"
        >
          <Image
            src={book.thumbnail}
            alt={book.title}
            width={150}
            height={200}
            className="flex flex-grow"
          />
          <Button
            variant={"destructive"}
            onClick={() => handler(book.id, book.title)}
          >
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
}

export default function OpenBooks() {
  const [books, setBooks] = useState<Book[] | null>(cachedBooks);
  const [error, setError] = useState<string | null>(cachedError);

  if (books === null && error === null) {
    fetchBooks().then(({ books, error }) => {
      setBooks(books);
      setError(error);
    });
  }

  return (
    <div className="min-w-full text-lg flex flex-col min-h-[300px] my-5 justify-center items-center space-y-5">
      <Suspense fallback={<Skeleton className="w-full h-full rounded-xl" />}>
        <BooksList books={books} error={error} />
      </Suspense>
    </div>
  );
}
