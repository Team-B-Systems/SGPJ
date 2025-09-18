import React, { use, useEffect, useMemo, useState } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '../ui/dialog';
import {
  Plus, Search, Edit, Eye, AlertTriangle, CheckCircle, Clock,
} from 'lucide-react';
import { QueixaForm } from './queixa-form';
import { Queixa} from '../../lib/api';
import { useQueixa } from '../../lib/queixa-context';
import { useProcessos } from '../../lib/processos-context';

export function QueixasPage() {
  const { queixas, fetchQueixas, addQueixa, updateQueixa } = useQueixa();
  const { fetchProcessos} = useProcessos();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQueixa, setSelectedQueixa] = useState<Queixa | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingQueixa, setEditingQueixa] = useState<Queixa | null>(null);

  useEffect(() => {
    fetchQueixas();
  }, [fetchQueixas]);

  useEffect(() => {
    fetchProcessos();
  }, [fetchProcessos]);

  const filteredQueixas = useMemo(() => {
    return queixas.filter((q) =>
      q.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [queixas, searchTerm]);

  const handleCreateQueixa = async (data: Queixa) => {
    const queixa: Queixa = {
      id: data.id, 
      descricao: data.descricao,
      estado: data.estado,
      dataEntrada: new Date(data.dataEntrada).toISOString(),
      ficheiro: data.ficheiro, 
      pPassivaId: data.pPassivaId,
      funcionarioId: data.funcionarioId,
    };
    await addQueixa(queixa);
    setShowForm(false);
  };

  const handleEditQueixa = async (data: Queixa) => {
    if (!editingQueixa?.id) return;

    await updateQueixa(editingQueixa.id?.toString(), {
      ...data,
    id: editingQueixa.id,});
    setEditingQueixa(null);
    setShowForm(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aberta':
        return <Badge variant="destructive">Aberta</Badge>;
      case 'em_analise':
        return <Badge className="bg-yellow-100 text-yellow-800">Em Análise</Badge>;
      case 'resolvida':
        return <Badge className="bg-green-100 text-green-800">Resolvida</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return <Badge variant="destructive">Alta</Badge>;
      case 'media':
        return <Badge variant="secondary">Média</Badge>;
      case 'baixa':
        return <Badge variant="outline">Baixa</Badge>;
      default:
        return <Badge variant="outline">{prioridade}</Badge>;
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'Pendente':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'EmAnalise':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Aceite':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Rejeitada':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const stats = {
    total: queixas.length,
    pendente: queixas.filter((q) => q.estado === 'Pendente').length,
    aceite: queixas.filter((q) => q.estado === 'Aceite').length,
    emAnalise: queixas.filter((q) => q.estado === 'EmAnalise').length,
    rejeitada: queixas.filter((q) => q.estado === 'Rejeitada').length,
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Gestão de Queixas</h1>
          <p className="text-muted-foreground">
            Gerencie queixas e reclamações do sistema
          </p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingQueixa(null); }}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Queixa
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Total', value: stats.total, icon: <AlertTriangle className="h-4 w-4 text-muted-foreground" /> },
           { title: 'Pendentes', value: stats.pendente, icon: <AlertTriangle className="h-4 w-4 text-red-500" /> },
          { title: 'Em Análise', value: stats.emAnalise, icon: <Clock className="h-4 w-4 text-yellow-500" /> },
          { title: 'Aceites', value: stats.aceite, icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
           { title: 'Rejeitadas', value: stats.rejeitada, icon: <AlertTriangle className="h-4 w-4 text-red-500" /> },
        ].map((s) => (
          <Card key={s.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
              {s.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
              <p className="text-xs text-muted-foreground">queixas</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pesquisa */}
      <Card>
        <CardHeader>
          <CardTitle>Pesquisar Queixas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Buscar por título ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Queixas</CardTitle>
          <CardDescription>
            {filteredQueixas.length} queixa(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Data Abertura</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueixas.map((q, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(q.estado)}
                        <div>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {q.descricao}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(q.estado)}</TableCell>
                    <TableCell>{new Date(q.dataEntrada).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedQueixa(q)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalhes da Queixa</DialogTitle>
                              <DialogDescription>
                                Informações completas
                              </DialogDescription>
                            </DialogHeader>
                            {selectedQueixa && (
                              <div className="space-y-4">
                                <h2 className="text-lg font-semibold">Descrição</h2>
                                <p>{selectedQueixa.descricao}</p>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingQueixa(q);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
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

      {/* Formulário */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingQueixa ? 'Editar Queixa' : 'Nova Queixa'}</DialogTitle>
            <DialogDescription>
              {editingQueixa ? 'Atualize as informações da queixa' : 'Registre uma nova queixa'}
            </DialogDescription>
          </DialogHeader>
          <QueixaForm
            queixa={editingQueixa ?? undefined}
            onSubmit={editingQueixa ? handleEditQueixa : handleCreateQueixa}
            onCancel={() => {
              setShowForm(false);
              setEditingQueixa(null);
            }}
            funcionarios={[]} // Replace with actual data or state
            partesPassivas={[]} // Replace with actual data or state
            departamentos={[]} // Replace with actual data or state
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
