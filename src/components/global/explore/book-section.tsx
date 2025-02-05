"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Book } from "@/db/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toaster } from "@/components/ui/toaster";

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
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="w-full flex flex-wrap gap-5 justify-center">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="w-[150px] h-[250px] rounded-xl" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[300px] my-10 flex flex-col items-center justify-center">
        <p className="max-w-[450px] text-center text-red-500">{error}</p>
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="w-full h-[300px] my-10 flex flex-col items-center justify-center">
        <h5 className="max-w-[450px] text-center text-gray-500">
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
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const [selectedTrades, setSelectedTrades] = useState<{
    [isbn: string]: string | null;
  }>({});

  useEffect(() => {
    async function fetchUserBooks() {
      try {
        const res = await fetch("/api/fetch-books");
        if (!res.ok) throw new Error("Failed to fetch user books");
        const data = await res.json();
        setUserBooks(data.books);
      } catch {
        setUserBooks([]);
      }
    }

    fetchUserBooks();
  }, []);

  const handleTradeSelect = (isbn: string, selectedIsbn: string) => {
    setSelectedTrades((prev) => ({ ...prev, [isbn]: selectedIsbn }));
  };

  const handler = async (isbn1: string, isbn2: string) => {
    const promise = fetch("/api/make-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isbn1, isbn2 }),
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to make request.");
      window.location.reload();
    });

    toaster.promise(promise, {
      loading: {
        title: "Making request...",
        description: "Please wait a moment.",
      },
      success: {
        title: "Request made successfully!",
      },
      error: {
        title: "Failed to make request",
        description: "Something went wrong. Please try again.",
      },
    });
  };

  return (
    <div className="w-fit mx-auto my-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {books.map((book) => (
        <div
          key={book.id}
          className="flex flex-col items-center space-y-2 text-center w-full max-w-[200px] mx-auto"
        >
          <Image
            src={book.thumbnail}
            alt={book.title}
            width={200}
            height={250}
            className="rounded-lg object-cover"
          />
          {userBooks.length > 0 && (
            <Select
              onValueChange={(value) => handleTradeSelect(book.isbn, value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a book to trade" />
              </SelectTrigger>
              <SelectContent>
                {userBooks.map((userBook) => (
                  <SelectItem key={userBook.isbn} value={userBook.isbn}>
                    {userBook.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button
            className="w-full mt-2"
            disabled={!selectedTrades[book.isbn]}
            onClick={() =>
              handler(book.isbn, selectedTrades[book.isbn] as string)
            }
          >
            Request Trade
          </Button>
        </div>
      ))}
    </div>
  );
}
