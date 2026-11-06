import type { Quote } from "./yahoo.js";
import { nameFor } from "./binance.js";

// Kraken public ticker — a crypto-quote fallback with no key required.
const KRAKEN_SYMBOL: Record<string, string> = { BTC: "XBT" };

export async function quote(symbol: string): Promise<Quote> {
  const sym = symbol.toUpperCase();
  const pair = (KRAKEN_SYMBOL[sym] ?? sym) + "USD";
  const res = await fetch(`https://api.kraken.com/0/public/Ticker?pair=${encodeURIComponent(pair)}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`kraken ${res.status}`);
  const d = await res.json();
  if (Array.isArray(d?.error) && d.error.length > 0) throw new Error(`kraken: ${d.error[0]}`);
  const key = Object.keys(d?.result ?? {})[0];
  const row = key ? d.result[key] : null;
  const price = Number(row?.c?.[0]);
  if (!key || !isFinite(price) || price <= 0) throw new Error("kraken: no price");
  const open = Number(row?.o);
  return {
    symbol: sym,
    name: nameFor(sym) ?? sym,
    price,
    change: isFinite(open) && open > 0 ? +(price - open).toFixed(6) : null,
    changePercent: isFinite(open) && open > 0 ? +(((price - open) / open) * 100).toFixed(4) : null,
    open: isFinite(open) ? open : null,
    high: Number(row?.h?.[1]) || null,
    low: Number(row?.l?.[1]) || null,
    previousClose: null,
    bid: Number(row?.b?.[0]) || null,
    ask: Number(row?.a?.[0]) || null,
    volume: Number(row?.v?.[1]) || null,
    avgVolume: null,
    marketCap: null,
    pe: null,
    eps: null,
    dividendYield: null,
    week52High: Number(row?.h?.[0]) || null,
    week52Low: Number(row?.l?.[0]) || null,
    beta: null,
    sharesOutstanding: null,
    currency: "USD",
    exchange: "kraken",
    marketState: "24/7",
    time: Math.floor(Date.now() / 1000),
    source: "kraken",
  };
}
