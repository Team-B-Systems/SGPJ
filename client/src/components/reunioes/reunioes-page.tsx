import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  Download,
  Upload
} from 'lucide-react';
import { mockReunioes, mockProcessos, type Reuniao } from '../../lib/mock-data';
import { ReuniaoForm } from './reuniao-form';

export function ReunioesPage() {
  const [reunioes, setReunioes] = useState<Reuniao[]>(mockReunioes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcesso, setSelectedProcesso] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedReuniao, setSelectedReuniao] = useState<Reuniao | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingReuniao, setEditingReuniao] = useState<Reuniao | null>(null);

  const filteredReunioes = reunioes.filter(reuniao => {
    const matchesSearch = reuniao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reuniao.local.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reuniao.pauta.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProcesso = selectedProcesso === 'all' || !selectedProcesso || reuniao.processoId === selectedProcesso;
    const matchesStatus = selectedStatus === 'all' || !selectedStatus || reuniao.status === selectedStatus;
    
    return matchesSearch && matchesProcesso && matchesStatus;
  });

  const handleCreateReuniao = (reuniaoData: Omit<Reuniao, 'id'>) => {
    const newReuniao: Reuniao = {
      ...reuniaoData,
      id: (reunioes.length + 1).toString(),
    };
    setReunioes([...reunioes, newReuniao]);
    setShowForm(false);
  };

  const handleEditReuniao = (reuniaoData: Omit<Reuniao, 'id'>) => {
    if (editingReuniao) {
      const updatedReunioes = reunioes.map(r =>
        r.id === editingReuniao.id ? { ...reuniaoData, id: editingReuniao.id } : r
      );
      setReunioes(updatedReunioes);
      setEditingReuniao(null);
      setShowForm(false);
    }
  };

  const handleStatusChange = (id: string, newStatus: 'agendada' | 'realizada' | 'cancelada') => {
    const updatedReunioes = reunioes.map(r =>
      r.id === id ? { ...r, status: newStatus } : r
    );
    setReunioes(updatedReunioes);
  };

  const handleAttachAta = (id: string) => {
    const updatedReunioes = reunioes.map(r =>
      r.id === id ? { ...r, ataAnexada: true } : r
    );
    setReunioes(updatedReunioes);
    alert('Ata anexada com sucesso!');
  };

  const handleDownloadAta = (reuniao: Reuniao) => {
    // Simulate ata download
    alert(`Download da ata: ${reuniao.titulo}.pdf`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'agendada':
        return <Badge className="bg-blue-100 text-blue-800">Agendada</Badge>;
      case 'realizada':
        return <Badge className="bg-green-100 text-green-800">Realizada</Badge>;
      case 'cancelada':
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProcessoTitulo = (processoId: string) => {
    const processo = mockProcessos.find(p => p.id === processoId);
    return processo ? processo.titulo : 'Processo não encontrado';
  };

  const getProcessoNumero = (processoId: string) => {
    const processo = mockProcessos.find(p => p.id === processoId);
    return processo ? processo.numeroProcesso : '';
  };

  const stats = {
    total: reunioes.length,
    agendadas: reunioes.filter(r => r.status === 'agendada').length,
    realizadas: reunioes.filter(r => r.status === 'realizada').length,
    comAta: reunioes.filter(r => r.ataAnexada).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Gestão de Reuniões</h1>
          <p className="text-muted-foreground">
            Gerencie reuniões relacionadas aos processos jurídicos
          </p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingReuniao(null); }}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Reunião
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">reuniões</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendadas</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.agendadas}</div>
            <p className="text-xs text-muted-foreground">próximas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Realizadas</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.realizadas}</div>
            <p className="text-xs text-muted-foreground">concluídas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Ata</CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.comAta}</div>
            <p className="text-xs text-muted-foreground">documentadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Pesquisar Reuniões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por título, local ou pauta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedProcesso} onValueChange={setSelectedProcesso}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os processos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {mockProcessos.map((processo) => (
                    <SelectItem key={processo.id} value={processo.id}>
                      {processo.numeroProcesso}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-40">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="agendada">Agendada</SelectItem>
                  <SelectItem value="realizada">Realizada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
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

      {/* Meetings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Reuniões</CardTitle>
          <CardDescription>
            {filteredReunioes.length} reunião(ões) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reunião</TableHead>
                  <TableHead>Processo</TableHead>
                  <TableHead>Data & Hora</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ata</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReunioes.map((reuniao) => (
                  <TableRow key={reuniao.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{reuniao.titulo}</p>
                        <p className="text-sm text-muted-foreground">
                          <Users className="w-3 h-3 inline mr-1" />
                          {reuniao.participantes.length} participantes
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{getProcessoTitulo(reuniao.processoId)}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {getProcessoNumero(reuniao.processoId)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">
                          {new Date(reuniao.data).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-xs text-muted-foreground">{reuniao.hora}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
                        <span className="text-sm">{reuniao.local}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(reuniao.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {reuniao.ataAnexada ? (
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-green-600">
                              <FileText className="w-3 h-3 mr-1" />
                              Anexada
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadAta(reuniao)}
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-gray-500">
                              Sem ata
                            </Badge>
                            {reuniao.status === 'realizada' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAttachAta(reuniao.id)}
                              >
                                <Upload className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedReuniao(reuniao)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalhes da Reunião</DialogTitle>
                              <DialogDescription>
                                Informações completas sobre a reunião
                              </DialogDescription>
                            </DialogHeader>
                            {selectedReuniao && (
                              <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold text-lg">{selectedReuniao.titulo}</h3>
                                    <p className="text-muted-foreground">
                                      {getProcessoTitulo(selectedReuniao.processoId)}
                                    </p>
                                  </div>
                                  {getStatusBadge(selectedReuniao.status)}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-1">Data e Hora</h4>
                                    <p className="text-sm">
                                      {new Date(selectedReuniao.data).toLocaleDateString('pt-BR')} às {selectedReuniao.hora}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-1">Local</h4>
                                    <p className="text-sm">{selectedReuniao.local}</p>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Pauta</h4>
                                  <p className="text-sm text-muted-foreground">{selectedReuniao.pauta}</p>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Participantes</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedReuniao.participantes.map((participante, index) => (
                                      <Badge key={index} variant="outline">
                                        {participante}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex justify-end space-x-2">
                                  {selectedReuniao.status === 'agendada' && (
                                    <>
                                      <Button 
                                        size="sm"
                                        onClick={() => handleStatusChange(selectedReuniao.id, 'realizada')}
                                      >
                                        Marcar como Realizada
                                      </Button>
                                      <Button 
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleStatusChange(selectedReuniao.id, 'cancelada')}
                                      >
                                        Cancelar
                                      </Button>
                                    </>
                                  )}
                                  {selectedReuniao.ataAnexada && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDownloadAta(selectedReuniao)}
                                    >
                                      <Download className="w-4 h-4 mr-2" />
                                      Baixar Ata
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
                            setEditingReuniao(reuniao);
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

      {/* Meeting Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingReuniao ? 'Editar Reunião' : 'Nova Reunião'}
            </DialogTitle>
            <DialogDescription>
              {editingReuniao 
                ? 'Atualize as informações da reunião' 
                : 'Registre uma nova reunião vinculada a um processo'
              }
            </DialogDescription>
          </DialogHeader>
          <ReuniaoForm
            reuniao={editingReuniao}
            onSubmit={editingReuniao ? handleEditReuniao : handleCreateReuniao}
            onCancel={() => {
              setShowForm(false);
              setEditingReuniao(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}