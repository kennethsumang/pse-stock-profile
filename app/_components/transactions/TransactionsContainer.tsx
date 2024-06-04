"use client";

import { useEffect, useMemo, useState } from "react";
import { DateTimePicker } from "@mantine/dates";
import { Transaction, TransactionResponse } from "@/app/_types/transactions";
import { getCurrentDomain } from "@/app/_utils/http.library";
import useToast from "@/app/_hooks/useToast";
import {
  Checkbox,
  Combobox,
  Input,
  InputBase,
  Loader,
  Pagination,
  ScrollArea,
  Table,
  useCombobox,
} from "@mantine/core";
import { DateTime } from "luxon";
import CompanySelector from "../companies/CompanySelector";
import { Company } from "@/app/_types/companies";
import { useTransactionStore } from "@/app/_store";
import { IconFilter, IconTrash } from "@tabler/icons-react";
import _ from "lodash";

export default function TransactionsContainer() {
  const toast = useToast();
  const transactionKey = useTransactionStore((state) => state.key);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [count, setCount] = useState<number>(0);
  const [limitPerPage, setLimitPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [companyFilter, setCompanyFilter] = useState<Company | null>(null);
  const [dateFrom, setDateFrom] = useState<Date>(
    DateTime.now().minus({ month: 1 }).toJSDate(),
  );
  const [dateTo, setDateTo] = useState<Date>(DateTime.now().toJSDate());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterHidden, setFilterHidden] = useState<boolean>(true);
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const totalPages = useMemo(() => {
    return Math.ceil(count / limitPerPage);
  }, [count, limitPerPage]);

  // For select/unselect
  const [selectedTransactionIds, setSelectedTransactionIds] = useState<number[]>([]);
  const selectedIdsInPage = useMemo(() => {
    const transactionIdsInPage = _.map(transactions, 'id');
    return _.intersection(selectedTransactionIds, transactionIdsInPage);
  }, [selectedTransactionIds, transactions]);

  useEffect(() => {
    fetchTransactions();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    fetchTransactions();
  }, [limitPerPage, companyFilter, dateFrom, dateTo]);

  useEffect(() => {
    setCompanyFilter(null);
    // setDateFrom(DateTime.now().minus({ month: 1 }).toJSDate());
    // setDateTo(DateTime.now().toJSDate());
    fetchTransactions();
  }, [transactionKey]);

  /**
   * Fetches transactions from API
   */
  function fetchTransactions() {
    setIsLoading(true);

    const url = new URL(`${getCurrentDomain()}/api/transactions`);
    url.searchParams.append("page", currentPage.toString());
    url.searchParams.append("limit", limitPerPage.toString());
    url.searchParams.append(
      "date-from",
      DateTime.fromJSDate(dateFrom).toISO()!,
    );
    url.searchParams.append("date-to", DateTime.fromJSDate(dateTo).toISO()!);

    if (companyFilter) {
      url.searchParams.append("symbol", companyFilter.symbol);
    }

    fetch(url.toString(), { method: "GET" })
      .then((response) => response.json())
      .then((response: TransactionResponse) => {
        setTransactions(response.data);
        setCount(response.total);
      })
      .catch((e) => toast("error", (e as Error).message))
      .finally(() => setIsLoading(false));
  }

  /**
    * Clips a floating-point number to two decimal places.
    * 
    * @param {number} num - The number to clip.
    * @returns {number} The clipped number with two decimal places.
    */
  function clipToTwoDecimalPlaces(num: number) {
    return parseFloat(num.toFixed(2));
  }

  /**
   * Renders the transaction table items
   * @returns {React.ReactNode}
   */
  function renderTableItems(): React.ReactNode {
    if (isLoading) {
      return (
        <Table.Tbody
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <Table.Tr>
            <Table.Td colSpan={8} style={{ textAlign: "center" }}>
                <Loader color="blue" />
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      );
    }

    if (transactions.length === 0) {
      return (
        <Table.Tbody>
          <Table.Tr>
            <Table.Td colSpan={8} style={{ textAlign: "center" }}>
              No results.
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      );
    }

    return (
      <Table.Tbody>
        {
          transactions.map((transaction: Transaction) => {
            return (
              <Table.Tr key={transaction.id}>
                <Table.Td>
                  <Checkbox
                    style={{ cursor: 'pointer' }}
                    checked={selectedTransactionIds.includes(transaction.id)}
                    onChange={() => onToggleItemCheckbox(transaction.id)}
                  />
                </Table.Td>
                <Table.Td>
                  {DateTime.fromISO(
                    transaction.transaction_timestamp,
                  ).toLocaleString()}
                </Table.Td>
                <Table.Td>{transaction.type.toUpperCase()}</Table.Td>
                <Table.Td>{transaction.companies.symbol}</Table.Td>
                <Table.Td>{`₱ ${transaction.price}`}</Table.Td>
                <Table.Td>{transaction.quantity}</Table.Td>
                <Table.Td>{`₱ ${transaction.tax_amount}`}</Table.Td>
                <Table.Td>
                  {
                    transaction.type === 'buy'
                      ? <>{`₱ ${clipToTwoDecimalPlaces(transaction.price * transaction.quantity + transaction.tax_amount)}`}</>
                      : <>{`₱ ${clipToTwoDecimalPlaces(transaction.price * transaction.quantity - transaction.tax_amount)}`}</>
                  }
                </Table.Td>
              </Table.Tr>
            );
          })
        }
      </Table.Tbody>
    );
  }

  /**
   * On click handler for transaction item checkbox
   * @param   {number} id
   */
  function onToggleItemCheckbox(id: number) {
    if (selectedTransactionIds.includes(id)) {
      const newList = _.without([...selectedTransactionIds], id);
      setSelectedTransactionIds(newList);
      return;
    }

    const newList = [...selectedTransactionIds, id];
    setSelectedTransactionIds(newList);
  }

  /**
   * On click handler for page checkbox
   * @param {boolean} isChecked
   */
  function onTogglePageCheckbox(isChecked: boolean) {
    if (isChecked) {
      const transactionIdsInPage = _.map(transactions, 'id');
      const newList = [...selectedTransactionIds, ...transactionIdsInPage];
      setSelectedTransactionIds(_.uniq(newList));
      return;
    }

    const transactionIdsInPage = _.map(transactions, 'id');
    const newList = _.difference(selectedTransactionIds, transactionIdsInPage);
    setSelectedTransactionIds(newList);
  }

  /**
   * Renders filter row based on `filterHidden` state
   * @returns {React.ReactNode}
   */
  function renderFilterRow(): React.ReactNode {
    if (filterHidden === true) {
      return <></>;
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div style={{ width: "18rem" }}>
          <CompanySelector
            onSelect={(company) => setCompanyFilter(company)}
            addAllCompaniesOption={true}
          />
        </div>
        <div
          style={{ display: "flex", flexDirection: "row", columnGap: "1rem" }}
        >
          <DateTimePicker
            placeholder="Date From"
            style={{ width: "12rem" }}
            value={dateFrom}
            onChange={(val) => setDateFrom(val as Date)}
          />
          <span style={{ marginTop: "0.3rem" }}>&nbsp;~&nbsp;</span>
          <DateTimePicker
            placeholder="Date To"
            style={{ width: "12rem" }}
            value={dateTo}
            onChange={(val) => setDateTo(val as Date)}
          />
          <Combobox
            store={combobox}
            onOptionSubmit={(val) => {
              setLimitPerPage(Number(val));
              combobox.closeDropdown();
            }}
          >
            <Combobox.Target>
              <InputBase
                component="button"
                type="button"
                pointer
                rightSection={<Combobox.Chevron />}
                rightSectionPointerEvents="none"
                onClick={() => combobox.toggleDropdown()}
                style={{ width: "8rem" }}
              >
                {`${limitPerPage} items` || (
                  <Input.Placeholder>Limit</Input.Placeholder>
                )}
              </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
              <Combobox.Options>
                <Combobox.Option value="1">1 item</Combobox.Option>
                <Combobox.Option value="10">10 items</Combobox.Option>
                <Combobox.Option value="25">25 items</Combobox.Option>
                <Combobox.Option value="50">50 items</Combobox.Option>
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", paddingTop: "1rem" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: "1rem",
          marginBottom: "1rem"
        }}
      >
        {
          selectedTransactionIds.length > 0 &&  <IconTrash size={20} color="red" style={{ cursor: "pointer" }} />
        }
        <IconFilter
          size={20}
          style={{ cursor: "pointer" }}
          onClick={() => setFilterHidden(!filterHidden)}
        />
      </div>
      { renderFilterRow() }
      
      <ScrollArea w="100%">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Checkbox
                  style={{ cursor: 'pointer' }}
                  checked={selectedIdsInPage.length !== 0 && selectedIdsInPage.length === transactions.length}
                  indeterminate={selectedIdsInPage.length > 0 && selectedIdsInPage.length !== transactions.length}
                  onChange={(e) => onTogglePageCheckbox(e.currentTarget.checked)}
                />
              </Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Symbol</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>Quantity</Table.Th>
              <Table.Th>Tax & Fees</Table.Th>
              <Table.Th>Total</Table.Th>
            </Table.Tr>
          </Table.Thead>

          {renderTableItems()}
        </Table>
      </ScrollArea>
      <Pagination
        style={{
          paddingTop: "1rem",
          display: "flex",
          justifyContent: "center",
        }}
        total={totalPages}
        value={currentPage}
        onChange={setCurrentPage}
      />
    </div>
  );
}
