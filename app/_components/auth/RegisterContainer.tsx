"use client";

import { Paper, Text } from "@mantine/core";
import Link from "next/link";
import RegisterForm from "./RegisterForm";

/**
 * RegisterContainer component
 * @author Kenneth Sumang
 */
export default function RegisterContainer() {
  return (
    <Paper
      withBorder
      w={{
        md: "100%",
        xl: "50%",
      }}
      p="3rem"
    >
      <Text
        style={{
          fontSize: "1.5rem",
          lineHeight: "2rem",
          fontWeight: "700",
          paddingBottom: "2rem",
        }}
        variant="text"
        size="xl"
      >
        Register
      </Text>
      <RegisterForm />
      <Text pt="1rem">
        Already have an account? <Link href="/">Log in</Link>.
      </Text>
    </Paper>
  );
}
