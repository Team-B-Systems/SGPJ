// lib/queixa-context.tsx
import React, { createContext, useCallback, useContext, useState } from "react";
import { getQueixas, Queixa, createQueixa, editQueixa, downloadQueixaFile } from "./api";

interface QueixaContextType {
  queixas: Queixa[];
  loading: boolean;
  fetchQueixas: () => Promise<void>;
  addQueixa: (queixa: Queixa) => void;
  searchQueixa: (params: { email: string }) => Promise<void>;
  updateQueixa: (id: string, data: Partial<Queixa | any>) => Promise<void>;
  baixarDocumento: (id: number) => Promise<void>;
}

const QueixaContext = createContext<QueixaContextType | undefined>(undefined);

export const QueixaProvider = ({ children }: { children: React.ReactNode }) => {
  const [queixas, setQueixas] = useState<Queixa[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQueixas = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getQueixas();
      setQueixas(list);
      localStorage.setItem("queixas", JSON.stringify(list));
    } finally {
      setLoading(false);
    }
  }, []);

  const searchQueixaHandler = useCallback(async (params: { email: string }) => {
    setLoading(true);
    try {
      localStorage.setItem("queixas", JSON.stringify([]));
    } finally {
      setLoading(false);
    }
  }, []);

  const addQueixa = useCallback(async (queixa: Queixa) => {
    setLoading(true);
    try {
      const queixa_ = await createQueixa(queixa);
      setQueixas(prev => [queixa_, ...prev]);
      localStorage.setItem("queixas", JSON.stringify(queixa_ ? [queixa_] : []));
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQueixa = useCallback(async (id: number | string, data: Partial<Queixa>) => {
    setLoading(true);
    try {
      const queixa = await editQueixa(Number(id), data);
      setQueixas(prev => [queixa, ...prev]);
      localStorage.setItem("queixas", JSON.stringify(queixa ? [queixa] : []));
      setQueixas(prev => {
        const next = prev.map(q => q.id?.toString() === id ? { ...q, ...data } : q);
        localStorage.setItem("queixas", JSON.stringify(next));
        return next;
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const baixarDocumento = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const file = await downloadQueixaFile(id);
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = `queixa_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <QueixaContext.Provider
      value={{
        queixas,
        loading,
        fetchQueixas,
        addQueixa,
        searchQueixa: searchQueixaHandler,
        updateQueixa,
        baixarDocumento,
      }}
    >
      {children}
    </QueixaContext.Provider>
  );
};

export const useQueixa = () => {
  const context = useContext(QueixaContext);
  if (!context) {
    throw new Error("useQueixa deve ser usado dentro de QueixaProvider");
  }
  return context;
};
