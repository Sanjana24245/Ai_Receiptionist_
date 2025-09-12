// // // // // import React from "react";
// // // // // import { Search, Bell, User, LogOut } from "lucide-react";

// // // // // const Navbar = () => {
// // // // //   return (
// // // // //     <div className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between">
// // // // //       {/* Left Section - Logo / Title */}
// // // // //       <div className="flex items-center space-x-2">
// // // // //         <span className="text-2xl font-bold text-blue-600">🏥 HealthCare</span>
// // // // //       </div>

// // // // //       {/* Middle Section - Search */}
// // // // //       <div className="flex-1 max-w-md mx-6">
// // // // //         <div className="relative">
// // // // //           <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
// // // // //           <input
// // // // //             type="text"
// // // // //             placeholder="Search..."
// // // // //             className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //           />
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Right Section - Icons */}
// // // // //       <div className="flex items-center space-x-6">
// // // // //         <button className="relative">
// // // // //           <Bell size={22} className="text-gray-600 hover:text-blue-600" />
// // // // //           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
// // // // //             3
// // // // //           </span>
// // // // //         </button>

// // // // //         <button className="flex items-center space-x-2 hover:text-blue-600">
// // // // //           <User size={22} />
// // // // //           <span className="hidden md:inline">Admin</span>
// // // // //         </button>

// // // // //         <button className="hover:text-red-600">
// // // // //           <LogOut size={22} />
// // // // //         </button>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default Navbar;
// // // // import React, { useState } from "react";
// // // // import { Search, Bell, User, LogOut } from "lucide-react";

// // // // const Navbar = () => {
// // // //   const [showNotifications, setShowNotifications] = useState(false);
// // // //   const [showProfile, setShowProfile] = useState(false);

// // // //   return (
// // // //     <div className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between relative">
// // // //       {/* Left Section - Logo / Title */}
// // // //       <div className="flex items-center space-x-2">
// // // //         <span className="text-2xl font-bold text-blue-600">🏥 HealthCare</span>
// // // //       </div>

// // // //       {/* Middle Section - Search */}
// // // //       <div className="flex-1 max-w-md mx-6">
// // // //         <div className="relative">
// // // //           <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
// // // //           <input
// // // //             type="text"
// // // //             placeholder="Search..."
// // // //             className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //           />
// // // //         </div>
// // // //       </div>

// // // //       {/* Right Section - Icons */}
// // // //       <div className="flex items-center space-x-6">
// // // //         {/* Notifications */}
// // // //         <div className="relative">
// // // //           <button
// // // //             onClick={() => {
// // // //               setShowNotifications(!showNotifications);
// // // //               setShowProfile(false);
// // // //             }}
// // // //             className="relative"
// // // //           >
// // // //             <Bell size={22} className="text-gray-600 hover:text-blue-600" />
// // // //             <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
// // // //               3
// // // //             </span>
// // // //           </button>

// // // //           {/* Notification Dropdown */}
// // // //           {showNotifications && (
// // // //             <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-3 z-50">
// // // //               <h4 className="font-semibold text-gray-700 mb-2">Notifications</h4>
// // // //               <ul className="space-y-2 text-sm">
// // // //                 <li className="p-2 bg-gray-50 rounded hover:bg-gray-100">
// // // //                   🩺 New appointment booked
// // // //                 </li>
// // // //                 <li className="p-2 bg-gray-50 rounded hover:bg-gray-100">
// // // //                   📞 Missed call from patient
// // // //                 </li>
// // // //                 <li className="p-2 bg-gray-50 rounded hover:bg-gray-100">
// // // //                   ✅ Treatment completed successfully
// // // //                 </li>
// // // //               </ul>
// // // //               <button className="mt-2 w-full text-center text-blue-600 text-sm hover:underline">
// // // //                 View all
// // // //               </button>
// // // //             </div>
// // // //           )}
// // // //         </div>

// // // //         {/* Profile Dropdown */}
// // // //         <div className="relative">
// // // //           <button
// // // //             onClick={() => {
// // // //               setShowProfile(!showProfile);
// // // //               setShowNotifications(false);
// // // //             }}
// // // //             className="flex items-center space-x-2 hover:text-blue-600"
// // // //           >
// // // //             <User size={22} />
// // // //             <span className="hidden md:inline">Admin</span>
// // // //           </button>

// // // //           {showProfile && (
// // // //             <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
// // // //               <div className="px-4 py-2 border-b">
// // // //                 <p className="font-semibold">Admin User</p>
// // // //                 <p className="text-xs text-gray-500">admin@healthcare.com</p>
// // // //               </div>
// // // //               <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
// // // //                 Profile
// // // //               </button>
// // // //               <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
// // // //                 Settings
// // // //               </button>
// // // //               <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2">
// // // //                 <LogOut size={16} />
// // // //                 <span>Logout</span>
// // // //               </button>
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default Navbar;
// // // import React, { useState } from "react";
// // // import { Bell, User, LogOut, LogIn } from "lucide-react";

