import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useAuth } from '../../lib/auth-context';
import {
  Plus,
  Search,
  Edit,
  Eye,
  UserCheck,
  UserX
} from 'lucide-react';
import { FuncionarioForm } from './funcionario-form';
import { useFuncionarios } from '../../lib/funcionarios-context';
import { User } from '../../lib/api';

export function FuncionariosPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState<User | null>(null);
  const [selectedFuncionario, setSelectedFuncionario] = useState<User | null>(null);
  const { funcionarios, loading, fetchFuncionarios, addFuncionario, searchFuncionario, updateFuncionario } = useFuncionarios();

  // Only allow admin access
  if (user?.role !== 'Admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
          <p className="text-muted-foreground">
            Apenas administradores podem acessar esta funcionalidade.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchFuncionarios();
  }, [fetchFuncionarios]);


  const filteredFuncionarios = funcionarios.filter(funcionario =>
    funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.departamento.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateFuncionario = (funcionarioData: Omit<User, 'id'>) => {
    const newFuncionario: User = {
      ...funcionarioData,
    };
    addFuncionario(newFuncionario);
    setShowForm(false);
  };

  const handleEditFuncionario = async (funcionarioData: Omit<User, 'email'>) => {
    if (!editingFuncionario || !editingFuncionario.id) return;

    await updateFuncionario(editingFuncionario.id, {
      ...funcionarioData,
      email: editingFuncionario.email,
    });
    console.log("Funcionario atualizado:", funcionarioData);
    setEditingFuncionario(null);
    setShowForm(false);
  };

  const handleToggleStatus = (email: string) => {
    const updatedFuncionarios = funcionarios.map(f =>
      f.email === email ? { ...f, estado: f.estado === 'ativo' ? 'inativo' as const : 'ativo' as const } : f
    );
    //setFuncionarios(updatedFuncionarios);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inativo':
        return <Badge className="bg-red-100 text-red-800">Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPerfilBadge = (perfil: string) => {
    switch (perfil) {
      case 'Admin':
        return <Badge variant="destructive">Administrador</Badge>;
      case 'Chefe':
        return <Badge className="bg-blue-100 text-blue-800">Chefe</Badge>;
      case 'Funcionário':
        return <Badge className="bg-green-100 text-green-800">Funcionário</Badge>;
      default:
        return <Badge variant="outline">{perfil}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Gestão de Funcionários</h1>
          <p className="text-muted-foreground">
            Gerencie funcionários e suas permissões no sistema
          </p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingFuncionario(null); }}>
          <Plus className="w-4 h-4 mr-2" />
          Cadastrar Funcionário
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Pesquisar Funcionários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nome, email, cargo ou departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => searchFuncionario({ email: searchTerm })}
            >
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{funcionarios.length}</div>
            <p className="text-xs text-muted-foreground">funcionários</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {funcionarios.filter(f => f.estado === 'Ativo').length}
            </div>
            <p className="text-xs text-muted-foreground">ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chefes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {funcionarios.filter(f => f.role === 'Chefe').length}
            </div>
            <p className="text-xs text-muted-foreground">chefes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {funcionarios.filter(f => f.role === 'Admin').length}
            </div>
            <p className="text-xs text-muted-foreground">administradores</p>
          </CardContent>
        </Card>
      </div>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Funcionários</CardTitle>
          <CardDescription>
            {filteredFuncionarios.length} funcionário(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-scroll">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Admissão</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFuncionarios.map((funcionario, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{funcionario.nome}</TableCell>
                    <TableCell>{funcionario.email}</TableCell>
                    <TableCell>{funcionario.categoria}</TableCell>
                    <TableCell>{funcionario.departamento}</TableCell>
                    <TableCell>{getPerfilBadge(funcionario.role)}</TableCell>
                    <TableCell>{getStatusBadge(funcionario.estado)}</TableCell>
                    <TableCell>
                      {new Date(funcionario.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedFuncionario(funcionario)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Detalhes do Funcionário</DialogTitle>
                              <DialogDescription>
                                Informações completas do funcionário
                              </DialogDescription>
                            </DialogHeader>
                            {selectedFuncionario && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium">Nome</h4>
                                    <p className="text-sm text-muted-foreground">{selectedFuncionario.nome}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Email</h4>
                                    <p className="text-sm text-muted-foreground">{selectedFuncionario.email}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Cargo</h4>
                                    <p className="text-sm text-muted-foreground">{selectedFuncionario.categoria}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Departamento</h4>
                                    <p className="text-sm text-muted-foreground">{selectedFuncionario.departamento}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Perfil</h4>
                                    <div className="mt-1">{getPerfilBadge(selectedFuncionario.role)}</div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Status</h4>
                                    <div className="mt-1">{getStatusBadge(selectedFuncionario.estado)}</div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Data de Admissão</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(selectedFuncionario.createdAt).toLocaleDateString('pt-BR')}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingFuncionario(funcionario);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        {/* <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(funcionario.email)}
                        >
                          {funcionario.estado === 'Ativo' ? (
                            <UserX className="w-4 h-4 text-red-500" />
                          ) : (
                            <UserCheck className="w-4 h-4 text-green-500" />
                          )}
                        </Button> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Employee Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingFuncionario ? 'Editar Funcionário' : 'Cadastrar Funcionário'}
            </DialogTitle>
            <DialogDescription>
              {editingFuncionario
                ? 'Atualize as informações do funcionário'
                : 'Preencha os dados para cadastrar um novo funcionário'
              }
            </DialogDescription>
          </DialogHeader>
          <FuncionarioForm
            funcionario={editingFuncionario}
            onSubmit={editingFuncionario ? handleEditFuncionario : handleCreateFuncionario}
            onCancel={() => {
              setShowForm(false);
              setEditingFuncionario(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}