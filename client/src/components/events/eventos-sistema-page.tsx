import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  Search, 
  Eye, 
  Calendar,
  User,
  Activity,
  Database,
  Filter,
  Download,
  RefreshCw,
  Clock,
  MapPin,
  FileText,
  Settings,
  LogIn,
  LogOut,
  Upload,
  Edit,
  Trash,
  Plus,
  Users,
  Building
} from 'lucide-react';
import { EventoSistema, getAllEventosSistema } from '../../lib/api';
import { useFuncionarios } from '../../lib/funcionarios-context';

export function EventosSistemaPage() {
    const { funcionarios } = useFuncionarios();
  const [eventos, setEventos] = useState<EventoSistema[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntidade, setSelectedEntidade] = useState<string>('all');
  const [selectedTipo, setSelectedTipo] = useState<string>('all');
  const [selectedUsuario, setSelectedUsuario] = useState<string>('all');
  const [selectedEvento, setSelectedEvento] = useState<EventoSistema | null>(null);
  const [dateFilter, setDateFilter] = useState<{ from?: Date; to?: Date }>({});
  const [isLoading, setIsLoading] = useState(false);

  const filteredEventos = eventos.filter(evento => {
    const matchesSearch = evento.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evento.entidade.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEntidade = selectedEntidade === 'all' || !selectedEntidade || evento.entidade === selectedEntidade;
    const matchesTipo = selectedTipo === 'all' || !selectedTipo || evento.tipoEvento === selectedTipo;
    const matchesUsuario = selectedUsuario === 'all' || !selectedUsuario;
    
    let matchesDate = true;
    if (dateFilter.from || dateFilter.to) {
      const eventoDate = new Date(evento.createdAt);
      if (dateFilter.from && eventoDate < dateFilter.from) matchesDate = false;
      if (dateFilter.to && eventoDate > dateFilter.to) matchesDate = false;
    }
    
    return matchesSearch && matchesEntidade && matchesTipo && matchesUsuario && matchesDate;
  });

  useEffect(() => {
    async function fetchEventos() {
      setIsLoading(true);
      try {
        const response = await getAllEventosSistema(1, 1000);
        setEventos(response);
      } catch (error) {
        console.error("Erro ao buscar eventos do sistema:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEventos();
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
        const response = await getAllEventosSistema(1, 1000);
        setEventos(response);
    } catch (error) {
        console.error("Erro ao atualizar eventos do sistema:", error);
    } finally {
    setIsLoading(false);
    }
  };

  const handleExportEvents = () => {
    const csvContent = [
      ['Data/Hora', 'Entidade', 'Tipo', 'Descrição'],
      ...filteredEventos.map(evento => [
        new Date(evento.createdAt).toLocaleString('pt-BR'),
        evento.entidade,
        evento.tipoEvento,
        evento.descricao,
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eventos-sistema-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTipoEventoIcon = (tipo: string) => {
    const iconProps = "w-4 h-4";
    switch (tipo) {
      case 'CREATE': return <Plus className={iconProps} />;
      case 'UPDATE': return <Edit className={iconProps} />;
      case 'DELETE': return <Trash className={iconProps} />;
      case 'LOGIN': return <LogIn className={iconProps} />;
      case 'LOGOUT': return <LogOut className={iconProps} />;
      case 'OTHER': return <Database className={iconProps} />;
      default: return <Activity className={iconProps} />;
    }
  };

  const getTipoEventoBadge = (tipo: string) => {
    const baseClasses = "text-xs";
    switch (tipo) {
      case 'LOGIN':
      case 'LOGOUT':
        return <Badge className={`${baseClasses} bg-blue-100 text-blue-800`}>{tipo}</Badge>;
      case 'CREATE':
        return <Badge className={`${baseClasses} bg-green-100 text-green-800`}>{tipo}</Badge>;
      case 'DELETE':
        return <Badge className={`${baseClasses} bg-red-100 text-red-800`}>{tipo}</Badge>;
      case 'UPDATE':
        return <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800`}>{tipo}</Badge>;
      case 'OTHER':
        return <Badge className={`${baseClasses} bg-purple-100 text-purple-800`}>{tipo}</Badge>;
      default:
        return <Badge variant="outline" className={baseClasses}>{tipo}</Badge>;
    }
  };

  const getEntidadeIcon = (entidade: string) => {
    const iconProps = "w-4 h-4";
    switch (entidade) {
      case 'ProcessoJuridico': return <FileText className={iconProps} />;
      case 'Documento': return <FileText className={iconProps} />;
      case 'Funcionario': return <User className={iconProps} />;
      case 'Queixa': return <FileText className={iconProps} />;
      case 'Comissao': return <Building className={iconProps} />;
      case 'Reuniao': return <Calendar className={iconProps} />;
      case 'Envolvido': return <Users className={iconProps} />;
      default: return <Database className={iconProps} />;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const uniqueEntidades = Array.from(new Set(eventos.map(e => e.entidade)));
  const uniqueTipos = Array.from(new Set(eventos.map(e => e.tipoEvento)));
  const uniqueUsuarios = Array.from(new Set(eventos.map(e => {
    const func = funcionarios.find(f => f.id?.toString() === e.funcionarioId?.toString());

    return func ? func.nome : 'Sistema';
  }).filter(Boolean)));

  const stats = {
    total: eventos.length,
    hoje: eventos.filter(e => {
      const today = new Date();
      const eventoDate = new Date(e.createdAt);
      return eventoDate.toDateString() === today.toDateString();
    }).length,
    estaSemana: eventos.filter(e => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(e.createdAt) >= weekAgo;
    }).length,
    logins: eventos.filter(e => e.tipoEvento === 'LOGIN').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1>Eventos do Sistema</h1>
          <p className="text-muted-foreground">
            Monitor e auditoria de todas as atividades do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button variant="outline" onClick={handleExportEvents}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total de Eventos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">registros no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Hoje</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.hoje}</div>
            <p className="text-xs text-muted-foreground">eventos hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Esta Semana</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.estaSemana}</div>
            <p className="text-xs text-muted-foreground">últimos 7 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Logins</CardTitle>
            <LogIn className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.logins}</div>
            <p className="text-xs text-muted-foreground">acessos registrados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros e Pesquisa</CardTitle>
          <CardDescription>
            Filtre os eventos por diferentes critérios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Input
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <Select value={selectedEntidade} onValueChange={setSelectedEntidade}>
              <SelectTrigger>
                <SelectValue placeholder="Entidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {uniqueEntidades.map((entidade) => (
                  <SelectItem key={entidade} value={entidade}>
                    <div className="flex items-center gap-2">
                      {getEntidadeIcon(entidade)}
                      {entidade}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTipo} onValueChange={setSelectedTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {uniqueTipos.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    <div className="flex items-center gap-2">
                      {getTipoEventoIcon(tipo)}
                      {tipo}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedUsuario} onValueChange={setSelectedUsuario}>
              <SelectTrigger>
                <SelectValue placeholder="Usuário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {uniqueUsuarios.map((usuario) => (
                  <SelectItem key={usuario} value={usuario}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-4 w-4">
                        <AvatarFallback className="text-xs">
                          {getInitials(usuario)}
                        </AvatarFallback>
                      </Avatar>
                      {usuario}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedEntidade('all');
                setSelectedTipo('all');
                setSelectedUsuario('all');
                setDateFilter({});
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Log de Eventos</CardTitle>
          <CardDescription>
            {filteredEventos.length} evento(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEventos.map((evento) => (
                  <TableRow key={evento.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm">
                            {new Date(evento.createdAt).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(evento.createdAt).toLocaleTimeString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(funcionarios.find(f => f.id?.toString() === evento.funcionarioId?.toString())?.nome || 'Sistema')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {funcionarios.find(f => f.id?.toString() === evento.funcionarioId?.toString())?.nome || 'Sistema Automático'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getEntidadeIcon(evento.entidade)}
                        <span className="text-sm">{evento.entidade}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTipoEventoBadge(evento.tipoEvento)}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm truncate">{evento.descricao}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedEvento(evento)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detalhes do Evento</DialogTitle>
                            <DialogDescription>
                              Informações completas sobre o evento do sistema
                            </DialogDescription>
                          </DialogHeader>
                          {selectedEvento && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-1">Data e Hora</h4>
                                  <p className="text-sm">
                                    {new Date(selectedEvento.createdAt).toLocaleString('pt-BR')}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-1">Usuário</h4>
                                  <p className="text-sm">{funcionarios.find(f => f.id?.toString() === selectedEvento.funcionarioId?.toString())?.nome || 'Sistema Automático'}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-1">Entidade</h4>
                                  <div className="flex items-center gap-2">
                                    {getEntidadeIcon(selectedEvento.entidade)}
                                    <span className="text-sm">{selectedEvento.entidade}</span>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-1">Tipo de Evento</h4>
                                  <div className="flex items-center gap-2">
                                    {getTipoEventoIcon(selectedEvento.tipoEvento)}
                                    {getTipoEventoBadge(selectedEvento.tipoEvento)}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-1">Descrição</h4>
                                <p className="text-sm">{selectedEvento.descricao}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-1">ID da Entidade</h4>
                                  <p className="text-sm font-mono">
                                    {selectedEvento.entidadeId || 'N/A'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}