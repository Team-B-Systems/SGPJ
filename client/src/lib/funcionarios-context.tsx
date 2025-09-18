// lib/funcionarios-context.tsx
import React, { createContext, useCallback, useContext, useState } from "react";
import { getFuncionario, User, searchFuncionario, createFuncionario, updateFuncionario as apiUpdateFuncionario } from "./api";

interface FuncionariosContextType {
  funcionarios: User[];
  loading: boolean;
  fetchFuncionarios: () => Promise<void>;
  addFuncionario: (funcionario: User) => void;
  searchFuncionario: (params: { email: string }) => Promise<void>;
  updateFuncionario: (id: string, data: Partial<User>) => Promise<void>;
}

const FuncionariosContext = createContext<FuncionariosContextType | undefined>(undefined);
export const FuncionariosProvider = ({ children }: { children: React.ReactNode }) => {
  const [funcionarios, setFuncionarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFuncionarios = useCallback(async () => {
    setLoading(true);
    try {
      const users = await getFuncionario();
      setFuncionarios(users);
      localStorage.setItem("funcionarios", JSON.stringify(users));
    } finally {
      setLoading(false);
    }

  }, []);

  const searchFuncionarioHandler = useCallback(async (params: { email: string }) => {
    setLoading(true);
    try {
      const user = await searchFuncionario(params.email);
      setFuncionarios(user ? [user] : []);
      localStorage.setItem("funcionarios", JSON.stringify(user ? [user] : []));
    } finally {
      setLoading(false);
    }
  }, []);

  const addFuncionario = useCallback(async (funcionario: User) => {
    setLoading(true);
    try {
      const user = await createFuncionario(funcionario);
      setFuncionarios(user ? [user] : []);
      localStorage.setItem("funcionarios", JSON.stringify(user ? [user] : []));
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFuncionario = useCallback(async (id: string, data: Partial<User>) => {
    setLoading(true);
    try {
      const updated = await apiUpdateFuncionario(id, data);
      if (!updated) return;
      setFuncionarios((prev) => {
        const newList = prev.map((funcionario) =>
        (((funcionario as any).id ?? (funcionario as any)._id ?? (funcionario as any).email) === ((updated as any).id ?? (updated as any)._id ?? (updated as any).email)
          ? updated
          : funcionario
        )
        );
        localStorage.setItem("funcionarios", JSON.stringify(newList));
        return newList;
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <FuncionariosContext.Provider value={{ 
      funcionarios, 
      loading, 
      fetchFuncionarios, 
      addFuncionario, 
      searchFuncionario: searchFuncionarioHandler, 
      updateFuncionario }}>
      {children}
    </FuncionariosContext.Provider>
  );
};

export const useFuncionarios = () => {
  const context = useContext(FuncionariosContext);
  if (!context) throw new Error("useFuncionarios deve ser usado dentro de FuncionariosProvider");
  return context;
};
