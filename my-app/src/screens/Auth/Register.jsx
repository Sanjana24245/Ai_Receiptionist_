import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
export default function RegisterForm({ onSwitch }) {
     const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    role: 'admin',
    password: '',
    rePassword: '',
  });

  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [contactOtpSent, setContactOtpSent] = useState(false);
const [contactOtpToken, setContactOtpToken] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [contactVerified, setContactVerified] = useState(false);
  const [emailOtp, setEmailOtp] = useState(new Array(6).fill(''));
  const [contactOtp, setContactOtp] = useState(new Array(6).fill(''));
  const emailOtpRefs = Array.from({ length: 6 }, () => useRef(null));
  const contactOtpRefs = Array.from({ length: 6 }, () => useRef(null));

  const [otpToken, setOtpToken] = useState("");
  const canSendEmailOtp = form.email.trim().length > 7 && form.email.includes('@');
  const canSendContactOtp = form.contactNumber.trim().length >= 10;

  const canVerifyEmailOtp = emailOtp.every(digit => digit.length === 1);
  const canVerifyContactOtp = contactOtp.every(digit => digit.length === 1);

  const canProceed = emailVerified ;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (index, value, otpSetter, otpArray, refsArray) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otpArray];
    newOtp[index] = value;
    otpSetter(newOtp);
    if (value && index < refsArray.length - 1) {
      refsArray[index + 1].current.focus();
    }
  };

 const sendEmailOtp = async () => {
  if (!canSendEmailOtp) return;

  try {
    const res = await axios.post("http://localhost:5000/auth/send-otp", {
      email: form.email,
    });
    setEmailOtpSent(true);
    setOtpToken(res.data.otpToken);
    alert(res.data.msg); // will show "OTP sent to your email. Please verify."
    console.log("OTP Token:", res.data.otpToken); // store it if needed for verification
  } catch (err) {
    alert(err.response?.data?.detail || "Failed to send OTP");
    setEmailOtpSent(false);
  }
};


//  const sendContactOtp = async () => {
//   if (!canSendContactOtp) return;
//   try {
//     const res = await axios.post("http://localhost:5000/auth/send-contact-otp", {
//       contactnumber: form.contactNumber,
//     });
//     setContactOtpSent(true);
//     setContactOtpToken(res.data.otpToken);
//     alert(res.data.msg);
//   } catch (err) {
//     alert(err.response?.data?.detail || "Failed to send OTP");
//     setContactOtpSent(false);
//   }
// };

  // ✅ Verify Email OTP
  const verifyEmailOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/auth/verify-otp", {
        otpToken,
        otp: emailOtp.join(""), // ✅ join 6 boxes into single string
      });
      setEmailVerified(true);
      alert(res.data.msg); // "OTP verified successfully"
    } catch (err) {
      alert(err.response?.data?.detail || "OTP verification failed");
      setEmailVerified(false);
    }
  };

// const verifyContactOtp = async () => {
//   try {
//     const res = await axios.post("http://localhost:5000/auth/verify-otp", {
//       otp: contactOtp.join(""),
//       otpToken: contactOtpToken,
      
