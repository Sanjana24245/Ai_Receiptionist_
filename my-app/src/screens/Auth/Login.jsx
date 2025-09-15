
import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // ✅ use login function
  const [email, setEmail] = useState("");
  const [otpToken, setOtpToken] = useState("");

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
 const [showForgetPassword, setShowForgetPassword] = useState(false);
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState(Array(6).fill(''));
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const canLogin = email.trim().length > 5 && email.includes('@') && password.length > 0;
  const canGenerateOtp = email.trim().length > 5 && email.includes('@');
  const canVerifyOtp = enteredOtp.every(digit => digit !== '');
  const canResetPassword = newPassword.length >= 6 && newPassword === confirmPassword;
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:8000/auth/login", {
      email,
      password,
    });

    const { user, token } = res.data;

    // Store user in AuthContext
    login(user, token);

    // Navigate based on role
    if (user.role === "admin") {
      navigate("/admin/analytics");
    } else if (user.role === "subadmin") {
      navigate("/subadmin/analytics");
    } else {
      navigate("/"); // fallback (home)
    }
  } catch (err) {
    setError(err.response?.data?.detail || "Login failed");
  }
};

 // Generate OTP
 const handleGenerateOtp = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:8000/auth/forgot-password/send-otp", { email });
    setOtpToken(res.data.otpToken);
    setOtpGenerated(true);
    alert("OTP sent to your email!");
  } catch (err) {
    alert(err.response?.data?.detail || "Failed to send OTP");
  }
};


  // OTP box handlers
  const handleOtpChange = (e, index) => {
    const val = e.target.value;
    if (/^\d?$/.test(val)) { // allow only single digit
      const newOtp = [...enteredOtp];
      newOtp[index] = val;
      setEnteredOtp(newOtp);

      // move focus to next box
      if (val && index < 5) {
        const nextInput = document.querySelectorAll('.otp-box')[index + 1];
        nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !enteredOtp[index] && index > 0) {
      const prevInput = document.querySelectorAll('.otp-box')[index - 1];
      prevInput.focus();
    }
  };

const handleVerifyOtp = async () => {
  try {
    const otpString = enteredOtp.join('');
    const res = await axios.post("http://localhost:8000/auth/forgot-password/verify-otp", {
      otp: otpString,
      otpToken,
    });
    alert(res.data.msg);
    setOtpVerified(true);
  } catch (err) {
    alert(err.response?.data?.detail || "OTP verification failed");
  }
};


  // Reset Password
 const handleResetPassword = async (e) => {
  e.preventDefault();
  if (!canResetPassword) {
    alert("Passwords do not match or too short.");
    return;
  }
  try {
    const otpString = enteredOtp.join('');
    const res = await axios.post("http://localhost:8000/auth/forgot-password/reset", {
      newPassword,
      otp: otpString,
      otpToken,
    });
    alert(res.data.msg);
    // Reset states
    setShowForgetPassword(false);
    setOtpGenerated(false);
    setOtpVerified(false);
    setOtpToken("");
    setNewPassword("");
    setConfirmPassword("");
    setEnteredOtp(Array(6).fill(""));
  } catch (err) {
    alert(err.response?.data?.detail || "Password reset failed");
  }
};


  return (

 <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {!showForgetPassword ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6"
        >
          <h2 className="text-2xl font-bold text-center">Login</h2>

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

          {/* Forgot Password in the middle */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowForgetPassword(true)}
              className="text-blue-600 text-sm hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!canLogin}
            className={`w-full py-2 rounded text-white ${
              canLogin ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Login
          </button>

          <p className="mt-4 text-center">
            Don't have an account?{' '}
           <button
  type="button"
  onClick={() => navigate("/register")}
  className="text-blue-600 underline"
>
  Register here
</button>

          </p>
        </form>
      ) : (
        <form className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6">
          <h2 className="text-2xl font-bold text-center">Reset Password</h2>

          {!otpGenerated ? (
            <>
              <div>
                <label className="block font-medium mb-1">Enter your Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleGenerateOtp}
                disabled={!canGenerateOtp}
                className={`w-full py-2 rounded text-white ${
                  canGenerateOtp ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Generate OTP
              </button>
            </>
          ) : !otpVerified ? (
            <>
              <div className="flex justify-between space-x-2">
                {enteredOtp.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength="1"
                    className="otp-box w-12 h-12 text-center border rounded text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={digit}
                    onChange={e => handleOtpChange(e, i)}
                    onKeyDown={e => handleOtpKeyDown(e, i)}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={!canVerifyOtp}
                className={`w-full py-2 mt-4 rounded text-white ${
                  canVerifyOtp ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Verify OTP
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="block font-medium mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={!canResetPassword}
                className={`w-full py-2 rounded text-white ${
                  canResetPassword ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Reset Password
              </button>
            </>
          )}

          <p className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setShowForgetPassword(false);
                setOtpGenerated(false);
                setOtpVerified(false);
                setGeneratedOtp('');
                setEnteredOtp(Array(6).fill(''));
              }}
              className="text-gray-600 underline"
            >
              Back to Login
            </button>
          </p>
        </form>
      )}
    </div>
  );
}
