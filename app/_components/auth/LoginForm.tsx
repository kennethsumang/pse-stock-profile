'use client';

import { Button, Checkbox, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import useToast from "@/app/_hooks/useToast";
import RequestLibrary from "@/app/_libraries/request.library";
import { getCurrentDomain } from "@/app/_utils/http.library";
import { useAuthStore } from "@/app/_store";
import { AuthUser } from "@/app/_types/auth";
import { useRouter } from "next/navigation";

/**
 * LoginForm component
 * @author Kenneth Sumang
 */
export default function LoginForm() {
  const router = useRouter();
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
    const result = await requestLogin(credentials);
    if (result.success === false) {
      toast("error", result.message);
      return;
    }

    auth.loginUser(result.data as AuthUser);
    toast("success", "Login successful!");
    router.push("/app");
  }

  /**
   * Requests login API
   * @param   {{ email: string, password: string }} credentials 
   * @returns {Promise<{ success: boolean, message: string, data?: AuthUser }>}
   */
  async function requestLogin(credentials: { email: string, password: string }): Promise<{ success: boolean; message: string; data?: AuthUser; }> {
    try {
      const response = await RequestLibrary.request<{ data: AuthUser }>(
        `${getCurrentDomain()}/api/auth/login`,
        {
          method: 'POST',
          data: credentials,
        },
      );

      return {
        success: true,
        message: 'OK',
        data: response.data,
      };
    } catch (e) {
      return {
        success: false,
        message: (e as Error).message,
      };
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
          required
          {...form.getInputProps("email")}
        />
        <TextInput
          style={{ marginBottom: "1rem" }}
          withAsterisk
          label="Password"
          type="password"
          required
          {...form.getInputProps("password")}
        />
        <Group justify="flex-end" mt="md">
          <Button type="submit">Login</Button>
        </Group>
      </form>
    </>
  );
}