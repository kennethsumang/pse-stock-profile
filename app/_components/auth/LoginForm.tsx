'use client';

import { Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import useToast from "@/app/_hooks/useToast";
import RequestLibrary from "@/app/_libraries/request.library";
import { getCurrentDomain } from "@/app/_utils/http.library";
import { useAuthStore } from "@/app/_store";
import { AuthUser } from "@/app/_types/auth";
import { redirect } from 'next/navigation'

/**
 * LoginForm component
 * @author Kenneth Sumang
 */
export default function LoginForm() {
  const auth = useAuthStore((state) => state);
  const toast = useToast();
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value: string) => {
        // SOURCE: https://stackoverflow.com/a/46181
        const isValid = String(value)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
        
        return isValid ? null : 'Invalid email.';
      },
      password: (value: string) => {
        const isValid = value && value.length > 0;
        return isValid ? null : 'Missing password.';
      }
    }
  });

  /**
   * Handles login form submit
   * @param {{ email: string, password: string }} credentials 
   */
  async function handleLoginFormSubmit(credentials: { email: string, password: string }) {
    try {
      const response = await RequestLibrary.request<{ data: AuthUser }>(
        `${getCurrentDomain()}/api/auth/login`,
        {
          method: 'POST',
          data: credentials,
        },
      );

      auth.loginUser(response.data);
      toast('success', 'Login successful!');
      redirect('/app');
    } catch (e) {
      toast('error', (e as Error).message);
      console.error(e);
    }
  }

  return (
    <>
      <form onSubmit={form.onSubmit((values) => handleLoginFormSubmit(values))}>
        <TextInput
          style={{ marginBottom: "1rem" }}
          withAsterisk
          label="Email"
          type="email"
          {...form.getInputProps("email")}
        />
        <TextInput
          style={{ marginBottom: "1rem" }}
          withAsterisk
          label="Password"
          type="password"
          {...form.getInputProps("password")}
        />
        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </>
  );
}