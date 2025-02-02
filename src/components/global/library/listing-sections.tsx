export default async function ListingSection() {
  return (
    <div>
      <h3 className="text-xl/7 font-semibold">Your Books</h3>
      <p className="text-base">
        View, update, and track the books you’ve listed for trade.{" "}
      </p>

      <div className="min-w-full text-lg flex flex-row min-h-[300px] my-5 justify-center items-center space-x-5 overflow-x-scroll">
        <h5 className="max-w-[450px] text-center">
          Once you add books to your shelf, they'll appear here, ready for other
          readers to discover. Start listing and connect with fellow book
          lovers!
        </h5>{" "}
      </div>
    </div>
  );
}
