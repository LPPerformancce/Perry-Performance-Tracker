import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface UserContextType {
  currentUser: User | null;
  isLoading: boolean;
  switchUser: (id: number) => void;
}

const UserContext = createContext<UserContextType>({ currentUser: null, isLoading: true, switchUser: () => {} });

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState(() => {
    const stored = localStorage.getItem("lpp-user-id");
    return stored ? Number(stored) : 2;
  });

  const { data: currentUser, isLoading } = useQuery<User>({
    queryKey: ["/api/users", String(userId)],
  });

  const switchUser = (id: number) => {
    setUserId(id);
    localStorage.setItem("lpp-user-id", String(id));
  };

  return (
    <UserContext.Provider value={{ currentUser: currentUser ?? null, isLoading, switchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(UserContext);
}
