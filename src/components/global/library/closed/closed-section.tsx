import ClosedTrades from "./closed-trades";

export default async function ClosedSection() {
  return (
    <div>
      <h3 className="text-xl/7 font-semibold">Closed Trades</h3>
      <p className="text-base">
        A record of all the stories you&apos;ve shared and discovered through
        trading.
      </p>
      <ClosedTrades />
    </div>
  );
}
