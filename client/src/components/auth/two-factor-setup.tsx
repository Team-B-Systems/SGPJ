import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Shield,
  ShieldCheck,
  Smartphone,
  Copy,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  RefreshCcw,
} from 'lucide-react';
import { generate2FASecret, verify2FA } from '../../lib/api';

interface TwoFactorSetupProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TwoFactorSetup({ isOpen, onOpenChange }: TwoFactorSetupProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [setupStep, setSetupStep] = useState<'choose' | 'setup' | 'verify' | 'complete'>('choose');
  const [verificationCode, setVerificationCode] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log("TwoFactorSetup opened:", isOpen);
    const fetchQrCode = async () => {
      try {
        setIsLoading(true);
        const result = await generate2FASecret();
        setQrCode(result.qrCodeUrl);
        setSecret(result.secret);
      } catch (err) {
        setError('Erro ao gerar QR Code. Tente novamente.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!qrCode && isOpen) {
      fetchQrCode();
    } else {
      console.log("QR Code already loaded:", qrCode, !qrCode && isOpen);
    }
  }, [qrCode, isOpen]);

  const handleMethodSelect = () => {
    setSetupStep('setup');
    setError('');
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        setError('Utilizador não autenticado.');
        setIsLoading(false);
        return;
      }

      const result = await verify2FA(token, verificationCode);

      console.log("2FA verification result:", result);

      if (result.token) {
        // 2FA verificado com sucesso
        localStorage.setItem('access_token', result.token);
        setTwoFactorEnabled(true);
        setSetupStep('complete');
      } else {
        setError('Código de verificação inválido.');
      }
    } catch (err) {
      setError('Erro na verificação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setVerificationCode('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderChooseMethod = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="w-16 h-16 mx-auto text-blue-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Escolha seu Método de Autenticação
        </h3>
        <p className="text-muted-foreground">
          Selecione como você deseja receber os códigos de verificação
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
          onClick={handleMethodSelect}
        >
          <CardContent className="p-6 text-center">
            <Smartphone className="w-12 h-12 mx-auto text-blue-500 mb-3" />
            <h4 className="font-semibold mb-2">App Autenticador</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Use Google Authenticator, Authy ou similar
            </p>
            <Badge variant="secondary">Recomendado</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAppSetup = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Smartphone className="w-16 h-16 mx-auto text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Configure seu App Autenticador
          </h3>
          <p className="text-muted-foreground">
            Escaneie o QR Code ou digite a chave secreta
          </p>
        </div>

        <Tabs defaultValue="qr" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="qr">QR Code</TabsTrigger>
          </TabsList>

          <TabsContent value="qr" className="text-center">
            <div className="bg-white p-6 rounded-lg border inline-block">
              <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  {isLoading ? (
                    <div className="animate-pulse text-gray-400">Carregando QR Code...</div>
                  ) : qrCode ? (
                    <img src={qrCode} alt="QR Code" className="w-full h-full" />
                  ) : (
                    <>
                      <div className="text-gray-400">Erro ao carregar QR Code</div>
                      {
                        qrCode === null ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              console.log("IsOpen: ", isOpen);
                              setQrCode(null);
                            }}
                          >
                            <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                            Recarregar QR Code
                          </Button>
                        ) : null
                      }
                    </>
                  )}
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-1">Chave Secreta:</p>
                    <div className="flex items-center justify-center space-x-2">
                      <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded select-all">{secret}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(secret || '')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Escaneie este código com seu app autenticador
            </p>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setSetupStep('choose')}>
            Voltar
          </Button>
          <Button onClick={() => setSetupStep('verify')}>
            Continuar
          </Button>
        </div>
      </div>
    );
  }

  const renderVerification = () => (
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
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
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
        <Button variant="outline" onClick={() => setSetupStep('setup')}>
          Voltar
        </Button>
        <Button
          onClick={handleVerifyCode}
          disabled={verificationCode.length !== 6 || isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Verificando...
            </>
          ) : (
            'Verificar Código'
          )}
        </Button>
      </div>
    </div>
  );

  const renderComplete = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Autenticação de Dois Fatores Ativada!
        </h3>
        <p className="text-muted-foreground">
          Sua conta agora está mais segura
        </p>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Importante:</strong> Os códigos do Google Authenticator são gerados no seu dispositivo.
          Eles podem ser usados para acessar sua conta se você perder acesso ao seu método principal.
        </AlertDescription>
      </Alert>

      <div className="flex justify-end">
        <Button onClick={handleClose}>
          Concluir
        </Button>
      </div>
    </div>
  );

  const renderCurrentStatus = () => (
    <div className="space-y-6">
      <div className="text-center">
        <ShieldCheck className="w-16 h-16 mx-auto text-green-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Autenticação de Dois Fatores Ativa
        </h3>
        <p className="text-muted-foreground">
          Método atual: App Autenticador
        </p>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Sua conta está protegida com autenticação de dois fatores.
          Para fazer login, você precisará inserir um código além da sua senha.
        </AlertDescription>
      </Alert>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Autenticação de Dois Fatores</DialogTitle>
          <DialogDescription>
            Adicione uma camada extra de segurança à sua conta
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {twoFactorEnabled && setupStep === 'choose' ? (
            renderCurrentStatus()
          ) : setupStep === 'choose' ? (
            renderChooseMethod()
          ) : setupStep === 'setup' ? (
            renderAppSetup()
          ) : setupStep === 'verify' ? (
            renderVerification()
          ) : (
            renderComplete()
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
