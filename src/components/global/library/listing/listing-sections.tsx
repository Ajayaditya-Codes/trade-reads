import AddBook from "./add-books";
import OpenBooks from "./open-books";

export default function ListingSection() {
  return (
    <div>
      <h3 className="text-xl/7 font-semibold">Your Books</h3>
      <p className="text-base">
        View, update, and track the books you’ve listed for trade.{" "}
      </p>
      <AddBook />
      <OpenBooks />
    </div>
  );
}
