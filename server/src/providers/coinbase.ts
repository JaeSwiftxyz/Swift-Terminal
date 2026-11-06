import type { Quote } from "./yahoo.js";
import { nameFor } from "./binance.js";

// Public Coinbase spot prices — a crypto-quote fallback with no key required.
export async function quote(symbol: string): Promise<Quote> {
  const sym = symbol.toUpperCase();
  const res = await fetch(`https://api.coinbase.com/v2/prices/${encodeURIComponent(sym)}-USD/spot`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`coinbase ${res.status}`);
  const d = await res.json();
  const price = Number(d?.data?.amount);
  if (!isFinite(price) || price <= 0) throw new Error("coinbase: bad price");
  return {
    symbol: sym,
    name: nameFor(sym) ?? sym,
    price,
    change: null,
    changePercent: null,
    open: null,
    high: null,
    low: null,
    previousClose: null,
    bid: null,
    ask: null,
    volume: null,
    avgVolume: null,
    marketCap: null,
    pe: null,
    eps: null,
    dividendYield: null,
    week52High: null,
    week52Low: null,
    beta: null,
    sharesOutstanding: null,
    currency: "USD",
    exchange: "coinbase",
    marketState: "24/7",
    time: Math.floor(Date.now() / 1000),
    source: "coinbase",
  };
}
