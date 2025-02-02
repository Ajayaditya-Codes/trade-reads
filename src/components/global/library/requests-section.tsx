export default async function RequestsSection() {
  return (
    <div>
      <h3 className="text-xl/7 font-semibold">Requested Trades</h3>
      <p className="text-base">
        Stay updated on your pending trades and connect with readers ready to
        exchange.{" "}
      </p>

      <div className="min-w-full text-lg flex flex-row min-h-[300px] my-5 justify-center items-center space-x-5 overflow-x-scroll">
        <h5 className="max-w-[450px] text-center">
          When you request a book from someone or another reader requests one of
          yours, it will appear here. Start exploring and connect with fellow
          book lovers today!
        </h5>{" "}
      </div>
    </div>
  );
}
