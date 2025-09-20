import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getProcessos, Processo, ProcessoListResponse } from "../lib/api";

interface ProcessosContextType {
  processos: Processo[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  fetchProcessos: (page?: number, pageSize?: number) => Promise<void>;
}

const ProcessosContext = createContext<ProcessosContextType | undefined>(undefined);

export const ProcessosProvider = ({ children }: { children: React.ReactNode }) => {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchProcessos = useCallback(
  async (pageParam: number = 1, pageSizeParam: number = 10) => {
    setLoading(true);
    try {
      const data: ProcessoListResponse = await getProcessos(pageParam, pageSizeParam);
      console.log(data.processes)
      setProcessos(data.processes);
      setTotal(data.total);
      setPage(data.page);
      setPageSize(data.pageSize);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      console.error("Erro ao buscar processos:", err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  },
  [] // ✅ função estável
);


  // 🔹 Carregar processos na primeira montagem
  useEffect(() => {
    fetchProcessos();
  }, []);

  return (
    <ProcessosContext.Provider
      value={{
        processos,
        total,
        page,
        pageSize,
        totalPages,
        loading,
        fetchProcessos,
      }}
    >
      {children}
    </ProcessosContext.Provider>
  );
};

export const useProcessos = (): ProcessosContextType => {
  const context = useContext(ProcessosContext);
  if (!context) {
    throw new Error("useProcessos deve ser usado dentro de ProcessosProvider");
  }
  return context;
};
