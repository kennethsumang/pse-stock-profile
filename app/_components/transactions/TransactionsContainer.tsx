"use client"

import { useEffect, useMemo, useState } from "react";
import { Transaction, TransactionResponse } from "@/app/_types/transactions";
import { getCurrentDomain } from "@/app/_utils/http.library";
import useToast from "@/app/_hooks/useToast";
import { Loader, Pagination, Table } from "@mantine/core";
import { DateTime } from "luxon";

export default function TransactionsContainer() {
  const toast = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [count, setCount] = useState<number>(0);
  const [limitPerPage, setLimitPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const totalPages = useMemo(() => {
    return Math.ceil(count/limitPerPage);
  }, [count, limitPerPage]);

  useEffect(() => {
    fetchTransactions();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    fetchTransactions();
  }, [limitPerPage]);

  function fetchTransactions() {
    setIsLoading(true);
    
    const url = new URL(`${getCurrentDomain()}/api/transactions`);
    url.searchParams.append("page", currentPage.toString());
    url.searchParams.append("limit", limitPerPage.toString());
    fetch(url.toString(), { method: "GET" })
      .then((response) => response.json())
      .then((response: TransactionResponse) => {
        setTransactions(response.data);
        setCount(response.total);
        console.log(response);
      })
      .catch((e) => toast("error", (e as Error).message))
      .finally(() => setIsLoading(false));
  }

  function renderTableItems(): React.ReactNode {
    if (isLoading) {
      return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Loader color="blue" />
        </div>
      );
    }

    return transactions.map((transaction: Transaction) => {
      return (
        <Table.Tr key={transaction.id}>
          <Table.Td>{DateTime.fromISO(transaction.transaction_timestamp).toLocaleString()}</Table.Td>
          <Table.Td>{transaction.type.toUpperCase()}</Table.Td>
          <Table.Td>{transaction.companies.symbol}</Table.Td>
          <Table.Td>{transaction.price}</Table.Td>
          <Table.Td>{transaction.quantity}</Table.Td>
          <Table.Td>{transaction.tax_amount}</Table.Td>
          <Table.Td>{(transaction.price * transaction.quantity) + transaction.tax_amount}</Table.Td>
        </Table.Tr>
      );
    });
  }

  return (
    <>
      {/* <Input
        style={{ width: "20rem", paddingTop: "1rem", paddingBottom: "0.75rem" }}
        type="text"
        placeholder="Type here to filter companies..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      /> */}
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Date</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Symbol</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Quantity</Table.Th>
            <Table.Th>Tax Amount</Table.Th>
            <Table.Th>Total</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {renderTableItems()}
        </Table.Tbody>
      </Table>
      <Pagination
        style={{ paddingTop: "1rem", display: "flex", justifyContent: "center" }}
        total={totalPages}
        value={currentPage}
        onChange={setCurrentPage}
      />
    </>
  )
}