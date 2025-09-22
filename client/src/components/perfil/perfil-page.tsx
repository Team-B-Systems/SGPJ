import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { useAuth } from '../../lib/auth-context';
import { User, Mail, Briefcase, Calendar, Shield, Edit, CheckSquareIcon } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { TwoFactorSetup } from '../auth/two-factor-setup';
import { ChangePassword } from '../auth/change-password';

export function PerfilPage() {
  const { user, update, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    cargo: user?.categoria || '',
  });
  const [saveMessage, setSaveMessage] = useState('');
  const [show2FADialog, setShow2FADialog] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const isActive = user?.estado === 'Ativo';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await update(formData.nome);

      setSaveMessage("Perfil atualizado com sucesso!");
      setIsEditing(false);
    } catch (err) {
      setSaveMessage("Erro ao atualizar perfil.");
    } finally {
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };


  const handleCancel = () => {
    setFormData({
      nome: user?.nome || '',
      email: user?.email || '',
      cargo: user?.categoria || '',
    });
    setIsEditing(false);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'administrador':
        return <Badge variant="destructive">Administrador</Badge>;
      case 'chefe':
        return <Badge className="bg-blue-100 text-blue-800">Chefe</Badge>;
      case 'funcionario':
        return <Badge className="bg-green-100 text-green-800">Funcionário</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getPermissions = (role: string) => {
    switch (role) {
      case 'Admin':
        return [
          'Acesso total ao sistema',
          'Gestão de funcionários',
          'Configurações do sistema',
          'Relatórios administrativos',
        ];
      case 'Chefe':
        return [
          'Gestão de processos jurídicos',
          'Gestão de documentos',
          'Gestão de reuniões',
          'Gestão de queixas',
          'Gestão de comissões',
          'Supervisão da equipe'
        ];
      case 'Funcionário':
        return [
          'Visualização de processos',
          'Gestão de documentos',
          'Participação em reuniões',
          'Registar queixas',
          'Visualizar comissões'
        ];
      default:
        return [];
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Utilizador não encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Informação de que o utilizador só poderá utilizar plenamente o sistema após alterar a senha */}
      {!isActive && (
        <Alert variant="warning">
          <AlertDescription className='text-yellow-800 text-lg text-center text-bold'>
            Seu estado atual é "{user.estado}". Por favor, altere sua senha, abaixo, para ativar sua conta e ter acesso a todas as funcionalidades do sistema.
          </AlertDescription>
        </Alert>
      )}
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e configurações
          </p>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            disabled={isEditing || !isActive}
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar Perfil
          </Button>
        )}
      </div>

      {saveMessage && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            {saveMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Suas informações básicas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="seu.email@empresa.com"
                      required
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cargo">Cargo</Label>
                    <Input
                      id="cargo"
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                      placeholder="Seu cargo na empresa"
                      required
                      disabled
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      Salvar Alterações
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{user.nome}</h3>
                      <p className="text-muted-foreground">{user.categoria}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Briefcase className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Cargo</p>
                          <p className="text-sm text-muted-foreground">{user.categoria}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Perfil de Acesso</p>
                          <div className="mt-1">
                            {getRoleBadge(user.role)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Membro desde</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(user.createdAt).toLocaleString("pt-PT", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Permissions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Permissões</CardTitle>
              <CardDescription>
                O que você pode fazer no sistema
                {!isActive && " (Limitado até ativar a conta)"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getPermissions(user.role).map((permission, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm">{permission}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          {isActive && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
                <CardDescription>
                  Seu resumo de atividades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Processos Ativos</span>
                    <span className="text-sm font-semibold">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Documentos Enviados</span>
                    <span className="text-sm font-semibold">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Reuniões Este Mês</span>
                    <span className="text-sm font-semibold">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Queixas Resolvidas</span>
                    <span className="text-sm font-semibold">5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
          <CardDescription>
            Configurações de segurança da sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!isActive && (
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Alterar Senha</h4>
                  <p className="text-sm text-muted-foreground">
                    Atualize sua senha para manter sua conta segura
                  </p>
                </div>
                <Button variant="outline" onClick={() => setShowChangePasswordDialog(true)}>
                  Alterar Senha
                </Button>
              </div>
            )}

            {!user.twoFactorSecret ? (
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Autenticação de Dois Fatores</h4>
                  <p className="text-sm text-muted-foreground">
                    Adicione uma camada extra de segurança à sua conta
                  </p>
                </div>
                <Button variant="outline" onClick={() => setShow2FADialog(true)}>
                  Configurar
                </Button>
              </div>
            ) : (
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Autenticação de Dois Fatores</h4>
                  <p className="text-sm text-muted-foreground">
                    A autenticação de dois fatores está ativada na sua conta
                  </p>
                </div>
                <CheckSquareIcon className="w-6 h-6 text-green-500" />
              </div>
            )}

            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Histórico de Login</h4>
                <p className="text-sm text-muted-foreground">
                  Visualize suas atividades de login recentes
                </p>
              </div>
              <Button variant="outline">
                Ver Histórico
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ChangePassword
        isOpen={showChangePasswordDialog}
        onOpenChange={(open) => {
          setShowChangePasswordDialog(open);

          if (!open) {
            logout()
          }
        }}
      />

      <TwoFactorSetup
        isOpen={show2FADialog}
        onOpenChange={setShow2FADialog}
      />
    </div>
  );
}