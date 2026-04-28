import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail } from 'lucide-react';
import { InputField } from './InputField';
import { PasswordInput } from './PasswordInput';
import { Checkbox } from './Checkbox';
import { SubmitButton } from './SubmitButton';
import { FormLabel } from './FormLabel';
import { ErrorMessage } from './ErrorMessage';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      await axios.post('/api/auth/login', { email, password, rememberMe });
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || err.message || 'An error occurred during login'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <FormLabel htmlFor="email">Identity Vector</FormLabel>
        <InputField
          id="email"
          name="email"
          type="email"
          placeholder="architect@studio.pro"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          icon={Mail}
        />
      </div>

      <div className="space-y-2">
        <FormLabel 
          htmlFor="password" 
          rightElement={
            <span className="text-[9px] uppercase font-bold text-zinc-700 hover:text-studio cursor-pointer transition-colors">
              Recover
            </span>
          }
        >
          Neural Key
        </FormLabel>
        <PasswordInput
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>

      <div className="pt-2 pb-1">
        <Checkbox
          id="rememberMe"
          name="rememberMe"
          label="Remember Me"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
      </div>

      <ErrorMessage error={errorMessage} />

      <SubmitButton loading={isLoading}>
        Initialize Session
      </SubmitButton>
    </form>
  );
}
