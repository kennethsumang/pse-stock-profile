"use client";

import { Menu, Button, Text, rem } from "@mantine/core";
import { IconPlus, IconCashBanknote } from "@tabler/icons-react";
import { useState } from "react";
import AddDividendModal from "../dividends/AddDividendModal";
import AddTransactionModal from "../transactions/AddTransactionModal";

export default function NavbarNewMenuButton() {
  const [isTransactionModalOpen, setIsTransactionModalOpen] =
    useState<boolean>(false);
  const [isAddDividendModalOpen, setIsAddDividendModalOpen] =
    useState<boolean>(false);

  return (
    <>
      <Menu shadow="md" width={250}>
        <Menu.Target>
          <Button fullWidth>
            <IconPlus size={20} />
            <Text pl="1rem">New</Text>
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Stocks Transactions</Menu.Label>
          <Menu.Item
            leftSection={
              <IconCashBanknote
                style={{ width: rem(14), height: rem(14), color: "green" }}
              />
            }
            onClick={() => setIsTransactionModalOpen(true)}
          >
            Add Transaction Record
          </Menu.Item>

          <Menu.Label>Dividend Transactions</Menu.Label>
          <Menu.Item
            leftSection={
              <IconCashBanknote
                style={{ width: rem(14), height: rem(14), color: "green" }}
              />
            }
            onClick={() => setIsAddDividendModalOpen(true)}
          >
            Add New Record
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <AddTransactionModal
        open={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
      />
      <AddDividendModal
        open={isAddDividendModalOpen}
        onClose={() => setIsAddDividendModalOpen(false)}
      />
    </>
  );
}
