import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  Archive, 
  FileText, 
  Calendar, 
  Users 
} from 'lucide-react';
import { mockProcessos, mockDocumentos, mockReunioes, mockEnvolvidos, type Processo } from '../../lib/mock-data';
import { ProcessForm } from './process-form';
import { ProcessDetails } from './process-details';

export function ProcessosPage() {
  const [processos, setProcessos] = useState<Processo[]>(mockProcessos);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcess, setSelectedProcess] = useState<Processo | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProcess, setEditingProcess] = useState<Processo | null>(null);

  const filteredProcessos = processos.filter(processo =>
    processo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    processo.numeroProcesso.toLowerCase().includes(searchTerm.toLowerCase()) ||
    processo.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProcess = (processData: Omit<Processo, 'id'>) => {
    const newProcess: Processo = {
      ...processData,
      id: (processos.length + 1).toString(),
    };
    setProcessos([...processos, newProcess]);
    setShowForm(false);
  };

  const handleEditProcess = (processData: Omit<Processo, 'id'>) => {
    if (editingProcess) {
      const updatedProcessos = processos.map(p =>
        p.id === editingProcess.id ? { ...processData, id: editingProcess.id } : p
      );
      setProcessos(updatedProcessos);
      setEditingProcess(null);
      setShowForm(false);
    }
  };

  const handleArchiveProcess = (id: string) => {
    const updatedProcessos = processos.map(p =>
      p.id === id ? { ...p, status: 'arquivado' as const } : p
    );
    setProcessos(updatedProcessos);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'pendente':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'arquivado':
        return <Badge className="bg-gray-100 text-gray-800">Arquivado</Badge>;
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

  const getProcessDocuments = (processoId: string) => {
    return mockDocumentos.filter(doc => doc.processoId === processoId);
  };

  const getProcessMeetings = (processoId: string) => {
    return mockReunioes.filter(reuniao => reuniao.processoId === processoId);
  };

  const getProcessInvolved = (processoId: string) => {
    return mockEnvolvidos.filter(envolvido => envolvido.processoId === processoId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Gestão de Processos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os processos jurídicos do sistema
          </p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingProcess(null); }}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Processo
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Pesquisar Processos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por título, número do processo ou responsável..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Processes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Processos</CardTitle>
          <CardDescription>
            {filteredProcessos.length} processo(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Data Abertura</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcessos.map((processo) => (
                  <TableRow key={processo.id}>
                    <TableCell className="font-mono">
                      {processo.numeroProcesso}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{processo.titulo}</p>
                        <p className="text-sm text-muted-foreground">
                          {processo.categoria}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{processo.responsavel}</TableCell>
                    <TableCell>{getStatusBadge(processo.status)}</TableCell>
                    <TableCell>{getPriorityBadge(processo.prioridade)}</TableCell>
                    <TableCell>
                      {new Date(processo.dataAbertura).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedProcess(processo)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Detalhes do Processo</DialogTitle>
                              <DialogDescription>
                                {processo.numeroProcesso} - {processo.titulo}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedProcess && (
                              <ProcessDetails
                                processo={selectedProcess}
                                documentos={getProcessDocuments(selectedProcess.id)}
                                reunioes={getProcessMeetings(selectedProcess.id)}
                                envolvidos={getProcessInvolved(selectedProcess.id)}
                              />
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingProcess(processo);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        {processo.status !== 'arquivado' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleArchiveProcess(processo.id)}
                          >
                            <Archive className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Process Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProcess ? 'Editar Processo' : 'Novo Processo'}
            </DialogTitle>
            <DialogDescription>
              {editingProcess 
                ? 'Atualize as informações do processo' 
                : 'Preencha os dados para registrar um novo processo'
              }
            </DialogDescription>
          </DialogHeader>
          <ProcessForm
            processo={editingProcess}
            onSubmit={editingProcess ? handleEditProcess : handleCreateProcess}
            onCancel={() => {
              setShowForm(false);
              setEditingProcess(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}