// // // const Navbar = () => {
// // //   const [isLoggedIn, setIsLoggedIn] = useState(false);
// // //   const [showNotifications, setShowNotifications] = useState(false);
// // //   const [showProfile, setShowProfile] = useState(false);

// // //   const handleLogin = () => {
// // //     setIsLoggedIn(true);
// // //   };

// // //   const handleLogout = () => {
// // //     setIsLoggedIn(false);
// // //     setShowProfile(false);
// // //   };

// // //   return (
// // //     <div className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between relative">
// // //       {/* Left Section - Logo / Title */}
// // //       <div className="flex items-center space-x-2">
// // //         <span className="text-2xl font-bold text-blue-600">🏥 HealthCare</span>
// // //       </div>

// // //       {/* Right Section - Icons */}
// // //       <div className="flex items-center space-x-6">
// // //         {/* Notifications */}
// // //         {isLoggedIn && (
// // //           <div className="relative">
// // //             <button
// // //               onClick={() => {
// // //                 setShowNotifications(!showNotifications);
// // //                 setShowProfile(false);
// // //               }}
// // //               className="relative"
// // //             >
// // //               <Bell size={22} className="text-gray-600 hover:text-blue-600" />
// // //               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
// // //                 3
// // //               </span>
// // //             </button>

// // //             {/* Notification Dropdown */}
// // //             {showNotifications && (
// // //               <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-3 z-50">
// // //                 <h4 className="font-semibold text-gray-700 mb-2">
// // //                   Notifications
// // //                 </h4>
// // //                 <ul className="space-y-2 text-sm">
// // //                   <li className="p-2 bg-gray-50 rounded hover:bg-gray-100">
// // //                     🩺 New appointment booked
// // //                   </li>
// // //                   <li className="p-2 bg-gray-50 rounded hover:bg-gray-100">
// // //                     📞 Missed call from patient
// // //                   </li>
// // //                   <li className="p-2 bg-gray-50 rounded hover:bg-gray-100">
// // //                     ✅ Treatment completed successfully
// // //                   </li>
// // //                 </ul>
// // //                 <button className="mt-2 w-full text-center text-blue-600 text-sm hover:underline">
// // //                   View all
// // //                 </button>
// // //               </div>
// // //             )}
// // //           </div>
// // //         )}

// // //         {/* Profile / Login */}
// // //         <div className="relative">
// // //           {!isLoggedIn ? (
// // //             // Show Login Button
// // //             <button
// // //               onClick={handleLogin}
// // //               className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
// // //             >
// // //               <LogIn size={22} />
// // //               <span className="hidden md:inline">Login</span>
// // //             </button>
// // //           ) : (
// // //             // Show Profile + Logout
// // //             <>
// // //               <button
// // //                 onClick={() => {
// // //                   setShowProfile(!showProfile);
// // //                   setShowNotifications(false);
// // //                 }}
// // //                 className="flex items-center space-x-2 hover:text-blue-600"
// // //               >
// // //                 <User size={22} />
// // //                 <span className="hidden md:inline">Admin</span>
// // //               </button>

// // //               {showProfile && (
// // //                 <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
// // //                   <div className="px-4 py-2 border-b">
// // //                     <p className="font-semibold">Admin User</p>
// // //                     <p className="text-xs text-gray-500">
// // //                       admin@healthcare.com
// // //                     </p>
// // //                   </div>
// // //                   <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
// // //                     Profile
// // //                   </button>
// // //                   <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
// // //                     Settings
// // //                   </button>
// // //                   <button
// // //                     onClick={handleLogout}
// // //                     className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
// // //                   >
// // //                     <LogOut size={16} />
// // //                     <span>Logout</span>
// // //                   </button>
// // //                 </div>
// // //               )}
// // //             </>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Navbar;
// // import React, { useState } from "react";
// // import { Bell, LogOut, LogIn } from "lucide-react";

// // const Navbar = () => {
// //   const [isLoggedIn, setIsLoggedIn] = useState(false);

// //   // Dummy user data
// //   const user = {
// //     name: "Admin User",
// //     number: "+91 9876543210",
// //     email: "admin@healthcare.com",
// //   };

// //   const handleLogin = () => {
// //     setIsLoggedIn(true);
// //   };

// //   const handleLogout = () => {
// //     setIsLoggedIn(false);
// //   };

// //   return (
// //     <div className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between">
// //       {/* Left Section - Logo / Title */}
// //       <div className="flex items-center space-x-2">
// //         <span className="text-2xl font-bold text-blue-600">🏥 HealthCare</span>
// //       </div>

