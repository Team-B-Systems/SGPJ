import React, { useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Users, Plus, Search, Eye, Edit, Trash2, Filter, UserCheck, UserX } from 'lucide-react';
import { Envolvido, mockEnvolvidos, mockProcessos } from '../../lib/mock-data';
import { EnvolvidoForm } from './envolvido-form';
import { useAuth } from '../../lib/auth-context';

export function EnvolvidosPage() {
  const { user } = useAuth();
  const [envolvidos, setEnvolvidos] = useState<Envolvido[]>(mockEnvolvidos);
  const [selectedEnvolvido, setSelectedEnvolvido] = useState<Envolvido | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcesso, setSelectedProcesso] = useState<string>('all');
  const [selectedTipo, setSelectedTipo] = useState<string>('all');
  const [selectedParte, setSelectedParte] = useState<string>('all');

  const canEdit = user?.perfil === 'funcionario' || user?.perfil === 'administrador';

  const filteredEnvolvidos = useMemo(() => {
    return envolvidos.filter(envolvido => {
      const matchesSearch = envolvido.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           envolvido.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           envolvido.contato.includes(searchTerm);
      
      const matchesProcesso = selectedProcesso === 'all' || envolvido.processoId === selectedProcesso;
      const matchesTipo = selectedTipo === 'all' || envolvido.tipo === selectedTipo;
      const matchesParte = selectedParte === 'all' || envolvido.parte === selectedParte;

      return matchesSearch && matchesProcesso && matchesTipo && matchesParte;
    });
  }, [envolvidos, searchTerm, selectedProcesso, selectedTipo, selectedParte]);

  const handleSubmitEnvolvido = (envolvidoData: Omit<Envolvido, 'id'>) => {
    if (selectedEnvolvido) {
      // Editar envolvido existente
      setEnvolvidos(prev => prev.map(env => 
        env.id === selectedEnvolvido.id 
          ? { ...envolvidoData, id: selectedEnvolvido.id }
          : env
      ));
    } else {
      // Adicionar novo envolvido
      const newEnvolvido: Envolvido = {
        ...envolvidoData,
        id: (envolvidos.length + 1).toString()
      };
      setEnvolvidos(prev => [...prev, newEnvolvido]);
    }
    setSelectedEnvolvido(null);
  };

  const handleEditEnvolvido = (envolvido: Envolvido) => {
    setSelectedEnvolvido(envolvido);
    setIsFormOpen(true);
  };

  const handleViewEnvolvido = (envolvido: Envolvido) => {
    setSelectedEnvolvido(envolvido);
    setIsFormOpen(true);
  };

  const handleDeleteEnvolvido = (id: string) => {
    setEnvolvidos(prev => prev.filter(env => env.id !== id));
  };

  const getProcessoTitulo = (processoId: string) => {
    const processo = mockProcessos.find(p => p.id === processoId);
    return processo ? `${processo.numeroProcesso} - ${processo.titulo}` : 'Processo não encontrado';
  };

  const getTipoBadgeVariant = (tipo: string) => {
    return tipo === 'interno' ? 'default' : 'secondary';
  };

  const getParteBadgeVariant = (parte: string) => {
    return parte === 'ativa' ? 'default' : 'outline';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedProcesso('all');
    setSelectedTipo('all');
    setSelectedParte('all');
  };

  const hasActiveFilters = searchTerm || (selectedProcesso !== 'all') || (selectedTipo !== 'all') || (selectedParte !== 'all');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1>Gestão de Envolvidos</h1>
        </div>
        {canEdit && (
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Envolvido
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-semibold">{envolvidos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Internos</p>
                <p className="text-xl font-semibold">
                  {envolvidos.filter(e => e.tipo === 'interno').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserX className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Externos</p>
                <p className="text-xl font-semibold">
                  {envolvidos.filter(e => e.tipo === 'externo').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Filtrados</p>
                <p className="text-xl font-semibold">{filteredEnvolvidos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <h3 className="font-medium">Filtros</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Limpar Filtros
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Buscar por nome, email ou contato..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              <Select value={selectedProcesso} onValueChange={setSelectedProcesso}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os processos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os processos</SelectItem>
                  {mockProcessos.map((processo) => (
                    <SelectItem key={processo.id} value={processo.id}>
                      {processo.numeroProcesso}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="interno">Funcionário Interno</SelectItem>
                  <SelectItem value="externo">Parte Externa</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedParte} onValueChange={setSelectedParte}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as partes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as partes</SelectItem>
                  <SelectItem value="ativa">Parte Ativa</SelectItem>
                  <SelectItem value="passiva">Parte Passiva</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Envolvidos Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Envolvidos ({filteredEnvolvidos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEnvolvidos.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum envolvido encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {hasActiveFilters 
                  ? 'Tente ajustar os filtros de pesquisa.'
                  : 'Adicione o primeiro envolvido para começar.'
                }
              </p>
              {canEdit && !hasActiveFilters && (
                <Button onClick={() => setIsFormOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Envolvido
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Processo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Parte</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnvolvidos.map((envolvido) => (
                  <TableRow key={envolvido.id}>
                    <TableCell className="font-medium">
                      {envolvido.nome}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="truncate text-sm">
                          {getProcessoTitulo(envolvido.processoId)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTipoBadgeVariant(envolvido.tipo)}>
                        {envolvido.tipo === 'interno' ? 'Interno' : 'Externo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getParteBadgeVariant(envolvido.parte)}>
                        {envolvido.parte === 'ativa' ? 'Ativa' : 'Passiva'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {envolvido.cargo || '-'}
                    </TableCell>
                    <TableCell>{envolvido.contato}</TableCell>
                    <TableCell>{envolvido.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewEnvolvido(envolvido)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {canEdit && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditEnvolvido(envolvido)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Excluir Envolvido</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir {envolvido.nome} da lista de envolvidos? 
                                    Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteEnvolvido(envolvido.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <EnvolvidoForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedEnvolvido(null);
        }}
        onSubmit={handleSubmitEnvolvido}
        envolvido={selectedEnvolvido || undefined}
      />
    </div>
  );
}