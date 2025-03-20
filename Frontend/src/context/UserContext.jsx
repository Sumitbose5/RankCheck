// import { createContext, useContext, useState, useEffect } from "react";

// // Create UserContext
// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   // Initialize state from localStorage (if available)
//   const [userData, setUserData] = useState(() => {
//     const storedUser = localStorage.getItem("userData"); 
//     return storedUser ? JSON.parse(storedUser) : null;
//   });

//   // Whenever userData changes, update localStorage
//   useEffect(() => {
//     if (userData) {
//       localStorage.setItem("userData", JSON.stringify(userData));
//     } else {
//       localStorage.removeItem("userData"); // Clear storage on logout
//     }
//   }, [userData]);

//   return (
//     <UserContext.Provider value={{ userData, setUserData }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// // Custom Hook for easy access
// export const useUser = () => useContext(UserContext);




import { createContext, useContext, useState, useEffect } from "react";

// Create UserContext
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Initialize state from localStorage (if available)
  const [userData, setUserData] = useState(() => {
    try {
      const storedUser = localStorage.getItem("userData");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing local storage data:", error);
      return null;
    }
  });


  // Whenever userData changes, update localStorage
  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));  // ✅ Store as JSON
    } else {
      localStorage.removeItem("userData"); // ✅ Clear on logout
    }
  }, [userData]);


  // Function to update specific fields (like class_name) without overwriting the whole object
  const updateUser = (newData) => {
    setUserData((prev) => ({
      ...(prev || {}), // Ensure existing data is preserved
      ...newData
    }));
  };


  return (
    <UserContext.Provider value={{ userData, setUserData, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook for easy access
export const useUser = () => useContext(UserContext);
