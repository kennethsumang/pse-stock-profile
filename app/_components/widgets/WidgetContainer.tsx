"use client";

import { Paper } from "@mantine/core";

interface Props {
  children: React.ReactNode;
  height?: string;
  width?: string;
  padding?: string;
}

/**
 * WidgetContainer component
 * @author Kenneth Sumang
 */
export default function WidgetContainer({ children, height, padding }: Props) {
  const h = height || "20rem";
  const p = padding || "1rem"

  return (
    <Paper
      withBorder
      // w="100%"
      h={h}
      p={p}
    >
      {children}
    </Paper>
  );
}
