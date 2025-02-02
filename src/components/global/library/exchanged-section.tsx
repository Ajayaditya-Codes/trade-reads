export default async function ExchangedSection() {
  return (
    <div>
      <h3 className="text-xl/7 font-semibold">Trade History</h3>
      <p className="text-base">
        A record of all the stories you've shared and discovered through
        trading.{" "}
      </p>

      <div className="min-w-full text-lg flex flex-row min-h-[300px] my-5 justify-center items-center space-x-5 overflow-x-scroll">
        <h5 className="max-w-[450px] text-center">
          Once you exchange books, your trade history will appear here. Start
          trading and build your collection!
        </h5>{" "}
      </div>
    </div>
  );
}
