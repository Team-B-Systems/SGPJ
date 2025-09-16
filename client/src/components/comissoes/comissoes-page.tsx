import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  Users,
  UserPlus,
  Calendar,
  Building,
  Settings,
  Shield
} from 'lucide-react';
import { mockComissoes, mockFuncionarios, type Comissao } from '../../lib/mock-data';
import { ComissaoForm } from './comissao-form';

export function ComissoesPage() {
  const [comissoes, setComissoes] = useState<Comissao[]>(mockComissoes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedComissao, setSelectedComissao] = useState<Comissao | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingComissao, setEditingComissao] = useState<Comissao | null>(null);
  const [showMemberDialog, setShowMemberDialog] = useState(false);
  const [selectedMemberComissao, setSelectedMemberComissao] = useState<Comissao | null>(null);
  const [selectedMember, setSelectedMember] = useState<string>('');

  const filteredComissoes = comissoes.filter(comissao => {
    const matchesSearch = comissao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comissao.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comissao.responsavel.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || !selectedStatus || comissao.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateComissao = (comissaoData: Omit<Comissao, 'id'>) => {
    const newComissao: Comissao = {
      ...comissaoData,
      id: (comissoes.length + 1).toString(),
    };
    setComissoes([...comissoes, newComissao]);
    setShowForm(false);
  };

  const handleEditComissao = (comissaoData: Omit<Comissao, 'id'>) => {
    if (editingComissao) {
      const updatedComissoes = comissoes.map(c =>
        c.id === editingComissao.id ? { ...comissaoData, id: editingComissao.id } : c
      );
      setComissoes(updatedComissoes);
      setEditingComissao(null);
      setShowForm(false);
    }
  };

  const handleStatusChange = (id: string, newStatus: 'ativa' | 'inativa') => {
    const updatedComissoes = comissoes.map(c =>
      c.id === id ? { ...c, status: newStatus } : c
    );
    setComissoes(updatedComissoes);
  };

  const handleAddMember = () => {
    if (selectedMemberComissao && selectedMember) {
      const funcionario = mockFuncionarios.find(f => f.id === selectedMember);
      if (funcionario && !selectedMemberComissao.membros.includes(funcionario.nome)) {
        const updatedComissoes = comissoes.map(c =>
          c.id === selectedMemberComissao.id 
            ? { ...c, membros: [...c.membros, funcionario.nome] }
            : c
        );
        setComissoes(updatedComissoes);
        setSelectedMember('');
        setShowMemberDialog(false);
      }
    }
  };

  const handleRemoveMember = (comissaoId: string, memberName: string) => {
    const updatedComissoes = comissoes.map(c =>
      c.id === comissaoId 
        ? { ...c, membros: c.membros.filter(m => m !== memberName) }
        : c
    );
    setComissoes(updatedComissoes);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativa':
        return <Badge className="bg-green-100 text-green-800">Ativa</Badge>;
      case 'inativa':
        return <Badge className="bg-gray-100 text-gray-800">Inativa</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const stats = {
    total: comissoes.length,
    ativas: comissoes.filter(c => c.status === 'ativa').length,
    inativas: comissoes.filter(c => c.status === 'inativa').length,
    totalMembros: comissoes.reduce((acc, c) => acc + c.membros.length, 0),
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
            <CardTitle className="text-sm font-medium">Ativas</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.ativas}</div>
            <p className="text-xs text-muted-foreground">em funcionamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inativas</CardTitle>
            <Settings className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.inativas}</div>
            <p className="text-xs text-muted-foreground">suspensas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membros</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalMembros}</div>
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
                  <SelectItem value="ativa">Ativa</SelectItem>
                  <SelectItem value="inativa">Inativa</SelectItem>
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
                  <TableHead>Data Formação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComissoes.map((comissao) => (
                  <TableRow key={comissao.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{comissao.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {comissao.descricao}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(comissao.responsavel)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{comissao.responsavel}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {comissao.membros.slice(0, 3).map((membro, index) => (
                            <Avatar key={index} className="h-6 w-6 border-2 border-background">
                              <AvatarFallback className="text-xs">
                                {getInitials(membro)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {comissao.membros.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                              <span className="text-xs">+{comissao.membros.length - 3}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {comissao.membros.length} membro{comissao.membros.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(comissao.dataFormacao).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(comissao.status)}</TableCell>
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
                                  {getStatusBadge(selectedComissao.status)}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-1">Responsável</h4>
                                    <p className="text-sm">{selectedComissao.responsavel}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-1">Data de Formação</h4>
                                    <p className="text-sm">
                                      {new Date(selectedComissao.dataFormacao).toLocaleDateString('pt-BR')}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Membros ({selectedComissao.membros.length})</h4>
                                  <div className="space-y-2">
                                    {selectedComissao.membros.map((membro, index) => (
                                      <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                                        <div className="flex items-center gap-2">
                                          <Avatar className="h-8 w-8">
                                            <AvatarFallback className="text-xs">
                                              {getInitials(membro)}
                                            </AvatarFallback>
                                          </Avatar>
                                          <span className="text-sm">{membro}</span>
                                          {membro === selectedComissao.responsavel && (
                                            <Badge variant="outline" className="text-xs">
                                              Responsável
                                            </Badge>
                                          )}
                                        </div>
                                        {membro !== selectedComissao.responsavel && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveMember(selectedComissao.id, membro)}
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
                                  {selectedComissao.status === 'ativa' ? (
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
                {mockFuncionarios
                  .filter(f => !selectedMemberComissao?.membros.includes(f.nome))
                  .map((funcionario) => (
                    <SelectItem key={funcionario.id} value={funcionario.id}>
                      {funcionario.nome} - {funcionario.cargo}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowMemberDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddMember} disabled={!selectedMember}>
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}