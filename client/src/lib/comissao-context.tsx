import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { 
    getComissoes, 
    createComissao as createComissaoApi, 
    editComissao as editComissaoApi, 
    addComissaoMembro as addComissaoMembroApi, 
    ComissaoCreate,  
    Comissao
} from "../lib/api";

interface ComissaoContextType {
    comissoes: Comissao[]; // Lista de comissões
    loading: boolean;
    createComissao: (comissao: ComissaoCreate) => Promise<void>; // Função para criar comissão
    editComissao: (id: number, data: Partial<ComissaoCreate>) => Promise<void>; // Função para editar comissão
    addComissaoMembro: (comissaoId: number,email: string, papel: string) => Promise<void>; // Função para adicionar membro à comissão
    fetchComissoes: () => Promise<void>; // Função para buscar comissões
}

const ComissaoContext = createContext<ComissaoContextType | undefined>(undefined);

export const ComissaoProvider = ({ children }: { children: React.ReactNode }) => {

    // Estado para armazenar as comissões
    const [comissoes, setComissoes] = useState<Comissao[]>([]);
    const [loading, setLoading] = useState(false);

    // Função para buscar as comissões
    const fetchComissoes = useCallback(
        async () => {
            setLoading(true);
            try {
                const response = await getComissoes();
                setComissoes(response); // Armazenar as comissões no estado
            } catch (err: any) {
                console.error("Erro ao buscar comissões:", err?.response?.data?.error || err.message);
            } finally {
                setLoading(false);
            }
        },
        [] // ✅ função estável
    );

    // Função para criar comissão
    const createComissao = async (comissao: ComissaoCreate) => {
        try {
            await createComissaoApi(comissao); // Chama a API para criar a comissão
            await fetchComissoes(); // Recarrega a lista de comissões após a criação
        } catch (err: any) {
            console.error("Erro ao criar comissão:", err?.response?.data?.error || err.message);
        }
    };

    // Função para editar comissão
    const editComissao = async (id: number, data: Partial<ComissaoCreate>) => {
        try {
            await editComissaoApi(id, data); // Chama a API para editar a comissão
            await fetchComissoes(); // Recarrega a lista de comissões após a edição
        } catch (err: any) {
            console.error("Erro ao editar comissão:", err?.response?.data?.error || err.message);
        }
    };

    // Função para adicionar membro à comissão
    const addComissaoMembro = async (comissaoId: number,email: string, papel: string) => {
        try {
            const data = {
                email: email,
                papel: papel
            }
            await addComissaoMembroApi(comissaoId, data); // Chama a API para adicionar membro à comissão
            await fetchComissoes(); // Recarrega a lista de comissões após adicionar o membro
        } catch (err: any) {
            console.error("Erro ao adicionar membro à comissão:", err?.response?.data?.error || err.message);
        }
    };

    // Carregar as comissões na primeira montagem
    useEffect(() => {
        fetchComissoes();
    }, []);

    return (
        <ComissaoContext.Provider
            value={{
                comissoes,
                createComissao,
                editComissao,
                addComissaoMembro,  // Expondo a função no contexto
                loading,
                fetchComissoes,
            }}
        >
            {children}
        </ComissaoContext.Provider>
    );
};

export const useComissao = (): ComissaoContextType => {
    const context = useContext(ComissaoContext);
    if (!context) {
        throw new Error("useComissao deve ser usado dentro de ComissaoProvider");
    }
    return context;
};
