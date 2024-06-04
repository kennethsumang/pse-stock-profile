"use client";

import { useEffect, useMemo, useState } from "react";
import { DateTimePicker } from "@mantine/dates";
import { getCurrentDomain } from "@/app/_utils/http.library";
import useToast from "@/app/_hooks/useToast";
import {
  Button,
  Checkbox,
  Combobox,
  Input,
  InputBase,
  Loader,
  Modal,
  Pagination,
  ScrollArea,
  Table,
  useCombobox,
} from "@mantine/core";
import { DateTime } from "luxon";
import CompanySelector from "../companies/CompanySelector";
import { Company } from "@/app/_types/companies";
import { useDividendStore } from "@/app/_store";
import { Dividend, DividendResponse } from "@/app/_types/dividends";
import _ from "lodash";
import { useDisclosure } from "@mantine/hooks";
import { IconFilter, IconTrash } from "@tabler/icons-react";

export default function DividendsContainer() {
  const toast = useToast();
  const dividendKey = useDividendStore((state) => state.key);
  const increment = useDividendStore((state) => state.increment);
  const [dividends, setDividends] = useState<Dividend[]>([]);
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
  const [selectedDividendIds, setSelectedDividendIds] = useState<number[]>([]);
  const selectedIdsInPage = useMemo(() => {
    const transactionIdsInPage = _.map(dividends, 'id');
    return _.intersection(selectedDividendIds, transactionIdsInPage);
  }, [selectedDividendIds, dividends]);
  const [deleteConfirmModalOpened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    fetchDividends();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    fetchDividends();
  }, [limitPerPage, companyFilter, dateFrom, dateTo]);

  useEffect(() => {
    setCompanyFilter(null);
    // setDateFrom(DateTime.now().minus({ month: 1 }).toJSDate());
    // setDateTo(DateTime.now().toJSDate());
    fetchDividends();
  }, [dividendKey]);

  /**
   * Fetches dividends from API
   */
  function fetchDividends() {
    setIsLoading(true);

    const url = new URL(`${getCurrentDomain()}/api/dividends`);
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
      .then((response: DividendResponse) => {
        setDividends(response.data);
        setCount(response.total);
        console.log(response);
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

    if (dividends.length === 0) {
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
          dividends.map((dividend: Dividend) => {
            return (
              <Table.Tr key={dividend.id}>
                <Table.Td>
                  <Checkbox
                    style={{ cursor: 'pointer' }}
                    checked={selectedDividendIds.includes(dividend.id)}
                    onChange={() => onToggleItemCheckbox(dividend.id)}
                  />
                </Table.Td>
                <Table.Td>
                  {DateTime.fromISO(dividend.dividend_timestamp).toLocaleString()}
                </Table.Td>
                <Table.Td>{dividend.companies.symbol}</Table.Td>
                <Table.Td>{`₱ ${dividend.amount_per_share}`}</Table.Td>
                <Table.Td>{dividend.no_of_shares}</Table.Td>
                <Table.Td>{`₱ ${dividend.tax_amount}`}</Table.Td>
                <Table.Td>{`₱ ${clipToTwoDecimalPlaces(dividend.amount_per_share * dividend.no_of_shares - dividend.tax_amount)}`}</Table.Td>
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
    if (selectedDividendIds.includes(id)) {
      const newList = _.without([...selectedDividendIds], id);
      setSelectedDividendIds(newList);
      return;
    }

    const newList = [...selectedDividendIds, id];
    setSelectedDividendIds(newList);
  }

  /**
   * On click handler for page checkbox
   * @param {boolean} isChecked
   */
  function onTogglePageCheckbox(isChecked: boolean) {
    if (isChecked) {
      const dividendIdsInPage = _.map(dividends, 'id');
      const newList = [...selectedDividendIds, ...dividendIdsInPage];
      setSelectedDividendIds(_.uniq(newList));
      return;
    }

    const dividendIdsInPage = _.map(dividends, 'id');
    const newList = _.difference(selectedDividendIds, dividendIdsInPage);
    setSelectedDividendIds(newList);
  }

  /**
   * Handles deleting dividend records selected
   */
  function handleDeleteDividendRecords() {
    const url = new URL(`${getCurrentDomain()}/api/dividends`);
    fetch(
      url.toString(),
      {
        method: 'DELETE',
        body: JSON.stringify({
          dividend_ids: selectedDividendIds,
        })
      }
    )
      .then((response) => response.json())
      .then((response: DividendResponse) => toast("success", `${response.data.length} dividend records deleted.`))
      .catch((e) => toast("error", (e as Error).message))
      .finally(() => {
        close();
        increment();
      });
  }

  /**
   * Renders filter row based on `filterHidden` state
   * @returns {React.ReactNode}
   */
  function renderFilterRow(): React.ReactNode {
    if (filterHidden) {
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
    <>
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
            selectedDividendIds.length > 0
            &&  <IconTrash size={20} color="red" style={{ cursor: "pointer" }} onClick={open} />
          }
          <IconFilter
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => setFilterHidden(!filterHidden)}
          />
        </div>
        {renderFilterRow()}
        <ScrollArea w="100%">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <Checkbox
                    style={{ cursor: 'pointer' }}
                    checked={selectedIdsInPage.length !== 0 && selectedIdsInPage.length === dividends.length}
                    indeterminate={selectedIdsInPage.length > 0 && selectedIdsInPage.length !== dividends.length}
                    onChange={(e) => onTogglePageCheckbox(e.currentTarget.checked)}
                  />
                </Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Symbol</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th># of Shares</Table.Th>
                <Table.Th>Tax Amount</Table.Th>
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
      <Modal
        opened={deleteConfirmModalOpened}
        withCloseButton={false}
        centered={true}
        onClose={close}
        title={<span style={{ fontWeight: "bold" }}>Confirm Transaction Deletion</span>}
        style={{ padding: "2rem" }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ marginBottom: "2rem" }}>
            Are you sure you want to delete {selectedDividendIds.length} dividend records? This can not be undone.
          </span>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", columnGap: "1rem" }}>
            <Button
              variant="filled"
              color="gray"
              style={{ width: "100px" }}
              onClick={close}
            >
              Cancel
            </Button>
            <Button
              variant="filled"
              color="red"
              style={{ width: "100px" }}
              onClick={handleDeleteDividendRecords}
            >
              OK
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
