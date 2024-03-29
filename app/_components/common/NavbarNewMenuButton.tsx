"use client";

import { Menu, Button, Text, rem } from '@mantine/core';
import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight,
  IconPlus,
  IconCashBanknote,
} from '@tabler/icons-react';
import { useState } from 'react';
import BuyTransactionModal from '../transactions/BuyTransactionModal';
import SellTransactionModal from '../transactions/SellTransactionModal';
import AddDividendModal from '../transactions/AddDividendModal';

export default function NavbarNewMenuButton() {
  const [isBuyModalOpen, setIsBuyModalOpen] = useState<boolean>(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState<boolean>(false);
  const [isAddDividendModalOpen, setIsAddDividendModalOpen] = useState<boolean>(false);

  return (
    <>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Button fullWidth>
              <IconPlus size={20}  />
              <Text pl="1rem">New</Text>
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Stocks Transactions</Menu.Label>
          <Menu.Item
            leftSection={<IconCashBanknote style={{ width: rem(14), height: rem(14), color: "green" }} />}
            onClick={() => setIsBuyModalOpen(true)}
          >
            Add Buy Record
          </Menu.Item>
          <Menu.Item
            leftSection={<IconCashBanknote style={{ width: rem(14), height: rem(14), color: "red" }} />}
            onClick={() => setIsSellModalOpen(true)}
          >
            Add Sell Record
          </Menu.Item>
          
          <Menu.Label>Dividend Transactions</Menu.Label>
          <Menu.Item
            leftSection={<IconCashBanknote style={{ width: rem(14), height: rem(14), color: "green" }} />}
            onClick={() => setIsAddDividendModalOpen(true)}
          >
            Add New Record
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <BuyTransactionModal open={isBuyModalOpen} onClose={() => setIsBuyModalOpen(false)} />
      <SellTransactionModal open={isSellModalOpen} onClose={() => setIsSellModalOpen(false)} />
      <AddDividendModal open={isAddDividendModalOpen} onClose={() => setIsAddDividendModalOpen(false)} />
    </>
  );
}