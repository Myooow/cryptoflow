"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BINANCE_WS_BASE_URL, WEBSOCKET_RECONNECT_DELAY, WEBSOCKET_MAX_RETRIES, WEBSOCKET_PING_INTERVAL } from "@/lib/constants";
import { toBinanceStream } from "@/lib/api/mapper";
import type { BinanceTickerEvent, BinanceKlineEvent, BinanceTradeEvent, NormalizedTicker, NormalizedKline, NormalizedTrade, KlineInterval, WebSocketStatus } from "@/types/websocket";

interface UseBinanceTickerOptions {
  coingeckoId: string;
  enabled?: boolean;
}

interface UseBinanceKlineOptions {
  coingeckoId: string;
  interval: KlineInterval;
  enabled?: boolean;
}

interface UseBinanceTradesOptions {
  coingeckoId: string;
  maxItems?: number;
  enabled?: boolean;
}

export function useBinanceTicker({ coingeckoId, enabled = true }: UseBinanceTickerOptions): {
  ticker: NormalizedTicker | null;
  status: WebSocketStatus;
} {
  const [ticker, setTicker] = useState<NormalizedTicker | null>(null);
  const [status, setStatus] = useState<WebSocketStatus>("connecting");

  const streamName = toBinanceStream(coingeckoId, "ticker");

  useWebSocket({
    streamName,
    enabled: enabled && streamName !== null,
    onMessage: (event: BinanceTickerEvent) => {
      setTicker({
        symbol: event.s,
        price: parseFloat(event.c),
        priceChange: parseFloat(event.p),
        priceChangePercent: parseFloat(event.P),
        high24h: parseFloat(event.h),
        low24h: parseFloat(event.l),
        volume24h: parseFloat(event.v),
        quoteVolume24h: parseFloat(event.q),
      });
    },
    onStatusChange: setStatus,
  });

  return { ticker, status };
}

export function useBinanceKline({ coingeckoId, interval, enabled = true }: UseBinanceKlineOptions): {
  kline: NormalizedKline | null;
  status: WebSocketStatus;
} {
  const [kline, setKline] = useState<NormalizedKline | null>(null);
  const [status, setStatus] = useState<WebSocketStatus>("connecting");

  const streamName = toBinanceStream(coingeckoId, "kline", interval);

  useWebSocket({
    streamName,
    enabled: enabled && streamName !== null,
    onMessage: (event: BinanceKlineEvent) => {
      setKline({
        timestamp: event.k.t,
        open: parseFloat(event.k.o),
        high: parseFloat(event.k.h),
        low: parseFloat(event.k.l),
        close: parseFloat(event.k.c),
        volume: parseFloat(event.k.v),
        isClosed: event.k.x,
      });
    },
    onStatusChange: setStatus,
  });

  return { kline, status };
}

export function useBinanceTrades({ coingeckoId, maxItems = 50, enabled = true }: UseBinanceTradesOptions): {
  trades: NormalizedTrade[];
  status: WebSocketStatus;
} {
  const [trades, setTrades] = useState<NormalizedTrade[]>([]);
  const [status, setStatus] = useState<WebSocketStatus>("connecting");

  const streamName = toBinanceStream(coingeckoId, "trade");

  useWebSocket({
    streamName,
    enabled: enabled && streamName !== null,
    onMessage: (event: BinanceTradeEvent) => {
      setTrades((prev) => [
        {
          id: event.t,
          symbol: event.s,
          price: parseFloat(event.p),
          quantity: parseFloat(event.q),
          timestamp: event.T,
          isBuyerMaker: event.m,
        },
        ...prev.slice(0, maxItems - 1),
      ]);
    },
    onStatusChange: setStatus,
  });

  return { trades, status };
}

interface UseWebSocketOptions<T> {
  streamName: string | null;
  enabled: boolean;
  onMessage: (event: T) => void;
  onStatusChange: (status: WebSocketStatus) => void;
}

function useWebSocket<T>({ streamName, enabled, onMessage, onStatusChange }: UseWebSocketOptions<T>): void {
  const wsRef = useRef<WebSocket | null>(null);
  const retriesRef = useRef(0);
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onMessageRef = useRef(onMessage);
  const onStatusChangeRef = useRef(onStatusChange);

  useEffect(() => {
    onMessageRef.current = onMessage;
    onStatusChangeRef.current = onStatusChange;
  });

  const cleanup = useCallback(() => {
    if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onmessage = null;
      wsRef.current.onerror = null;
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (!streamName) return;

    cleanup();
    onStatusChangeRef.current("connecting");

    const ws = new WebSocket(`${BINANCE_WS_BASE_URL}/${streamName}`);
    wsRef.current = ws;

    ws.onopen = () => {
      retriesRef.current = 0;
      onStatusChangeRef.current("connected");

      pingIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ method: "ping" }));
        }
      }, WEBSOCKET_PING_INTERVAL);
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data as string) as T;
        onMessageRef.current(data);
      } catch {
        // malformed JSON — skip silently
      }
    };

    ws.onerror = () => {
      onStatusChangeRef.current("error");
    };

    ws.onclose = () => {
      onStatusChangeRef.current("disconnected");

      if (retriesRef.current < WEBSOCKET_MAX_RETRIES) {
        retriesRef.current += 1;
        reconnectTimeoutRef.current = setTimeout(connect, WEBSOCKET_RECONNECT_DELAY);
      }
    };
  }, [streamName, cleanup]);

  useEffect(() => {
    if (!enabled || !streamName) return;

    connect();
    return cleanup;
  }, [enabled, streamName, connect, cleanup]);
}
