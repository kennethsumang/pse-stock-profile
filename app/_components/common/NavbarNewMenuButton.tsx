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

export default function NavbarNewMenuButton() {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button>
            <IconPlus size={20}  />
            <Text pl="1rem">New</Text>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Stocks Transactions</Menu.Label>
        <Menu.Item leftSection={<IconCashBanknote style={{ width: rem(14), height: rem(14), color: "green" }} />}>
          Add Buy Record
        </Menu.Item>
        <Menu.Item leftSection={<IconCashBanknote style={{ width: rem(14), height: rem(14), color: "red" }} />}>
          Add Sell Record
        </Menu.Item>
        
        <Menu.Label>Dividend Transactions</Menu.Label>
        <Menu.Item leftSection={<IconCashBanknote style={{ width: rem(14), height: rem(14), color: "green" }} />}>
          Add New Record
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}