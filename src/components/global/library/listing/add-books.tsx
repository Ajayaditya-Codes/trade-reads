"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toaster } from "@/components/ui/toaster";
import { useState } from "react";

export default function AddBook() {
  const [isbn, setIsbn] = useState("");

  const handler = async () => {
    if (!isbn.trim()) {
      toaster.error({
        title: "Invalid ISBN",
        description: "Please enter a valid ISBN before adding.",
      });
      return;
    }

    const promise = fetch("/api/add-book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isbn }),
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to add book.");
      setIsbn("");
      window.location.reload(); // Force refresh after successful book addition
    });

    toaster.promise(promise, {
      loading: {
        title: "Adding book...",
        description: "Please wait a moment.",
      },
      success: {
        title: "Book added successfully!",
        description: "Your book is now available for trade.",
      },
      error: {
        title: "Failed to add book",
        description: "Something went wrong. Please try again.",
      },
    });
  };

  return (
    <div className="flex flex-row items-center w-fit space-x-5 my-3">
      <Input
        placeholder="Enter ISBN No."
        className="w-[300px]"
        type="text"
        value={isbn}
        onChange={(e) => setIsbn(e.target.value)}
      />
      <Button onClick={handler}>Add</Button>
    </div>
  );
}
