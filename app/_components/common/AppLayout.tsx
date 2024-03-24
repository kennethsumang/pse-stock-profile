"use client";

import { AppShell, Burger, Button, Group, NavLink, Text, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBrandMantine, IconBuilding, IconHome2, IconLogout } from "@tabler/icons-react";
import NavbarNewMenuButton from "./NavbarNewMenuButton";
import { useRouter } from "next/navigation";
import RequestLibrary from "@/app/_libraries/request.library";
import { getCurrentDomain } from "@/app/_utils/http.library";
import useToast from "@/app/_hooks/useToast";

interface Props {
  children: React.ReactNode;
}
  
export default function AppLayout({ children }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [opened, { toggle }] = useDisclosure();

  function handleNavClick(e: React.MouseEvent ,href: string) {
    e.preventDefault();
    router.push(href);
  }

  async function handleLogoutClick() {
    const response = await requestLogout();
    if (!response) {
      toast("error", "Logout failed.");
      return;
    }

    toast("success", "Logged out successfully!");
    router.push("/");
  }

  async function requestLogout(): Promise<boolean> {
    try {
      const response = await RequestLibrary.request<{ data: string }>(
        `${getCurrentDomain()}/api/auth/logout`,
        { method: 'POST' },
      );

      return true;
    } catch (e) {
      return false;
    }
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
      <AppShell.Navbar p="md" style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
        <div>
        <NavbarNewMenuButton />
        <div style={{ marginTop: rem(20) }}>
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
        </div></div><div>
        <Button color="red" fullWidth style={{ marginBottom: "auto" }} onClick={() => handleLogoutClick()}>
          <IconLogout size={20}  />
          <Text pl="1rem">Logout</Text>
        </Button></div>
      </AppShell.Navbar>
      <AppShell.Main>
        { children }
      </AppShell.Main>
      <AppShell.Footer p="md" ta="center">
        { `© Kenneth Sumang, ${new Date().getFullYear()}` }
      </AppShell.Footer>
    </AppShell>
  );
}