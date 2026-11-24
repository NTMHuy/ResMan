import { useState } from "react";
import { z } from "zod";

import { useAuth } from "@/src/contexts/AuthContext";
import { useToast } from "@/src/contexts/ToastContext";

const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Tên đăng nhập tối thiểu 3 ký tự.")
    .max(80, "Tên đăng nhập không được vượt quá 80 ký tự."),

  password: z
    .string()
    .min(6, "Mật khẩu tối thiểu 6 ký tự.")
    .max(100, "Mật khẩu không được vượt quá 100 ký tự."),
});

export function useLoginForm() {
  const { login, quickAccounts } = useAuth();
  const { showToast } = useToast();

  // Giữ tên email để tương thích với LoginScreen hiện tại.
  // Giá trị này thực tế là username khi gửi đến Backend.
  const [email, setEmail] = useState("manager");

  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleLogin = async (
    overrideUsername?: string,
    overridePassword?: string,
  ) => {
    const targetUsername = overrideUsername ?? email;
    const targetPassword = overridePassword ?? password;

    const parsed = loginSchema.safeParse({
      username: targetUsername,
      password: targetPassword,
    });

    if (!parsed.success) {
      const nextErrors: {
        email?: string;
        password?: string;
      } = {};

      for (const issue of parsed.error.issues) {
        const key = issue.path[0];

        if (key === "username" && !nextErrors.email) {
          nextErrors.email = issue.message;
        }

        if (key === "password" && !nextErrors.password) {
          nextErrors.password = issue.message;
        }
      }

      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitError(null);
    setSubmitting(true);

    try {
      const loggedUser = await login({
        username: parsed.data.username,
        password: parsed.data.password,
      });

      showToast(`Chào mừng ${loggedUser.fullName}`, "success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Đăng nhập thất bại.";

      setSubmitError(message);
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    submitting,
    submitError,
    quickAccounts,
    handleLogin,
  };
}
