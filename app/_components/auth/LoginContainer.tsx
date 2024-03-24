'use client'

import { Paper, Text } from "@mantine/core";
import LoginForm from "./LoginForm";
import classes from "./LoginContainer.module.css";
import Link from "next/link";

/**
 * LoginContainer component
 * @author Kenneth Sumang
 */
export default function LoginContainer() {
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
        className={classes.header}
        variant="text"
        size="xl"
      >
        Login
      </Text>
      <LoginForm />
      <Text pt="1rem">
        No account yet? <Link href="#">Sign up</Link>.
      </Text>
    </Paper>
  );
}