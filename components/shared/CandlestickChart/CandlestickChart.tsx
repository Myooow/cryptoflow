"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, CandlestickSeries, IChartApi, ISeriesApi } from "lightweight-charts";
import { useBinanceKline } from "@/hooks/useBinanceStream";
import { CHART_COLORS, PERIOD_BUTTONS } from "@/lib/constants";
import type { OhlcCandle } from "@/types/token";
import type { KlineInterval } from "@/types/websocket";
import styles from "./CandlestickChart.module.scss";

interface CandlestickChartProps {
  coingeckoId: string;
  initialCandles: OhlcCandle[];
}

const PERIOD_TO_INTERVAL: Record<number, KlineInterval> = {
  1: "1h",
  7: "4h",
  30: "1d",
  90: "1d",
  180: "1d",
  365: "1w",
};

export function CandlestickChart({ coingeckoId, initialCandles }: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [selectedDays, setSelectedDays] = useState(1);

  const interval = PERIOD_TO_INTERVAL[selectedDays] ?? "1h";
  const { kline } = useBinanceKline({ coingeckoId, interval });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      width: container.clientWidth,
      height: 360,
      layout: {
        background: { color: CHART_COLORS.background },
        textColor: CHART_COLORS.text,
        fontSize: 12,
        fontFamily: "Inter, system-ui, sans-serif",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: true, color: CHART_COLORS.grid, style: 2 },
      },
      rightPriceScale: { borderColor: CHART_COLORS.border },
      timeScale: {
        borderColor: CHART_COLORS.border,
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: true,
      handleScale: true,
      crosshair: {
        mode: 1,
        vertLine: { visible: true, color: CHART_COLORS.crosshairV, width: 1, style: 0 },
        horzLine: { visible: true, color: CHART_COLORS.crosshairH, width: 1, style: 0 },
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: CHART_COLORS.candleUp,
      downColor: CHART_COLORS.candleDown,
      wickUpColor: CHART_COLORS.candleUp,
      wickDownColor: CHART_COLORS.candleDown,
      borderVisible: false,
    });

    const data = initialCandles.map((c) => ({
      time: Math.floor(c.timestamp / 1000) as number,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    series.setData(data as Parameters<typeof series.setData>[0]);
    chart.timeScale().fitContent();

    chartRef.current = chart;
    seriesRef.current = series;

    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;
      chart.applyOptions({ width: entries[0].contentRect.width });
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [initialCandles, selectedDays]);

  useEffect(() => {
    if (!kline || !seriesRef.current) return;
    seriesRef.current.update({
      time: Math.floor(kline.timestamp / 1000) as number,
      open: kline.open,
      high: kline.high,
      low: kline.low,
      close: kline.close,
    } as Parameters<typeof seriesRef.current.update>[0]);
  }, [kline]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.controls}>
        <span className={styles.controlsLabel}>Period</span>
        <div className={styles.buttons}>
          {PERIOD_BUTTONS.map(({ label, days }) => (
            <button
              key={days}
              className={`${styles.btn} ${selectedDays === days ? styles.btnActive : ""}`}
              onClick={() => setSelectedDays(days)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div ref={containerRef} className={styles.chart} />
    </div>
  );
}
