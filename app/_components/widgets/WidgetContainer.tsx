"use client";

import { Paper } from "@mantine/core";

interface Props {
  children: React.ReactNode;
}

/**
 * WidgetContainer component
 * @author Kenneth Sumang
 */
export default function WidgetContainer({ children }: Props) {
  return (
    <Paper
      withBorder
      // w="100%"
      h="20rem"
      p="1rem"
    >
      {children}
    </Paper>
  );
}
