import { useState } from 'react';
import { z } from 'zod';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/src/contexts/ToastContext';

const loginSchema = z.object({
  email: z.string().trim().email('Email không hợp lệ.'),
  password: z.string().min(4, 'Mật khẩu tối thiểu 4 ký tự.'),
});

export function useLoginForm() {
  const { login, quickAccounts } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('manager@resman.vn');
  const [password, setPassword] = useState('123456');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleLogin = async (overrideEmail?: string, overridePassword?: string) => {
    const targetEmail = overrideEmail ?? email;
    const targetPassword = overridePassword ?? password;

    const parsed = loginSchema.safeParse({ email: targetEmail, password: targetPassword });
    if (!parsed.success) {
      const nextErrors: { email?: string; password?: string } = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === 'email' && !nextErrors.email) nextErrors.email = issue.message;
        if (key === 'password' && !nextErrors.password) nextErrors.password = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitError(null);
    setSubmitting(true);

    try {
      const loggedUser = await login({
        email: parsed.data.email,
        password: parsed.data.password,
      });
      showToast(`Chào mừng ${loggedUser.fullName}`, 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Đăng nhập thất bại.';
      setSubmitError(msg);
      showToast(msg, 'error');
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
