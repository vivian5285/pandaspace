import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface RegisterProps {
  onSuccess: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // 验证邮箱格式
    if (!validateEmail(email)) {
      setError(t('auth.invalidEmail'));
      setLoading(false);
      return;
    }

    // 验证密码长度
    if (password.length < 8) {
      setError(t('auth.passwordTooShort'));
      setLoading(false);
      return;
    }

    // 验证密码匹配
    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatch'));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess(true);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Paper sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          {t('auth.verificationSent')}
        </Alert>
        <Typography>
          {t('auth.verifyEmail')}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {t('auth.register')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label={t('auth.email')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
          disabled={loading}
        />

        <TextField
          fullWidth
          label={t('auth.password')}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
          disabled={loading}
        />

        <TextField
          fullWidth
          label={t('auth.confirmPassword')}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
          required
          disabled={loading}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            t('auth.register')
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default Register; 