import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Users, Plus, Search, Eye, Edit, Trash2, Filter, UserCheck, UserX } from 'lucide-react';
import { EnvolvidoForm } from './envolvido-form';
import { useAuth } from '../../lib/auth-context';
import { addParteEnvolvida, removeParteEnvolvida, AdicionarParteDTO, Envolvido } from '../../lib/api';
import { useProcessos } from '../../lib/processos-context';

export function EnvolvidosPage() {
  const { user } = useAuth();
  const { processos } = useProcessos();
  const [envolvidos, setEnvolvidos] = useState<Envolvido[]>([]);
  const [selectedEnvolvido, setSelectedEnvolvido] = useState<Envolvido | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcesso, setSelectedProcesso] = useState<string>('all');
  const [selectedTipo, setSelectedTipo] = useState<string>('all');
  const [selectedParte, setSelectedParte] = useState<string>('all');
  const { fetchProcessos } = useProcessos();

  const canEdit = user?.role === 'Funcionário' || user?.role === 'Admin';

  useEffect(() => {
    if (processos.length > 0) {
      const allEnvolvidos = processos.flatMap(processo =>
        processo.envolvidos.map(envolvido => ({
          ...envolvido,
        }))
      );
      setEnvolvidos(allEnvolvidos);
    }
  }, [processos]);

  const filteredEnvolvidos = useMemo(() => {
    return envolvidos.filter(envolvido => {
      const matchesSearch = envolvido.envolvido.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        envolvido.envolvido.numeroIdentificacao.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProcesso = selectedProcesso === 'all' || processos.find(p => p.id === envolvido.processoJuridicoId)?.numeroProcesso === selectedProcesso;
      const matchesTipo = selectedTipo === 'all' || envolvido.papelNoProcesso === selectedTipo;

      return matchesSearch && matchesProcesso && matchesTipo;
    });
  }, [envolvidos, searchTerm, selectedProcesso, selectedTipo, selectedParte]);

  const handleSubmitEnvolvido = async (envolvidoData: Omit<Envolvido, 'id'>) => {
    console.log(envolvidoData);
    
    try {
      // Criar DTO para criar envolvido
      const dto: AdicionarParteDTO = {
        processoId: envolvidoData.processoJuridicoId,
        nome: envolvidoData.envolvido.nome,
        numeroIdentificacao: envolvidoData.envolvido.numeroIdentificacao,
        papel: envolvidoData.papelNoProcesso,
      };

      await addParteEnvolvida(dto);

      // Atualizar lista local com resposta real do backend
      await fetchProcessos();
    } catch (err: any) {
      console.error(err.response?.data?.error || 'Erro ao salvar envolvido');
    } finally {
      setSelectedEnvolvido(null);
      setIsFormOpen(false);
    }
      
  };

  const handleEditEnvolvido = (envolvido: Envolvido) => {
    setSelectedEnvolvido(envolvido);
    setIsFormOpen(true);
  };

  const handleViewEnvolvido = (envolvido: Envolvido) => {
    setSelectedEnvolvido(envolvido);
    setIsFormOpen(true);
  };

  const handleDeleteEnvolvido = async (processoId: number, parteEnvolvidaId: number) => {
    try {
      await removeParteEnvolvida(processoId, parteEnvolvidaId);
      await fetchProcessos();
    } catch (err: any) {
      console.error(err.response?.data?.error || 'Erro ao remover envolvido');
      console.log(err)
    } finally {
      setSelectedEnvolvido(null);
      setIsFormOpen(false);
    }
  };

  const getProcessoTitulo = (processoId: string) => {
    const processo = processos.find(p => p.id.toString() === processoId);
    return processo ? `${processo.numeroProcesso} - ${processo.assunto}` : 'Processo não encontrado';
  };

  const getTipoBadgeVariant = (tipo: string) => {
    return tipo === 'Autor' ? 'default' : 'secondary';
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
          <h1>Gestão de Envolvidos dos Processos de - {user?.nome}</h1>
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
                <p className="text-sm text-muted-foreground">Peritos</p>
                <p className="text-xl font-semibold">
                  {envolvidos.filter(e => e.papelNoProcesso === 'Perito').length}
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
                <p className="text-sm text-muted-foreground">Testemunhas</p>
                <p className="text-xl font-semibold">
                  {envolvidos.filter(e => e.papelNoProcesso === 'Autor').length}
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
                  {processos.map((processo) => (
                    <SelectItem key={processo.id} value={processo.numeroProcesso}>
                      {processo.numeroProcesso}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os papéis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="Autor">Autor</SelectItem>
                  <SelectItem value="Réu">Réu</SelectItem>
                  <SelectItem value="Testemunha">Testemunha</SelectItem>
                  <SelectItem value="Perito">Perito</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
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
                  <TableHead>Papel no Processo</TableHead>
                  <TableHead>Nº de Identificação</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnvolvidos.map((envolvido) => (
                  <TableRow key={envolvido.id}>
                    <TableCell className="font-medium">
                      {envolvido.envolvido.nome}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="truncate text-sm">
                          {getProcessoTitulo(envolvido.processoJuridicoId.toString())}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTipoBadgeVariant(envolvido.papelNoProcesso)}>
                        {envolvido.papelNoProcesso}
                      </Badge>
                    </TableCell>
                    <TableCell>{envolvido.envolvido.numeroIdentificacao}</TableCell>
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
                                    Tem certeza que deseja excluir {envolvido.envolvido.nome} da lista de envolvidos?
                                    Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteEnvolvido(envolvido.processoJuridicoId, envolvido.id)}
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
        processoId={selectedEnvolvido?.processoJuridicoId || undefined}
      />
    </div>
  );
}