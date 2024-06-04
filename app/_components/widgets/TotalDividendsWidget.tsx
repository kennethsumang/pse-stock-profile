"use client";

import React, { useEffect, useState } from "react";
import { getCurrentDomain } from "@/app/_utils/http.library";
import { Text } from "@mantine/core";
import useToast from "@/app/_hooks/useToast";
import WidgetContainer from "./WidgetContainer";
import { Loader } from "@mantine/core";
import _ from "lodash";


interface YoyData {
  year: string;
  total_amt: number;
}

export default function TotalDividendsWidget() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    fetchTotalData();
  }, []);

  /**
   * Fetches the Year-On-Year dividend data from API
   */
  function fetchTotalData() {
    setIsLoading(true);
    const url = new URL(`${getCurrentDomain()}/api/dividends/total`);
    fetch(url)
      .then((response) => response.json())
      .then((totalData: { data: number }) => {
        setTotal(totalData.data);
      })
      .catch((e) => toast("error", (e as Error).message))
      .finally(() => setIsLoading(false));
  }

  /**
   * Format a number with commas according to the user's locale.
   * @param {number} number - The number to format.
   * @param {string} [locale='en-US'] - The locale to use for formatting. Defaults to 'en-US'.
   * @returns {string} The formatted number with commas.
   */
  function formatNumberWithCommas(number: number): string {
    return new Intl.NumberFormat().format(number);
  }

  if (isLoading) {
    return (
      <WidgetContainer>
        <Loader />
      </WidgetContainer>
    )
  }

  return (
    <WidgetContainer height="10rem">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Text style={{ fontWeight: "bold", color: "" }}>Total Dividends So Far</Text>
        <div style={{ display: "flex", flexDirection: "row", marginTop: "1rem" }}>
            <Text style={{
                fontSize: "16px",
                fontWeight: "bolder",
                color: "#757575",
                paddingTop: "0.75rem",
                marginRight: "0.5rem"
              }}
            >
              PHP
            </Text>
            <Text style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{ formatNumberWithCommas(total) }</Text>
        </div>
      </div>
    </WidgetContainer>
  );
}
