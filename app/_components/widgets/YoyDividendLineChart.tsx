"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getCurrentDomain } from "@/app/_utils/http.library";
import useToast from "@/app/_hooks/useToast";
import WidgetContainer from "./WidgetContainer";
import { Loader } from "@mantine/core";

interface YoyData {
  year: string;
  total_amt: number;
}

export default function YoyDividendLineChart() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<YoyData[]>([]);

  useEffect(() => {
    fetchYoyData();
  }, []);

  /**
   * Fetches the Year-On-Year dividend data from API
   */
  function fetchYoyData() {
    setIsLoading(true);
    const url = new URL(`${getCurrentDomain()}/api/dividends/yoy`);
    fetch(url)
      .then((response) => response.json())
      .then((yoyData: { data: YoyData[] }) => {
        setData(yoyData.data);
      })
      .catch((e) => toast("error", (e as Error).message))
      .finally(() => setIsLoading(false));
  }

  if (isLoading || data.length === 0) {
    return (
      <WidgetContainer>
        <Loader />
      </WidgetContainer>
    )
  }

  return (
    <WidgetContainer>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="total_amt"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </WidgetContainer>
  );
}
