"use client"

import { useEffect, useState } from "react";
import { Transaction, TransactionResponse } from "@/app/_types/transactions";
import { getCurrentDomain } from "@/app/_utils/http.library";
import useToast from "@/app/_hooks/useToast";

export default function TransactionsContainer() {
  const toast = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    fetch(`${getCurrentDomain()}/api/transactions`, { method: "GET" })
      .then((response) => response.json())
      .then((response: TransactionResponse) => {
        setTransactions(response.data);
        setCount(response.total);
        console.log(response);
      })
      .catch((e) => toast("error", (e as Error).message));
  }, []);

  return (
    <>
      <h1>Transaction List</h1>
    </>
  )
}