import { createContext, useReducer } from "react";

export const UserContext = createContext();

const initialState = {
  isLogin: false,
  user: {},
};

const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "logShow":
      return {
        logModal: true,
      };

    case "logClose":
      return {
        logModal: false,
      };

    case "regShow":
      return {
        regModal: true,
      };

    case "regClose":
      return {
        regModal: false,
      };

    case "SUCCESS":
    case "LOGIN":
      localStorage.setItem("token", payload.token);
      return {
        isLogin: true,
        user: payload,
      };

    case "ERROR":
    case "LOGOUT":
      localStorage.clear();
      return {
        isLogin: false,
        user: {},
      };

    default:
      throw new Error();
  }
};

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
};
