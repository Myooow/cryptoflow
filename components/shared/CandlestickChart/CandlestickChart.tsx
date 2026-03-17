"use client";

import { useEffect, useState } from "react";
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, Bar, CartesianGrid } from "recharts";
import { useBinanceKline } from "@/hooks/useBinanceStream";
import { KLINE_INTERVALS, DEFAULT_KLINE_INTERVAL } from "@/lib/constants";
import type { OhlcCandle } from "@/types/token";
import type { KlineInterval } from "@/types/websocket";
import styles from "./CandlestickChart.module.scss";

interface CandlestickChartProps {
  coingeckoId: string;
  initialCandles: OhlcCandle[];
}

interface ChartCandle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isUp: boolean;
  bodyLow: number;
  bodyHigh: number;
  wickRange: [number, number];
}

function toChartCandle(candle: OhlcCandle & { volume?: number }): ChartCandle {
  const isUp = candle.close >= candle.open;
  return {
    timestamp: candle.timestamp,
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
    volume: candle.volume ?? 0,
    isUp,
    bodyLow: Math.min(candle.open, candle.close),
    bodyHigh: Math.max(candle.open, candle.close),
    wickRange: [candle.low, candle.high],
  };
}

function formatTimestamp(timestamp: number, selectedInterval: KlineInterval): string {
  const date = new Date(timestamp);
  if (selectedInterval === "1d" || selectedInterval === "3d" || selectedInterval === "1w" || selectedInterval === "1M") {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

interface CandleTooltipProps {
  active?: boolean;
  payload?: { payload: ChartCandle }[];
}

function CandleTooltip({ active, payload }: CandleTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipRow}>
        <span>O</span><span>{d.open.toFixed(2)}</span>
      </div>
      <div className={styles.tooltipRow}>
        <span>H</span><span>{d.high.toFixed(2)}</span>
      </div>
      <div className={styles.tooltipRow}>
        <span>L</span><span>{d.low.toFixed(2)}</span>
      </div>
      <div className={styles.tooltipRow}>
        <span className={d.isUp ? styles.tooltipUp : styles.tooltipDown}>C</span>
        <span className={d.isUp ? styles.tooltipUp : styles.tooltipDown}>{d.close.toFixed(2)}</span>
      </div>
    </div>
  );
}

export function CandlestickChart({ coingeckoId, initialCandles }: CandlestickChartProps) {
  const [selectedInterval, setSelectedInterval] = useState<KlineInterval>(DEFAULT_KLINE_INTERVAL);
  const [candles, setCandles] = useState<ChartCandle[]>(initialCandles.map(toChartCandle));

  const { kline } = useBinanceKline({ coingeckoId, interval: selectedInterval });

  useEffect(() => {
    if (!kline) return;
    setCandles((prev) => {
      const last = prev[prev.length - 1];
      const incoming: ChartCandle = {
        timestamp: kline.timestamp,
        open: kline.open,
        high: kline.high,
        low: kline.low,
        close: kline.close,
        volume: kline.volume,
        isUp: kline.close >= kline.open,
        bodyLow: Math.min(kline.open, kline.close),
        bodyHigh: Math.max(kline.open, kline.close),
        wickRange: [kline.low, kline.high],
      };

      if (last?.timestamp === kline.timestamp) {
        return [...prev.slice(0, -1), incoming];
      }
      if (kline.isClosed) {
        return [...prev, incoming];
      }
      return prev;
    });
  }, [kline]);

  useEffect(() => {
    setCandles(initialCandles.map(toChartCandle));
  }, [selectedInterval, initialCandles]);

  const prices = candles.flatMap((c) => [c.high, c.low]);
  const minPrice = Math.min(...prices) * 0.999;
  const maxPrice = Math.max(...prices) * 1.001;

  return (
    <div className={styles.wrapper}>
      <div className={styles.controls}>
        {KLINE_INTERVALS.map(({ label, value }) => (
          <button
            key={value}
            className={`${styles.intervalBtn} ${selectedInterval === value ? styles.active : ""}`}
            onClick={() => setSelectedInterval(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={380}>
        <ComposedChart data={candles} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(v: number) => formatTimestamp(v, selectedInterval)}
            tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
            axisLine={{ stroke: "var(--color-border-subtle)" }}
            tickLine={false}
            minTickGap={60}
          />
          <YAxis
            domain={[minPrice, maxPrice]}
            tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => v.toFixed(0)}
            width={60}
            orientation="right"
          />
          <Tooltip content={<CandleTooltip />} cursor={{ stroke: "var(--color-border)", strokeWidth: 1 }} />
          <Bar
            dataKey="bodyHigh"
            fill="transparent"
            stroke="transparent"
            shape={(props: unknown) => <CandleShape {...(props as CandleShapeProps)} />}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

interface CandleShapeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  payload: ChartCandle;
  yAxis: { scale: (v: number) => number };
}

function CandleShape({ x, width, payload, yAxis }: CandleShapeProps) {
  const scale = yAxis.scale;
  const highY = scale(payload.high);
  const lowY = scale(payload.low);
  const openY = scale(payload.open);
  const closeY = scale(payload.close);
  const bodyTop = Math.min(openY, closeY);
  const bodyBottom = Math.max(openY, closeY);
  const bodyHeight = Math.max(bodyBottom - bodyTop, 1);
  const centerX = x + width / 2;
  const color = payload.isUp ? "var(--color-accent-green)" : "var(--color-accent-red)";

  return (
    <g>
      <line x1={centerX} x2={centerX} y1={highY} y2={lowY} stroke={color} strokeWidth={1} />
      <rect x={x + 1} y={bodyTop} width={Math.max(width - 2, 1)} height={bodyHeight} fill={color} />
    </g>
  );
}
