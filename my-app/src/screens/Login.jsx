import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function LoginForm({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const canSubmit = email.trim().length > 5 && email.includes('@') && password.length > 0;
 const navigate = useNavigate();
  const handleSubmit = e => {
    e.preventDefault();
    if (!canSubmit) {
      alert('Please enter valid email and password.');
      return;
    }
    alert(`Login submitted!\nEmail: ${email}\nPassword: ${password}`);
  };

  const handleForgetPassword = () => {
    alert('Redirect to forget password flow (not implemented)');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your password"
            required
          />
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <button
            type="button"
            onClick={handleForgetPassword}
            className="text-blue-600 text-sm hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full py-2 rounded text-white ${
            canSubmit
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Login
        </button>

        {/* Switch to Register */}
        <p className="mt-4 text-center">
          Don't have an account?{' '}
            <button
          onClick={() => navigate("/register")}
          className="text-blue-600 underline"
        >
          Register here
        </button>
        </p>
      </form>
    </div>
  );
}
