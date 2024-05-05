"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Text } from "@mantine/core";
import { getCurrentDomain } from "@/app/_utils/http.library";
import useToast from "@/app/_hooks/useToast";
import WidgetContainer from "./WidgetContainer";
import { Loader } from "@mantine/core";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import _ from "lodash";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Total Year-on-Year Dividends',
    },
  },
};


interface YoyData {
  year: string;
  total_amt: number;
}

export default function YoyDividendLineChart() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<YoyData[]>([]);
  const chartData = useMemo(() => {
    return {
      labels: _.map(data, 'year'),
      datasets: [
        {
          label: 'Dataset 1',
          data: _.map(data, 'total_amt'),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };
  }, [data]);

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

  console.log(data);
  return (
    <WidgetContainer>
      <Line options={options} data={chartData} />
    </WidgetContainer>
  );
}
