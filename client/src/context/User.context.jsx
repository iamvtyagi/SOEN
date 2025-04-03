import { createContext, useState } from "react";
export const UserDataContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({email: "", password: ""});

//   const login = (userData) => {
//     setUser(userData);
//   };

//   const logout = () => {
//     setUser(null);
//   };

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserProvider;
