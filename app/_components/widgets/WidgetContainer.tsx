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
      // w={{
      //   md: "100%",
      //   xl: "50%",
      // }}
      p="3rem"
    >
      {children}
    </Paper>
  );
}