// //       {/* Right Section */}
// //       <div className="flex items-center space-x-6">
// //         {/* Notifications (only if logged in) */}
// //         {isLoggedIn && (
// //           <button className="relative">
// //             <Bell size={22} className="text-gray-600 hover:text-blue-600" />
// //             <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
// //               3
// //             </span>
// //           </button>
// //         )}

// //         {/* Profile Info + Login/Logout */}
// //         {!isLoggedIn ? (
// //           // Login Button
// //           <button
// //             onClick={handleLogin}
// //             className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
// //           >
// //             <LogIn size={22} />
// //             <span className="hidden md:inline">Login</span>
// //           </button>
// //         ) : (
// //           // Show user details + Logout
// //           <div className="flex items-center space-x-6">
// //             <div className="text-sm text-gray-700">
// //               <p className="font-semibold">{user.name}</p>
// //               <p className="text-xs">{user.number}</p>
// //               <p className="text-xs">{user.email}</p>
// //             </div>
// //             <button
// //               onClick={handleLogout}
// //               className="flex items-center space-x-1 text-red-600 hover:text-red-700"
// //             >
// //               <LogOut size={20} />
// //               <span>Logout</span>
// //             </button>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Navbar;
// import React, { useState } from "react";
// import { Bell, User, LogOut, LogIn } from "lucide-react";

// const Navbar = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);

//   // Dummy user data
//   const user = {
//     name: "Admin User",
//     number: "+91 9876543210",
//     email: "admin@healthcare.com",
//   };

//   const handleLogin = () => {
//     setIsLoggedIn(true);
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setShowProfile(false);
//   };

//   return (
//     <div className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between relative">
//       {/* Left Section - Logo */}
//       <div className="flex items-center space-x-2">
//         <span className="text-2xl font-bold text-blue-600">🏥 HealthCare</span>
//       </div>

//       {/* Right Section */}
//       <div className="flex items-center space-x-6 relative">
//         {/* Notifications (only if logged in) */}
//         {isLoggedIn && (
//           <button className="relative">
//             <Bell size={22} className="text-gray-600 hover:text-blue-600" />
//             <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
//               3
//             </span>
//           </button>
//         )}

//         {/* Profile / Login */}
//         {!isLoggedIn ? (
//           // Login Button
//           <button
//             onClick={handleLogin}
//             className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
//           >
//             <LogIn size={22} />
//             <span className="hidden md:inline">Login</span>
//           </button>
//         ) : (
//           // Profile Icon
//           <div className="relative">
//             <button
//               onClick={() => setShowProfile(!showProfile)}
//               className="flex items-center space-x-2 hover:text-blue-600"
//             >
//               <User size={22} />
//             </button>

//             {/* Dropdown */}
//             {showProfile && (
//               <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-3 z-50">
//                 <div className="px-4 pb-2 border-b">
//                   <p className="font-semibold text-gray-800">{user.name}</p>
//                   <p className="text-xs text-gray-500">{user.number}</p>
//                   <p className="text-xs text-gray-500">{user.email}</p>
//                 </div>
//                 <button
//                   onClick={handleLogout}
//                   className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
//                 >
//                   <LogOut size={16} />
//                   <span>Logout</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Navbar;
import React, { useState, useEffect, useRef } from "react";
import { Bell, User, LogOut, LogIn } from "lucide-react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Dummy user data
  const user = {
    name: "Admin User",
    number: "+91 9876543210",
    email: "admin@healthcare.com",
  };

  // Dummy notifications
  const notifications = [
    { id: 1, text: "New appointment booked" },
    { id: 2, text: "Emergency alert from Ward 3" },
    { id: 3, text: "Patient report uploaded" },
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowProfile(false);
  };

  return (
    <div className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between relative">
      {/* Left Section - Logo */}
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-blue-600">🏥 HealthCare</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6 relative">
        {/* Notifications (only if logged in) */}
        {isLoggedIn && (
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <Bell size={22} className="text-gray-600 hover:text-blue-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                {notifications.length}
              </span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg py-2 z-50">
                <p className="px-4 py-2 font-semibold text-gray-700 border-b">
                  Notifications
                </p>
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <p
                      key={n.id}
                      className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >
                      {n.text}
                    </p>
                  ))
                ) : (
                  <p className="px-4 py-2 text-sm text-gray-400">
                    No new notifications
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Profile / Login */}
        {!isLoggedIn ? (
          // Login Button
          <button
            onClick={handleLogin}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
          >
            <LogIn size={22} />
            <span className="hidden md:inline">Login</span>
          </button>
        ) : (
          // Profile Icon
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 hover:text-blue-600"
            >
              <User size={22} />
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-3 z-50">
                <div className="px-4 pb-2 border-b">
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.number}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
