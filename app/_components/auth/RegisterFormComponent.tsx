import { useForm } from "@mantine/form";
import useToast from "@/app/_hooks/useToast";
import { Button, Checkbox, Group, TextInput } from "@mantine/core";
import RequestLibrary from "@/app/_libraries/request.library";
import { getCurrentDomain } from "@/app/_utils/http.library";
import { useRouter } from "next/navigation";
import {
  RegisterForm,
} from "@/app/_types/auth";

/**
 * RegisterForm component
 * @author Kenneth Sumang
 */
export default function RegisterFormComponent() {
  const router = useRouter();
  const toast = useToast();
  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
    validate: {
      first_name: (value: string) => {
        const trimmed = value.trim();
        const isValid = trimmed.length >= 2 && trimmed.length <= 20;
        return isValid ? null : "Invalid First Name.";
      },
      last_name: (value: string) => {
        const trimmed = value.trim();
        const isValid = trimmed.length >= 2 && trimmed.length <= 20;
        return isValid ? null : "Invalid Last Name.";
      },
      email: (value: string) => {
        // SOURCE: https://stackoverflow.com/a/46181
        const isValid = String(value)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          );

        return isValid ? null : "Invalid email.";
      },
      password: (value: string) => {
        const isValid = value && value.length > 0;
        return isValid ? null : "Missing password.";
      },
    },
  });

  /**
   * Handles register form submit
   * @param {{ email: string, password: string }} credentials
   */
  async function handleRegisterFormSubmit(credentials: RegisterForm) {
    const result = await requestRegister(credentials);
    if (result.success === false) {
      toast("error", result.message);
      return;
    }

    toast("success", "Register successful!");
    router.push("/");
  }

  /**
   * Requests register API
   * @param   {RegisterForm} formData
   * @returns {Promise<{ success: boolean, message: string, data?: RegisterForm }>}
   */
  async function requestRegister(
    formData: RegisterForm,
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const response = await RequestLibrary.request<{ data: any }>(
        `${getCurrentDomain()}/api/auth/register`,
        {
          method: "POST",
          data: formData as unknown as Record<string, unknown>,
        },
      );

      return {
        success: true,
        message: "OK",
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
      <form
        onSubmit={form.onSubmit((values) => handleRegisterFormSubmit(values))}
      >
        <TextInput
          style={{ marginBottom: "1rem" }}
          withAsterisk
          label="First Name"
          type="text"
          required
          {...form.getInputProps("first_name")}
        />
        <TextInput
          style={{ marginBottom: "1rem" }}
          withAsterisk
          label="Last Name"
          type="text"
          required
          {...form.getInputProps("last_name")}
        />
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
          <Button type="submit">Register</Button>
        </Group>
      </form>
    </>
  );
}
