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
import { Input } from "@/components/ui/input";

let cachedBooks: Book[] | null = null;
let cachedError: string | null = null;

async function fetchAvailableBooks() {
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
  const [availableBooks, setAvailableBooks] = useState<Book[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableBooks().then(({ books, error }) => {
      setAvailableBooks(books);
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

  if (!availableBooks || availableBooks.length === 0) {
    return (
      <div className="w-full h-[300px] my-10 flex flex-col items-center justify-center">
        <h5 className="max-w-[450px] text-center text-gray-500">
          Once you add books to your shelf, they&apos;ll appear here, ready for
          other readers to discover. Start listing and connect with fellow book
          lovers!
        </h5>
      </div>
    );
  }

  return <BookExchangeList availableBooks={availableBooks} />;
}

function BookExchangeList({ availableBooks }: { availableBooks: Book[] }) {
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const [selectedTrades, setSelectedTrades] = useState<{
    [bookID: number]: number | null;
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

  const [searchVal, setSearchVal] = useState("");

  const handleTradeSelect = (bookID: number, selectedBookID: number) => {
    setSelectedTrades((prev) => ({ ...prev, [bookID]: selectedBookID }));
  };

  const handleTradeRequest = async (
    selectedBookID: number,
    userBookID: number
  ) => {
    const promise = fetch("/api/make-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userBookID, exchangeBookID: selectedBookID }),
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
    <div className="w-fit flex flex-col items-center mx-auto my-10 space-y-10">
      <Input
        className="min-w-[300px] md:min-w-[500px] lg:min-w-[800px] full rounded-lg p-2 border dark:border-white border-black"
        placeholder="Search Your Favorite Books..."
        type="text"
        value={searchVal}
        onChange={(e) => setSearchVal(e.target.value)}
      />
      <div className="w-fit grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {availableBooks
          .filter((book) =>
            book?.title.toLowerCase().includes(searchVal.toLowerCase())
          )
          .map((book) => (
            <div
              key={book.id}
              className=" flex flex-col items-center space-y-2 text-center w-full max-w-[200px] mx-auto"
            >
              <div className="relative">
                <Image
                  src={book.thumbnail}
                  alt={book.title}
                  width={200}
                  height={250}
                  className="rounded-lg object-cover"
                />
                {book?.recommended && (
                  <div className="bg-black dark:bg-white text-white dark:text-black bg-opacity-75 w-fit h-fit p-2 px-3 rounded-md absolute bottom-0 right-0 mb-2 mr-2">
                    Recommended
                  </div>
                )}{" "}
              </div>
              {userBooks.length > 0 && (
                <Select
                  onValueChange={(value) =>
                    handleTradeSelect(book.id, Number(value))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a book to trade" />
                  </SelectTrigger>
                  <SelectContent>
                    {userBooks.map((userBook) => (
                      <SelectItem key={userBook.id} value={String(userBook.id)}>
                        {userBook.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Button
                className="w-full mt-2"
                disabled={!selectedTrades[book.id]}
                onClick={() =>
                  handleTradeRequest(book.id, selectedTrades[book.id] as number)
                }
              >
                Request Trade
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
}
