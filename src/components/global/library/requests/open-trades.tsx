"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toaster } from "@/components/ui/toaster";
import { Book } from "@/db/types";
import Image from "next/image";
import { useEffect, useState } from "react";

let cachedTrades: { userBook: Book; exchangeBooks: Book[] }[] | null = null;
let cachedError: string | null = null;

async function fetchTrades() {
  if (cachedTrades || cachedError)
    return { trades: cachedTrades, error: cachedError };

  try {
    const res = await fetch("/api/fetch-trades?state=false");
    if (!res.ok) throw new Error("Failed to fetch trades");

    const data = await res.json();
    cachedTrades = data.trades;
    return { trades: cachedTrades, error: null };
  } catch {
    cachedError = "Error loading trades. Please try again.";
    return { trades: null, error: cachedError };
  }
}

const deleteHandler = async (
  userBookID: number,
  exchangeBookID: number
): Promise<void> => {
  const promise = new Promise<void>(async (resolve, reject) => {
    try {
      const response = await fetch("/api/decline-trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userBookID, exchangeBookID }),
      });

      if (response.ok) {
        resolve();
      } else {
        const errorData = await response.json();
        reject(new Error(errorData.error || "Trade decline failed"));
      }
    } catch {
      reject(new Error("Unexpected error occurred during decline"));
    }
  });

  toaster.promise(promise, {
    success: {
      title: "Trade Declined",
      description: `Trade was successfully declined.`,
    },
    error: (error: Error) => ({
      title: "Decline Failed",
      description: error.message,
    }),
    loading: {
      title: "Declining Trade...",
      description: `Please wait while we decline trade.`,
    },
  });

  try {
    await promise;
    window.location.reload();
  } catch {
    return;
  }
};

const acceptHandler = async (
  userBookID: number,
  exchangeBookID: number
): Promise<void> => {
  const promise = new Promise<void>(async (resolve, reject) => {
    try {
      const response = await fetch("/api/accept-trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userBookID, exchangeBookID }),
      });

      if (response.ok) {
        resolve();
      } else {
        const errorData = await response.json();
        reject(new Error(errorData.error || "Trade accept failed"));
      }
    } catch {
      reject(new Error("Unexpected error occurred during accept"));
    }
  });

  toaster.promise(promise, {
    success: {
      title: "Trade Accepted",
      description: `Trade was successfully accepted.`,
    },
    error: (error: Error) => ({
      title: "Accept Failed",
      description: error.message,
    }),
    loading: {
      title: "Accepting Trade...",
      description: `Please wait while we accept trade.`,
    },
  });

  try {
    await promise;
    window.location.reload();
  } catch {
    return;
  }
};

export default function OpenTrades() {
  const [trades, setTrades] = useState<typeof cachedTrades>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrades().then(({ trades, error }) => {
      setTrades(trades);
      setError(error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="w-full flex flex-wrap my-10 gap-5 justify-center">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="w-[300px] h-[300px] rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[300px] my-10 justify-center flex flex-col items-center">
        <p className="max-w-[450px] text-center">{error}</p>
      </div>
    );
  }

  if (!trades || trades.length === 0) {
    return (
      <div className="w-full h-[300px] my-10 justify-center flex flex-col items-center">
        <h5 className="max-w-[450px] text-center">
          No active trades yet. Start listing books and connect with fellow book
          lovers!
        </h5>
      </div>
    );
  }

  return <TradesList trades={trades} />;
}

function TradesList({
  trades,
}: {
  trades: { userBook: Book; exchangeBooks: Book[] }[];
}) {
  return (
    <div className="w-full overflow-y-auto my-10 flex flex-wrap gap-5 justify-center">
      {trades.map((trade) =>
        trade.exchangeBooks.map((exchangeBook: Book) => (
          <div
            key={`${trade.userBook.id}-${exchangeBook.id}`}
            className="flex flex-col space-y-3"
          >
            <div className="flex flex-row">
              <Image
                src={trade.userBook.thumbnail}
                alt={trade.userBook.title}
                width={150}
                height={200}
                className="rounded-tl-lg rounded-bl-lg"
              />

              <Image
                src={exchangeBook.thumbnail}
                alt={exchangeBook.title}
                width={150}
                height={200}
                className="rounded-tr-lg rounded-br-lg"
              />
            </div>

            <Button
              onClick={() => acceptHandler(trade.userBook.id, exchangeBook.id)}
            >
              Accept
            </Button>
            <Button
              onClick={() => deleteHandler(trade.userBook.id, exchangeBook.id)}
              variant="destructive"
            >
              Decline
            </Button>
          </div>
        ))
      )}
    </div>
  );
}
