import React, { createContext, useContext, useState, useEffect } from "react";
import {
  login as apiLogin,
  getFuncionarioPerfil,
  updateFuncionarioPerfil,
  changePassword as apiChangePassword,
  type User,
  type AuthResponse,
} from "../lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string, isAdmin: boolean) => Promise<boolean>;
  logout: () => void;
  getToken: () => string | null;
  update: (nome: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ message: string }>;
}

interface SignupData {
  nome: string;
  email: string;
  password: string;
  numeroIdentificacao: string;
  categoria: string;
  departamentoId: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Carregar perfil e/ou user salvo no localStorage
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      setLoading(false);
      return;
    }

    if (storedUser) {
      // ✅ recupera user direto do localStorage
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else {
      // ✅ fallback: tenta buscar o perfil na API
      getFuncionarioPerfil()
        .then((perfil) => {
          setUser(perfil);
          localStorage.setItem("user", JSON.stringify(perfil));
        })
        .catch(() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          setUser(null);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  // 🔹 Login com persistência
  const login = async (email: string, password: string, isAdmin: boolean) => {
    setLoading(true);
    try {
      const response = await apiLogin({ email, password, isAdmin });

      if ('token' in response) {
        localStorage.setItem("access_token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        setUser(response.user);

        return true;
      }

      if ("requires2FA" in response) {
        localStorage.setItem("temp_token", response.tempToken);
        return false;
      }

      return false;
    } catch (err: any) {
      const apiMessage =
        err?.response?.data?.error || err.message || "Erro desconhecido";
      console.error("Erro no login:", apiMessage);
    } finally {
      setLoading(false);
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const update = async (nome: string) => {
    try {
      const updatedUser = await updateFuncionarioPerfil({
        nome: nome
      });
      setUser(updatedUser);
      localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    } finally {
      setLoading(false);
    }
  }

  const getToken = () => localStorage.getItem("access_token");

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      const response = await apiChangePassword(oldPassword, newPassword);
      return response;
    } catch (error: any) {
      console.error("Erro ao alterar a senha:", error);
      return { message: error.data.error || "Erro da aplicação, tente novamente." };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        setUser,
        login,
        logout,
        getToken,
        update,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};
