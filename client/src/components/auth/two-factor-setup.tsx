import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Alert, AlertDescription } from '../ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Shield, 
  ShieldCheck, 
  Smartphone, 
  Mail, 
  Copy, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../lib/auth-context';

interface TwoFactorSetupProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TwoFactorSetup({ isOpen, onOpenChange }: TwoFactorSetupProps) {
  const { user } = useAuth();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [currentMethod, setCurrentMethod] = useState<'app' | 'email' | null>(null);
  const [setupStep, setSetupStep] = useState<'choose' | 'setup' | 'verify' | 'complete'>('choose');
  const [verificationCode, setVerificationCode] = useState('');
  const [secretKey, setSecretKey] = useState('JBSWY3DPEHPK3PXP');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // Mock backup codes
  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substr(2, 8).toUpperCase());
    }
    return codes;
  };

  const handleMethodSelect = (method: 'app' | 'email') => {
    setCurrentMethod(method);
    setSetupStep('setup');
    setError('');
    
    if (method === 'app') {
      // Generate new secret key
      setSecretKey('JBSWY3DPEHPK3PXP' + Math.random().toString(36).substr(2, 8).toUpperCase());
    }
  };

  const handleSendEmailCode = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call to send email
      await new Promise(resolve => setTimeout(resolve, 2000));
      setEmailSent(true);
      setEmailCode(Math.floor(100000 + Math.random() * 900000).toString());
    } catch (err) {
      setError('Erro ao enviar código por email. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (currentMethod === 'app' && verificationCode === '123456') {
        // Success for app
        const codes = generateBackupCodes();
        setBackupCodes(codes);
        setSetupStep('complete');
        setTwoFactorEnabled(true);
      } else if (currentMethod === 'email' && verificationCode === emailCode) {
        // Success for email
        const codes = generateBackupCodes();
        setBackupCodes(codes);
        setSetupStep('complete');
        setTwoFactorEnabled(true);
      } else {
        setError('Código inválido. Tente novamente.');
      }
    } catch (err) {
      setError('Erro na verificação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTwoFactorEnabled(false);
      setCurrentMethod(null);
      setSetupStep('choose');
      resetForm();
    } catch (err) {
      setError('Erro ao desativar 2FA. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setVerificationCode('');
    setEmailCode('');
    setEmailSent(false);
    setError('');
    setShowBackupCodes(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadBackupCodes = () => {
    const content = `Códigos de Backup - Autenticação de Dois Fatores
Conta: ${user?.email}
Data: ${new Date().toLocaleDateString('pt-BR')}

IMPORTANTE: Guarde estes códigos em local seguro. Cada código pode ser usado apenas uma vez.

${backupCodes.map((code, index) => `${index + 1}. ${code}`).join('\n')}

Estes códigos podem ser usados para acessar sua conta caso você perca acesso ao seu método de autenticação principal.`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes-2fa.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
          onClick={() => handleMethodSelect('app')}
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

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
          onClick={() => handleMethodSelect('email')}
        >
          <CardContent className="p-6 text-center">
            <Mail className="w-12 h-12 mx-auto text-green-500 mb-3" />
            <h4 className="font-semibold mb-2">Email (Gmail)</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Receba códigos no seu email
            </p>
            <Badge variant="outline">Conveniente</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAppSetup = () => (
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="qr">QR Code</TabsTrigger>
          <TabsTrigger value="manual">Chave Manual</TabsTrigger>
        </TabsList>
        
        <TabsContent value="qr" className="text-center">
          <div className="bg-white p-6 rounded-lg border inline-block">
            <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="grid grid-cols-21 gap-1">
                  {Array.from({ length: 441 }, (_, i) => (
                    <div 
                      key={i} 
                      className={`w-1 h-1 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Escaneie este código com seu app autenticador
          </p>
        </TabsContent>
        
        <TabsContent value="manual">
          <div className="space-y-4">
            <div>
              <Label htmlFor="secret">Chave Secreta</Label>
              <div className="flex mt-1">
                <Input 
                  id="secret"
                  value={secretKey} 
                  readOnly 
                  className="font-mono"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-2"
                  onClick={() => copyToClipboard(secretKey)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Digite esta chave no seu app autenticador
              </p>
            </div>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Importante:</strong> Guarde esta chave em local seguro. 
                Você precisará dela se reinstalar o app.
              </AlertDescription>
            </Alert>
          </div>
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

  const renderEmailSetup = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Mail className="w-16 h-16 mx-auto text-green-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Configurar Verificação por Email
        </h3>
        <p className="text-muted-foreground">
          Enviaremos códigos para {user?.email}
        </p>
      </div>

      <Alert>
        <Mail className="h-4 w-4" />
        <AlertDescription>
          Os códigos de verificação serão enviados para seu email cadastrado. 
          Certifique-se de que pode acessar {user?.email}.
        </AlertDescription>
      </Alert>

      <div className="text-center">
        <Button 
          onClick={handleSendEmailCode}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Enviando Código de Teste...
            </>
          ) : (
            'Enviar Código de Teste'
          )}
        </Button>
        
        {emailSent && (
          <p className="text-sm text-green-600 mt-2">
            Código enviado para {user?.email}
          </p>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setSetupStep('choose')}>
          Voltar
        </Button>
        <Button 
          onClick={() => setSetupStep('verify')}
          disabled={!emailSent}
        >
          Continuar
        </Button>
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="space-y-6">
      <div className="text-center">
        <ShieldCheck className="w-16 h-16 mx-auto text-blue-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Verificar Código
        </h3>
        <p className="text-muted-foreground">
          {currentMethod === 'app' 
            ? 'Digite o código de 6 dígitos do seu app autenticador'
            : `Digite o código enviado para ${user?.email}`
          }
        </p>
      </div>

      {currentMethod === 'app' && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Para teste:</strong> Use o código <code>123456</code>
          </AlertDescription>
        </Alert>
      )}

      {currentMethod === 'email' && emailCode && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Código enviado:</strong> <code>{emailCode}</code>
          </AlertDescription>
        </Alert>
      )}

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
          <strong>Importante:</strong> Guarde os códigos de backup abaixo. 
          Eles podem ser usados para acessar sua conta se você perder acesso ao seu método principal.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Códigos de Backup</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowBackupCodes(!showBackupCodes)}
              >
                {showBackupCodes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={downloadBackupCodes}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            Cada código pode ser usado apenas uma vez
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showBackupCodes ? (
            <div className="grid grid-cols-2 gap-2">
              {backupCodes.map((code, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-2 bg-muted rounded font-mono text-sm"
                >
                  <span>{code}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(code)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Clique no ícone do olho para visualizar os códigos
            </p>
          )}
        </CardContent>
      </Card>

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
          Método atual: {currentMethod === 'app' ? 'App Autenticador' : 'Email (Gmail)'}
        </p>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Sua conta está protegida com autenticação de dois fatores. 
          Para fazer login, você precisará inserir um código além da sua senha.
        </AlertDescription>
      </Alert>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => setShowBackupCodes(true)}>
          Ver Códigos de Backup
        </Button>
        <Button 
          variant="destructive" 
          onClick={handleDisable2FA}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Desativando...
            </>
          ) : (
            'Desativar 2FA'
          )}
        </Button>
      </div>

      {/* Backup codes dialog */}
      <Dialog open={showBackupCodes} onOpenChange={setShowBackupCodes}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Códigos de Backup</DialogTitle>
            <DialogDescription>
              Use estes códigos se você perder acesso ao seu método principal
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {backupCodes.map((code, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-2 bg-muted rounded font-mono text-sm"
                >
                  <span>{code}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(code)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={downloadBackupCodes}>
                <Download className="w-4 h-4 mr-2" />
                Baixar Códigos
              </Button>
              <Button onClick={() => setShowBackupCodes(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
            currentMethod === 'app' ? renderAppSetup() : renderEmailSetup()
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
