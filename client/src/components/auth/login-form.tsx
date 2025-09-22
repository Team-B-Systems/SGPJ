import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AlertCircle, AlertTriangle, RefreshCw, Scale, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { useNavigate } from "react-router-dom";
import { verify2FA, login, getFuncionarioPerfil } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";

export function LoginForm() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    isAdmin: false,
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    nome: "",
    email: "",
    password: "",
    cargo: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login({
        email: loginData.email,
        password: loginData.password,
        isAdmin: loginData.isAdmin,
      });

      if ('requires2FA' in response && response.requires2FA) {
        localStorage.setItem("temp_token", response.tempToken);
        setShow2FA(true);
      } else if ('token' in response) {
        localStorage.setItem("access_token", response.token);

        const perfil = await getFuncionarioPerfil();
        localStorage.setItem("user", JSON.stringify(perfil));
        setUser(perfil);

        navigate("/");
      }
    } catch (err: any) {
      const apiMessage = err?.response?.data?.error || err.message || "Erro desconhecido";
      console.error("Erro no login:", apiMessage);
      setError(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError("O código deve ter 6 dígitos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const tempToken = localStorage.getItem("temp_token");

      if (!tempToken) {
        setError("Token temporário não encontrado");
        return;
      }

      console.log("Verifying 2FA with tempToken:", tempToken, "and code:", verificationCode);

      const result = await verify2FA(tempToken, verificationCode);

      if (result.token) {
        localStorage.setItem("access_token", result.token);
        localStorage.removeItem("temp_token");
        const perfil = await getFuncionarioPerfil();
        console.log("Fetched perfil:", perfil);
        localStorage.setItem("user", JSON.stringify(perfil));
        setUser(perfil);
        navigate("/");
      } else {
        setError("Código de verificação inválido");
      }
    } catch (error) {
      console.error(error);
      setError("Erro ao verificar o código");
    } finally {
      setLoading(false);
    }
  };

  if (show2FA) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <ShieldCheck className="h-8 w-8 text-primary mr-2" />
              <CardTitle className="text-2xl">SGPJ</CardTitle>
            </div>
            <CardDescription>
              Sistema de Gestão de Processos Jurídicos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <ShieldCheck className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Verificar Código
                </h3>
                <p className="text-muted-foreground">
                  Digite o código de 6 dígitos do seu app autenticador
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="code">Código de Verificação</Label>
                  <Input
                    id="code"
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="000000"
                    className="text-center font-mono text-lg tracking-widest"
                    maxLength={6}
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShow2FA(false);
                    setError("");
                  }}
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleVerifyCode}
                  disabled={verificationCode.length !== 6 || loading}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    "Verificar Código"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Scale className="h-8 w-8 text-primary mr-2" />
            <CardTitle className="text-2xl">SGPJ</CardTitle>
          </div>
          <CardDescription>
            Sistema de Gestão de Processos Jurídicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="w-full bg-white rounded-md">
              <TabsTrigger
                value="login"
                className="w-full flex items-center justify-center px-4 py-2"
              >Login</TabsTrigger>
            </TabsList>

            {/* --- LOGIN --- */}
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seuemail@empresa.com"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">

                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
