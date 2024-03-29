"use client";

import { useCompanyStore } from "@/app/_store";
import { Company } from "@/app/_types/companies";
import { useEffect, useState } from "react";
import { Table, Pagination, Loader, Input } from "@mantine/core";
import _ from "lodash";

export default function CompanyContainer() {
  const limitPerPage = 10;

  const companyState = useCompanyStore((state) => state.companies);
  const companyCount = useCompanyStore((state) => state.count);
  const companyIsFetching = useCompanyStore((state) => state.isFetching);
  const fetchAllCompanies = useCompanyStore((state) => state.fetchAllCompanies);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [page, setPage] = useState<number>(1);
  const [filterText, setFilterText] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    if (companyState && companyState.length > 0) {
      setCompanies(getTabularizedCompanyList(filterText, page));
    } else {
      fetchAllCompanies();
    }
  }, [companyState]);

  useEffect(() => {
    if (companyState && companyState.length > 0) {
      setCompanies(getTabularizedCompanyList(filterText, page));
    }
  }, [page, filterText]);

  /**
   * Slices the company list based on start and end indices
   * @param {number} page
   * @returns {Company[]}
   */
  function getTabularizedCompanyList(filter: string, page: number): Company[] {
    const filteredCompanies = _.filter(companyState, (company: Company) => {
      const companySymbol = company.symbol.toLowerCase();
      const companyName = company.company_name.toLowerCase();
      const filterLowered = filter.toLowerCase();

      return filterLowered.length === 0
        || companySymbol.includes(filterLowered)
        || companyName.includes(filterLowered);
    });

    const totalPageCount = Math.ceil(filteredCompanies.length / limitPerPage);
    setTotalPages(totalPageCount);

    let activePage = page;
    if (activePage > totalPageCount) {
      activePage = totalPageCount;
    }
    const offset = (activePage - 1) * limitPerPage;
    setPage(activePage);
    return filteredCompanies.slice(offset, offset + limitPerPage);
  }

  /**
   * Renders table items
   * @param   {Company[]} companies 
   * @returns {React.ReactNode}
   */
  function renderTableItems(companies: Company[]) {
    if (companyIsFetching) {
      return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Loader color="blue" />
        </div>
      )
    }

    return companies.map((company: Company) => {
      return (
        <Table.Tr key={company.id}>
          <Table.Td>{company.symbol}</Table.Td>
          <Table.Td>{company.company_name}</Table.Td>
          <Table.Td>{company.sector_name}</Table.Td>
          <Table.Td>{company.subsector_name}</Table.Td>
          <Table.Td>{company.listing_date}</Table.Td>
        </Table.Tr>
      )
    });
  }
  
  return (
    <>
      <Input
        style={{ width: "20rem", paddingTop: "1rem", paddingBottom: "0.75rem" }}
        type="text"
        placeholder="Type here to filter companies..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Symbol</Table.Th>
            <Table.Th>Company Name</Table.Th>
            <Table.Th>Sector Name</Table.Th>
            <Table.Th>Subsector Name</Table.Th>
            <Table.Th>Listing Date</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {renderTableItems(companies)}
        </Table.Tbody>
      </Table>
      <Pagination
        style={{ paddingTop: "1rem", display: "flex", justifyContent: "center" }}
        total={totalPages}
        value={page}
        onChange={setPage}
      />
    </>
  )
}