"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toaster } from "@/components/ui/toaster";
import { Book } from "@/db/types";
import Image from "next/image";
import { useEffect, useState } from "react";

let cachedTrades: Book[][] | null = null;
let cachedError: string | null = null;

async function fetchTrades() {
  if (cachedTrades || cachedError)
    return { trades: cachedTrades, error: cachedError };

  try {
    const res = await fetch("/api/fetch-trades?state=closed");
    if (!res.ok) throw new Error("Failed to fetch trades");

    const data = await res.json();
    cachedTrades = data.trades;
    return { trades: cachedTrades, error: null };
  } catch {
    cachedError = "Error loading trades. Please try again.";
    return { trades: null, error: cachedError };
  }
}

export default function ClosedTrades() {
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
          Once you exchange books, your trade history will appear here. Start
          trading and build your collection!
        </h5>
      </div>
    );
  }

  return <TradesList trades={trades} />;
}

function TradesList({ trades }: { trades: Book[][] }) {
  return (
    <div className="w-full overflow-y-scroll my-10 flex flex-wrap gap-5 justify-center">
      {trades.map((books) => (
        <div
          key={books[0].id}
          className="flex flex-col space-y-2 text-center w-fit"
        >
          <div className="flex justify-between">
            <div key={books[0].id} className="flex flex-col items-center">
              <Image
                src={books[0].thumbnail}
                alt={books[0].title}
                width={150}
                height={200}
                className="rounded-tl-lg rounded-bl-lg"
              />
            </div>
            <div key={books[1].id} className="flex flex-col items-center">
              <Image
                src={books[1].thumbnail}
                alt={books[1].title}
                width={150}
                height={200}
                className="rounded-tr-lg rounded-br-lg"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
