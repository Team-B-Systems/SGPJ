import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { mockQueixas, type Queixa } from '../../lib/mock-data';
import { QueixaForm } from './queixa-form';

export function QueixasPage() {
  const [queixas, setQueixas] = useState<Queixa[]>(mockQueixas);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQueixa, setSelectedQueixa] = useState<Queixa | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingQueixa, setEditingQueixa] = useState<Queixa | null>(null);

  const filteredQueixas = queixas.filter(queixa =>
    queixa.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    queixa.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    queixa.requerente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateQueixa = (queixaData: Omit<Queixa, 'id'>) => {
    const newQueixa: Queixa = {
      ...queixaData,
      id: (queixas.length + 1).toString(),
    };
    setQueixas([...queixas, newQueixa]);
    setShowForm(false);
  };

  const handleEditQueixa = (queixaData: Omit<Queixa, 'id'>) => {
    if (editingQueixa) {
      const updatedQueixas = queixas.map(q =>
        q.id === editingQueixa.id ? { ...queixaData, id: editingQueixa.id } : q
      );
      setQueixas(updatedQueixas);
      setEditingQueixa(null);
      setShowForm(false);
    }
  };

  const handleStatusChange = (id: string, newStatus: 'aberta' | 'em_analise' | 'resolvida') => {
    const updatedQueixas = queixas.map(q =>
      q.id === id ? { ...q, status: newStatus } : q
    );
    setQueixas(updatedQueixas);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aberta':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'em_analise':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'resolvida':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const stats = {
    total: queixas.length,
    abertas: queixas.filter(q => q.status === 'aberta').length,
    emAnalise: queixas.filter(q => q.status === 'em_analise').length,
    resolvidas: queixas.filter(q => q.status === 'resolvida').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">queixas registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abertas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.abertas}</div>
            <p className="text-xs text-muted-foreground">aguardando análise</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.emAnalise}</div>
            <p className="text-xs text-muted-foreground">sendo analisadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolvidas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolvidas}</div>
            <p className="text-xs text-muted-foreground">concluídas</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Pesquisar Queixas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por título, descrição ou requerente..."
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

      {/* Complaints Table */}
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
                  <TableHead>Título</TableHead>
                  <TableHead>Requerente</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Data Abertura</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueixas.map((queixa) => (
                  <TableRow key={queixa.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(queixa.status)}
                        <div>
                          <p className="font-medium">{queixa.titulo}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {queixa.descricao}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{queixa.requerente}</TableCell>
                    <TableCell>{getStatusBadge(queixa.status)}</TableCell>
                    <TableCell>{getPriorityBadge(queixa.prioridade)}</TableCell>
                    <TableCell>
                      {new Date(queixa.dataAbertura).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedQueixa(queixa)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalhes da Queixa</DialogTitle>
                              <DialogDescription>
                                Informações completas sobre a queixa
                              </DialogDescription>
                            </DialogHeader>
                            {selectedQueixa && (
                              <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold text-lg">{selectedQueixa.titulo}</h3>
                                    <p className="text-muted-foreground">
                                      Requerente: {selectedQueixa.requerente}
                                    </p>
                                  </div>
                                  <div className="flex space-x-2">
                                    {getStatusBadge(selectedQueixa.status)}
                                    {getPriorityBadge(selectedQueixa.prioridade)}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-2">Descrição:</h4>
                                  <p className="text-sm">{selectedQueixa.descricao}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <h4 className="font-medium">Data de Abertura:</h4>
                                    <p>{new Date(selectedQueixa.dataAbertura).toLocaleDateString('pt-BR')}</p>
                                  </div>
                                </div>

                                <div className="flex justify-end space-x-2">
                                  {selectedQueixa.status !== 'resolvida' && (
                                    <>
                                      {selectedQueixa.status === 'aberta' && (
                                        <Button 
                                          size="sm"
                                          onClick={() => handleStatusChange(selectedQueixa.id, 'em_analise')}
                                        >
                                          Iniciar Análise
                                        </Button>
                                      )}
                                      {selectedQueixa.status === 'em_analise' && (
                                        <Button 
                                          size="sm"
                                          onClick={() => handleStatusChange(selectedQueixa.id, 'resolvida')}
                                        >
                                          Marcar como Resolvida
                                        </Button>
                                      )}
                                    </>
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
                            setEditingQueixa(queixa);
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

      {/* Complaint Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingQueixa ? 'Editar Queixa' : 'Nova Queixa'}
            </DialogTitle>
            <DialogDescription>
              {editingQueixa 
                ? 'Atualize as informações da queixa' 
                : 'Registre uma nova queixa no sistema'
              }
            </DialogDescription>
          </DialogHeader>
          <QueixaForm
            queixa={editingQueixa}
            onSubmit={editingQueixa ? handleEditQueixa : handleCreateQueixa}
            onCancel={() => {
              setShowForm(false);
              setEditingQueixa(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}