//     });
//     setContactVerified(true);
//     alert(res.data.msg);
//   } catch (err) {
//     alert(err.response?.data?.detail || "OTP verification failed");
//     setContactVerified(false);
//   }
// };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!canProceed) {
      alert('Please verify both Email and Contact OTPs first.');
      return;
    }
    if (form.password !== form.rePassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/auth/register", {
        username: `${form.firstName} ${form.lastName}`,
        email: form.email,
        contactnumber: form.contactNumber,
        role: form.role,
        password: form.password,
        confirmPassword: form.rePassword,
      });

      alert(res.data.msg); // success message from backend
      navigate("/login") // redirect to login after registration
    } catch (err) {
      alert(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>

        {/* First & Last Name in same line */}
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block font-medium mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="First Name"
              required
            />
          </div>
          <div className="w-1/2">
            <label className="block font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Last Name"
              required
            />
          </div>
        </div>

        {/* Email + Button in same line */}
        <div>
          <label className="block font-medium mb-1">Email</label>
          <div className="flex space-x-2">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={emailOtpSent}
              className="flex-1 p-2 border rounded"
              placeholder="Enter your email"
              required
            />
            {!emailOtpSent && (
              <button
                type="button"
                onClick={sendEmailOtp}
                disabled={!canSendEmailOtp}
                className={`px-4 py-2 rounded text-white ${
                  canSendEmailOtp ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Send OTP
              </button>
            )}
          </div>
          {emailOtpSent && !emailVerified && (
            <div className="mt-2 flex space-x-2 justify-center">
              {emailOtp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e =>
                    handleOtpChange(idx, e.target.value, setEmailOtp, emailOtp, emailOtpRefs)
                  }
                  ref={emailOtpRefs[idx]}
                  className="w-12 h-12 text-center border rounded text-xl"
                  placeholder="0"
                />
              ))}
              <button
                type="button"
                onClick={verifyEmailOtp}
                disabled={!canVerifyEmailOtp}
                className={`px-4 py-2 rounded text-white ${
                  canVerifyEmailOtp ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Verify
              </button>
            </div>
          )}
          {emailVerified && (
            <p className="text-green-600 mt-1 font-semibold text-center">Email verified ✓</p>
          )}
        </div>

        {/* Contact + Button in same line */}
        <div>
          <label className="block font-medium mb-1">Contact Number</label>
          <div className="flex space-x-2">
           <input
  type="tel"
  name="contactNumber"
  value={form.contactNumber}
  onChange={handleChange}   // ✅ Add this back
  className="flex-1 p-2 border rounded"
  placeholder="Enter your contact number"
  required
/>

            {/* {!contactOtpSent && (
              <button
                type="button"
                onClick={sendContactOtp}
                disabled={!canSendContactOtp}
                className={`px-4 py-2 rounded text-white ${
                  canSendContactOtp ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Send OTP
              </button>
            )} */}
          </div>
          {/* {contactOtpSent && !contactVerified && (
            <div className="mt-2 flex space-x-2 justify-center">
              {contactOtp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e =>
                    handleOtpChange(idx, e.target.value, setContactOtp, contactOtp, contactOtpRefs)
                  }
                  ref={contactOtpRefs[idx]}
                  className="w-12 h-12 text-center border rounded text-xl"
                  placeholder="0"
                />
              ))}
              <button
                type="button"
                onClick={verifyContactOtp}
                disabled={!canVerifyContactOtp}
                className={`px-4 py-2 rounded text-white ${
                  canVerifyContactOtp ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Verify
              </button>
            </div>
          )} */}
          {/* {contactVerified && (
            <p className="text-green-600 mt-1 font-semibold text-center">Contact verified ✓</p>
          )} */}
        </div>

        {/* Role */}
        <div>
          <label className="block font-medium mb-1">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="admin">Admin</option>
            <option value="subadmin">Subadmin</option>
          </select>
        </div>

        {/* Password */}
        <div>
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            disabled={!canProceed}
            className={`w-full p-2 border rounded ${
              canProceed ? '' : 'bg-gray-100 cursor-not-allowed'
            }`}
            placeholder="Enter your password"
            required={canProceed}
          />
        </div>

        {/* Re-enter Password */}
        <div>
          <label className="block font-medium mb-1">Re-enter Password</label>
          <input
            type="password"
            name="rePassword"
            value={form.rePassword}
            onChange={handleChange}
            disabled={!canProceed}
            className={`w-full p-2 border rounded ${
              canProceed ? '' : 'bg-gray-100 cursor-not-allowed'
            }`}
            placeholder="Re-enter your password"
            required={canProceed}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={
            !canProceed ||
            form.password.length === 0 ||
            form.rePassword.length === 0
          }
          className={`w-full py-2 rounded text-white ${
            canProceed &&
            form.password.length > 0 &&
            form.rePassword.length > 0
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Register
        </button>

        {/* Switch to Login */}
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 underline"
          >
            Login here
          </button>
        </p>
      </form>
    </div>
  );
}
// import React, { useState, useRef } from 'react';
// import axios from 'axios';
// import { useNavigate } from "react-router-dom";

// export default function RegisterForm({ onSwitch }) {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     contactNumber: '',
//     role: 'admin',
//     password: '',
//     rePassword: '',
//   });

//   const [emailOtpSent, setEmailOtpSent] = useState(false);
//   const [otpToken, setOtpToken] = useState("");
//   const [emailVerified, setEmailVerified] = useState(false);
//   const [emailOtp, setEmailOtp] = useState(new Array(6).fill(''));
//   const emailOtpRefs = Array.from({ length: 6 }, () => useRef(null));

//   const canSendEmailOtp = form.email.trim().length > 7 && form.email.includes('@');
//   const canVerifyEmailOtp = emailOtp.every(digit => digit.length === 1);
//   const canProceed = emailVerified;

//   const handleChange = e => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleOtpChange = (index, value, otpSetter, otpArray, refsArray) => {
//     if (!/^\d?$/.test(value)) return;
//     const newOtp = [...otpArray];
//     newOtp[index] = value;
//     otpSetter(newOtp);
//     if (value && index < refsArray.length - 1) {
//       refsArray[index + 1].current.focus();
//     }
//   };

//   // Send Email OTP
//   const sendEmailOtp = async () => {
//     if (!canSendEmailOtp) return;
//     try {
//       const res = await axios.post("http://localhost:5000/auth/send-otp", {
//         email: form.email,
//       });
//       setEmailOtpSent(true);
//       setOtpToken(res.data.otpToken);
//       alert(res.data.msg);
//       console.log("OTP Token:", res.data.otpToken);
//     } catch (err) {
//       alert(err.response?.data?.detail || "Failed to send OTP");
//       setEmailOtpSent(false);
//     }
//   };

//   // Verify Email OTP
//   const verifyEmailOtp = async () => {
//     try {
//       const res = await axios.post("http://localhost:5000/auth/verify-otp", {
//         otpToken,
//         otp: emailOtp.join(""),
//       });
//       setEmailVerified(true);
//       alert(res.data.msg);
//     } catch (err) {
//       alert(err.response?.data?.detail || "OTP verification failed");
//       setEmailVerified(false);
//     }
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     if (!canProceed) {
//       alert('Please verify your Email OTP first.');
//       return;
//     }
//     if (form.password !== form.rePassword) {
//       alert('Passwords do not match!');
//       return;
//     }

//     try {
//       const payload = {
//         username: `${form.firstName} ${form.lastName}`,
//         email: form.email,
//         contactnumber: form.contactNumber,
//         password: form.password,
//         confirmPassword: form.rePassword,
//       };

//       // Call different API based on role
//       let res;
//       if (form.role === 'subadmin') {
//         res = await axios.post("http://localhost:5000/subadmin/register", payload);
//       } else {
//         payload.role = form.role; // only for admin
//         res = await axios.post("http://localhost:5000/auth/register", payload);
//       }

//       alert(res.data.msg);
//       navigate("/login");
//     } catch (err) {
//       alert(err.response?.data?.detail || "Registration failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6"
//       >
//         <h2 className="text-2xl font-bold text-center">Register</h2>

//         {/* First & Last Name */}
//         <div className="flex space-x-4">
//           <div className="w-1/2">
//             <label className="block font-medium mb-1">First Name</label>
//             <input
//               type="text"
//               name="firstName"
//               value={form.firstName}
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//               placeholder="First Name"
//               required
//             />
//           </div>
//           <div className="w-1/2">
//             <label className="block font-medium mb-1">Last Name</label>
//             <input
//               type="text"
//               name="lastName"
//               value={form.lastName}
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//               placeholder="Last Name"
//               required
//             />
//           </div>
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block font-medium mb-1">Email</label>
//           <div className="flex space-x-2">
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               disabled={emailOtpSent}
//               className="flex-1 p-2 border rounded"
//               placeholder="Enter your email"
//               required
//             />
//             {!emailOtpSent && (
//               <button
//                 type="button"
//                 onClick={sendEmailOtp}
//                 disabled={!canSendEmailOtp}
//                 className={`px-4 py-2 rounded text-white ${
//                   canSendEmailOtp ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
//                 }`}
//               >
//                 Send OTP
//               </button>
//             )}
//           </div>

//           {emailOtpSent && !emailVerified && (
//             <div className="mt-2 flex space-x-2 justify-center">
//               {emailOtp.map((digit, idx) => (
//                 <input
//                   key={idx}
//                   type="text"
//                   maxLength={1}
//                   value={digit}
//                   onChange={e =>
//                     handleOtpChange(idx, e.target.value, setEmailOtp, emailOtp, emailOtpRefs)
//                   }
//                   ref={emailOtpRefs[idx]}
//                   className="w-12 h-12 text-center border rounded text-xl"
//                   placeholder="0"
//                 />
//               ))}
//               <button
//                 type="button"
//                 onClick={verifyEmailOtp}
//                 disabled={!canVerifyEmailOtp}
//                 className={`px-4 py-2 rounded text-white ${
//                   canVerifyEmailOtp ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
//                 }`}
//               >
//                 Verify
//               </button>
//             </div>
//           )}
//           {emailVerified && (
//             <p className="text-green-600 mt-1 font-semibold text-center">Email verified ✓</p>
//           )}
//         </div>

//         {/* Contact Number */}
//         <div>
//           <label className="block font-medium mb-1">Contact Number</label>
//           <input
//             type="tel"
//             name="contactNumber"
//             value={form.contactNumber}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             placeholder="Enter your contact number"
//             required
//           />
//         </div>

//         {/* Role */}
//         <div>
//           <label className="block font-medium mb-1">Role</label>
//           <select
//             name="role"
//             value={form.role}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           >
//             <option value="admin">Admin</option>
//             <option value="subadmin">Subadmin</option>
//           </select>
//         </div>

//         {/* Password */}
//         <div>
//           <label className="block font-medium mb-1">Password</label>
//           <input
//             type="password"
//             name="password"
//             value={form.password}
//             onChange={handleChange}
//             disabled={!canProceed}
//             className={`w-full p-2 border rounded ${canProceed ? '' : 'bg-gray-100 cursor-not-allowed'}`}
//             placeholder="Enter your password"
//             required={canProceed}
//           />
//         </div>

//         {/* Re-enter Password */}
//         <div>
//           <label className="block font-medium mb-1">Re-enter Password</label>
//           <input
//             type="password"
//             name="rePassword"
//             value={form.rePassword}
//             onChange={handleChange}
//             disabled={!canProceed}
//             className={`w-full p-2 border rounded ${canProceed ? '' : 'bg-gray-100 cursor-not-allowed'}`}
//             placeholder="Re-enter your password"
//             required={canProceed}
//           />
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={!canProceed || form.password.length === 0 || form.rePassword.length === 0}
//           className={`w-full py-2 rounded text-white ${
//             canProceed && form.password.length > 0 && form.rePassword.length > 0
//               ? 'bg-green-600 hover:bg-green-700'
//               : 'bg-gray-400 cursor-not-allowed'
//           }`}
//         >
//           Register
//         </button>

//         {/* Switch to Login */}
//         <p className="mt-4 text-center">
//           Already have an account?{' '}
//           <button
//             type="button"
//             onClick={() => navigate("/login")}
//             className="text-blue-600 underline"
//           >
//             Login here
//           </button>
//         </p>
//       </form>
//     </div>
//   );
// }
