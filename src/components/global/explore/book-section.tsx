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
    const res = await fetch("/api/fetch-lib");
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
      <div className="w-full flex justify-center items-center space-y-10 flex-col">
        <div className="w-full flex flex-wrap gap-5 justify-center">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-[150px] h-[300px] rounded-xl" />
          ))}
        </div>
        <div className="w-full flex flex-wrap gap-5 justify-center">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-[150px] h-[300px] rounded-xl" />
          ))}
        </div>
        <div className="w-full flex flex-wrap gap-5 justify-center">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-[150px] h-[300px] rounded-xl" />
          ))}
        </div>
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
  return (
    <div className="w-fit mx-auto my-10 gap-5 grid grid-cols-4">
      {books.map((book) => (
        <div
          key={book.id}
          className="flex flex-col space-y-2 text-center w-[150px]"
        >
          <Image
            src={book.thumbnail}
            alt={book.title}
            width={200}
            height={250}
            className="rounded-lg"
          />
        </div>
      ))}
    </div>
  );
}
