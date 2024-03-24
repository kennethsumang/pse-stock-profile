"use client";

import { AppShell, Burger, Group, NavLink, Text, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBrandMantine, IconBuilding, IconHome2 } from "@tabler/icons-react";
import NavbarNewMenuButton from "./NavbarNewMenuButton";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
}
  
export default function AppLayout({ children }: Props) {
  const router = useRouter();
  const [opened, { toggle }] = useDisclosure();

  function handleNavClick(e: React.MouseEvent ,href: string) {
    e.preventDefault();
    router.push(href);
  }

  return (
    <AppShell
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      aside={{ width: 300, breakpoint: "md", collapsed: { desktop: false, mobile: true } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <IconBrandMantine size={30} />
          <Text size="lg">PSE Stock Profile</Text>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <NavbarNewMenuButton />
        <div style={{ marginTop: rem(1) }}>
          <NavLink
            href=""
            label="Home"
            leftSection={<IconHome2 size={20} />}
            onClick={(e) => handleNavClick(e, "/app")}
          />
          <NavLink
            href=""
            label="Company List"
            leftSection={<IconBuilding size={20} />}
            onClick={(e) => handleNavClick(e, "/app/companies")}
          />
        </div>
      </AppShell.Navbar>
      <AppShell.Main>
        { children }
      </AppShell.Main>
      <AppShell.Footer p="md">Footer</AppShell.Footer>
    </AppShell>
  );
}