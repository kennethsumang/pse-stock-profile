'use client'

import { MantineProvider, createTheme } from "@mantine/core";

interface Props {
  children: React.ReactNode;
}

const theme = createTheme({
  /** Put your mantine theme override here */
});

/**
 * MantineProvider component
 * @author Kenneth Sumang
 */
export default function MantineProviderComponent({ children }: Props) {
  return (
    <MantineProvider theme={theme} forceColorScheme="light" defaultColorScheme="light">
      { children }
    </MantineProvider>
  );
}