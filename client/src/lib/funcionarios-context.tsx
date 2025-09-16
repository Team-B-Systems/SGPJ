// lib/funcionarios-context.tsx
import React, { createContext, useContext, useState } from "react";
import { getFuncionarios } from "./api";

interface Funcionario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
}

interface FuncionariosContextType {
  funcionarios: Funcionario[];
  loading: boolean;
  fetchFuncionarios: () => Promise<void>;
}

const FuncionariosContext = createContext<FuncionariosContextType | undefined>(undefined);

export const FuncionariosProvider = ({ children }: { children: React.ReactNode }) => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFuncionarios = async () => {
    setLoading(true);
    try {
      const data = await getFuncionarios();
      setFuncionarios(data);
      // ✅ opcional: persistir no localStorage
      localStorage.setItem("funcionarios", JSON.stringify(data));
    } finally {
      setLoading(false);
    }
  };

  return (
    <FuncionariosContext.Provider value={{ funcionarios, loading, fetchFuncionarios }}>
      {children}
    </FuncionariosContext.Provider>
  );
};

export const useFuncionarios = () => {
  const context = useContext(FuncionariosContext);
  if (!context) throw new Error("useFuncionarios deve ser usado dentro de FuncionariosProvider");
  return context;
};
