import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '../ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '../ui/select';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  Plus, Search, Edit, Eye, Users, UserPlus, Calendar, Building, Settings, Shield
} from 'lucide-react';
import { useFuncionarios } from '../../lib/funcionarios-context';
import { useComissao } from '../../lib/comissao-context';
import { Comissao, type ComissaoCreate, type User, addComissaoMembro, createComissao, editComissao } from '../../lib/api';
import { ComissaoForm } from './comissao-form';


export function ComissoesPage() {
  const { funcionarios, fetchFuncionarios } = useFuncionarios();
  const { comissoes, fetchComissoes } = useComissao();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedComissao, setSelectedComissao] = useState<Comissao | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingComissao, setEditingComissao] = useState<Comissao | null>(null);
  const [showMemberDialog, setShowMemberDialog] = useState(false);
  const [selectedMemberComissao, setSelectedMemberComissao] = useState<Comissao | null>(null);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);

  const filteredComissoes = comissoes.filter(comissao => {
    const matchesSearch =
      comissao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comissao.descricao.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' || !selectedStatus || comissao.estado === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    fetchFuncionarios();
    fetchComissoes()
  }, []);

  const handleCreateComissao = async (comissaoData: ComissaoCreate) => {
    try {
      await createComissao(comissaoData);   // cria no backend
      await fetchComissoes();               // recarrega a lista
      setShowForm(false);
    } catch (error) {
      console.error("Erro ao criar comissão:", error);
    }
  };

  const handleEditComissao = async (comissaoData: ComissaoCreate, id?: number) => {
    if (id) {
      try {
        await editComissao(id, comissaoData);
        await fetchComissoes();
        setEditingComissao(null);
        setShowForm(false);
      } catch (error) {
        console.error("Erro ao editar comissão:", error);
      }
    }
  };

  const handleStatusChange = (id: number, newStatus: 'ativa' | 'inativa') => {
    // update backend
  };

  const handleAddMember = (comissaoData: ComissaoCreate) => {
    if (selectedMemberComissao && selectedMember) {
      const funcionario = funcionarios.find((f: User) => f.id?.toString() === selectedMember.toString());
      if (funcionario) {
        const newMember = {
          email: funcionario.email,
          papel: "Membro"
        }
        addComissaoMembro(selectedMemberComissao.id, newMember)
        setSelectedMember(null);
        setShowMemberDialog(false);
      }
    }
  };

  const handleRemoveMember = (comissaoId: number, funcionarioId: number) => {
    // salvar no backend
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aprovada':
        return <Badge className="bg-green-100 text-green-800">Aprovada</Badge>;
      case 'Rejeitada':
        return <Badge className="bg-gray-100 text-gray-800">Rejeitada</Badge>;
      case 'Dispensada':
        return <Badge className="bg-gray-100 text-gray-800">Dispensada</Badge>;
      case 'Pendente':
        return <Badge className="bg-gray-100 text-gray-800">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getInitials = (name: string | undefined | null) =>
    (name ?? '')
      .split(' ')
      .filter(Boolean) // remove strings vazias
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);


  const stats = {
    total: comissoes.length,
    ativas: comissoes.filter(c => c.estado === 'Aprovada').length,
    dispensadas: comissoes.filter(c => c.estado === 'Dispensada').length,
    rejeitadas: comissoes.filter(c => c.estado === 'Rejeitada').length,
    pendentes: comissoes.filter(c => c.estado === 'Pendente').length,
    totalFuncionarios: comissoes.reduce((acc, c) => acc + c.funcionarios.length, 0),
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Gestão de Comissões</h1>
          <p className="text-muted-foreground">
            Gerencie comissões e seus membros
          </p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingComissao(null); }}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Comissão
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">comissões</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.ativas}</div>
            <p className="text-xs text-muted-foreground">em funcionamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Settings className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.pendentes}</div>
            <p className="text-xs text-muted-foreground">pendentes</p>
          </CardContent>
        </Card>


        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
            <Settings className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.rejeitadas}</div>
            <p className="text-xs text-muted-foreground">rejeitadas</p>
          </CardContent>
        </Card>


        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dispensadas</CardTitle>
            <Settings className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.dispensadas}</div>
            <p className="text-xs text-muted-foreground">dispensadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membros</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalFuncionarios}</div>
            <p className="text-xs text-muted-foreground">total de membros</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Pesquisar Comissões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nome, descrição ou responsável..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-40">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Aprovada">Aprovada</SelectItem>
                  <SelectItem value="Rejeitada">Rejeitada</SelectItem>
                  <SelectItem value="Dispensada">Dispensada</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comissoes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Comissões</CardTitle>
          <CardDescription>
            {filteredComissoes.length} comissão(ões) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Comissão</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Membros</TableHead>
                  <TableHead>Data Criação</TableHead>
                  <TableHead>Data Encenrramento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComissoes.map((comissao, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{comissao.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {comissao.descricao}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex -space-x-2">
                        {comissao.funcionarios.find((fc) => fc.papel === "Presidente")?.funcionario.nome ?? 'Sem coordenador'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {comissao.funcionarios.length} membro{comissao.funcionarios.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(comissao.dataCriacao).toLocaleDateString('pt-PT')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-muted-foreground" />
                        <span className="text-sm">
                          {comissao.dataEncerramento
                            ? new Date(comissao.dataEncerramento).toLocaleDateString('pt-PT')
                            : 'Não definida'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(comissao.estado)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedComissao(comissao)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalhes da Comissão</DialogTitle>
                              <DialogDescription>
                                Informações completas sobre a comissão
                              </DialogDescription>
                            </DialogHeader>
                            {selectedComissao && (
                              <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold text-lg">{selectedComissao.nome}</h3>
                                    <p className="text-muted-foreground">
                                      {selectedComissao.descricao}
                                    </p>
                                  </div>
                                  {getStatusBadge(selectedComissao.estado)}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-1">Responsável</h4>
                                    <p className="text-sm">   {
                                      funcionarios.find(
                                        (f) =>
                                          f.id ===
                                          selectedComissao.funcionarios.find(
                                            (m) => m.papel === "Presidente"
                                          )?.funcionarioId
                                      )?.nome || "Não definido"
                                    }</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-1">Data de Formação</h4>
                                    <p className="text-sm">
                                      {new Date(selectedComissao.dataCriacao).toLocaleDateString('pt-BR')}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">
                                    Funcionários ({selectedComissao.funcionarios.length})
                                  </h4>

                                  <div className="space-y-2">
                                    {selectedComissao.funcionarios.map((membro, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between p-2 border rounded-lg"
                                      >
                                        <div className="flex items-center gap-2">
                                          {membro.funcionario.nome}

                                          {membro.papel === "Presidente" && (
                                            <Badge variant="outline" className="text-xs">
                                              Presidente
                                            </Badge>
                                          )}
                                        </div>

                                        {membro.papel !== "Presidente" && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              handleRemoveMember(selectedComissao.id, membro.funcionarioId)
                                            }
                                          >
                                            Remover
                                          </Button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedMemberComissao(selectedComissao);
                                      setShowMemberDialog(true);
                                    }}
                                  >
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Adicionar Membro
                                  </Button>
                                  {selectedComissao.estado === 'Aprovada' ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleStatusChange(selectedComissao.id, 'inativa')}
                                    >
                                      Desativar
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      onClick={() => handleStatusChange(selectedComissao.id, 'ativa')}
                                    >
                                      Ativar
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingComissao(comissao);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedMemberComissao(comissao);
                            setShowMemberDialog(true);
                          }}
                        >
                          <UserPlus className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Comissao Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingComissao ? 'Editar Comissão' : 'Nova Comissão'}
            </DialogTitle>
            <DialogDescription>
              {editingComissao
                ? 'Atualize as informações da comissão'
                : 'Cadastre uma nova comissão'
              }
            </DialogDescription>
          </DialogHeader>
          <ComissaoForm
            comissao={editingComissao}
            onSubmit={editingComissao ? handleEditComissao : handleCreateComissao}
            onCancel={() => {
              setShowForm(false);
              setEditingComissao(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={showMemberDialog} onOpenChange={setShowMemberDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Membro</DialogTitle>
            <DialogDescription>
              Selecione um funcionário para adicionar à comissão
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={selectedMember} onValueChange={setSelectedMember}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um funcionário" />
              </SelectTrigger>
              <SelectContent>
                {funcionarios.map(funcionario => (
                  <SelectItem key={funcionario.id} value={funcionario.id?.toString()}>
                    {funcionario.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowMemberDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={() => selectedMemberComissao && handleAddMember(selectedMemberComissao)} disabled={!selectedMember}>
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}