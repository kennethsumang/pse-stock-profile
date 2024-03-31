"use client"

import { useEffect, useMemo, useState } from 'react';
import { Combobox, useCombobox, Text, Box, InputBase, Input, MantineStyleProp } from '@mantine/core';
import { useCompanyStore } from '@/app/_store';
import { Company } from '@/app/_types/companies';
import _ from 'lodash';
// import "./CompanySelector.module.css";

interface Props {
  onSelect: (company: Company) => void;
  optionStyle?: MantineStyleProp;
}

export default function CompanySelector({ onSelect, optionStyle }: Props) {
  const companyList = useCompanyStore((store) => store.companies);
  const isFetching = useCompanyStore((store) => store.isFetching);
  const fetchAllCompanies = useCompanyStore((store) => store.fetchAllCompanies);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company|null>(null);
  const options = useMemo(() => {
    return companyList
      .filter((company: Company) => {
        const searchLowered = search.toLowerCase();
        const companyNameLowered = company.company_name.toLowerCase();
        const symbolLowered = company.symbol.toLowerCase();

        return companyNameLowered.includes(searchLowered) || symbolLowered.includes(searchLowered);
      })
      .map((company: Company) => (
        <Combobox.Option
          value={company.id.toString()}
          key={company.id}
          style={optionStyle}
        >
          {`${company.symbol} - ${company.company_name}`}
        </Combobox.Option>
      ));
  }, [companyList, search]);
  const selectedCompanyLabel = useMemo(() => {
    if (!selectedCompany) {
      return null;
    }

    return `${selectedCompany.symbol} - ${selectedCompany.company_name}`;
  }, [selectedCompany]);
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
      setSearch('');
    },

    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });

  useEffect(() => {
    if ((!companyList || companyList.length === 0) && !isFetching) {
      fetchAllCompanies();
    }
  }, [companyList, isFetching]);

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(id: string) => {
        const company = _.find(companyList, { id: Number(id) });
        if (!company) {
          return;
        }
        setSelectedCompany(company);
        onSelect(company);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          classNames={{ input: "company__input" }}
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          onClick={() => combobox.toggleDropdown()}
        >
          {selectedCompanyLabel || <Input.Placeholder>Pick company</Input.Placeholder>}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown style={{ overflowY: "hidden", overflowX: "hidden" }}>
        <Combobox.Search
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Search companies"
        />
        <Combobox.Options style={{ height: "24rem", overflowY: "auto", overflowX: "hidden" }}>
          {options}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}