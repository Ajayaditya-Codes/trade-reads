import OpenTrades from "./open-trades";

export default async function RequestsSection() {
  return (
    <div>
      <h3 className="text-xl/7 font-semibold">Requested Trades</h3>
      <p className="text-base">
        Stay updated on your pending trades and connect with readers ready to
        exchange.{" "}
      </p>
      <OpenTrades />
    </div>
  );
}
