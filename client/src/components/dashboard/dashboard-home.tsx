import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useAuth } from '../../lib/auth-context';
import { useProcessos } from '../../lib/processos-context';
import {
  FileText,
  Calendar,
  AlertTriangle,
  Users,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useQueixa } from '../../lib/queixa-context';
import { useNavigate } from 'react-router-dom'

export function DashboardHome() {
  const { user } = useAuth();
  const { processos, fetchProcessos } = useProcessos();
  const { queixas } = useQueixa();
  const navigate = useNavigate()

  const stats = {
    processosAtivos: processos.filter(p => p.estado === 'EmAndamento').length,
    processosPendentes: processos.filter(p => p.estado === 'Aberto').length,
    queixasAbertas: queixas.filter(q => q.estado === 'Pendente' || q.estado === 'EmAnalise').length,
    reunioesHoje: 0,
    documentosRecentes: processos.flatMap(p => p.documentos).length,
    totalProcessos: processos.length
  };

  useEffect(() => {
    fetchProcessos();
  }, [fetchProcessos]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const processosRecentes = processos
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  /*
    const reunioesProximas = mockReunioes
    .filter(r => r.status === 'agendada')
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .slice(0, 3);*/

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-2">
          {getGreeting()}, {user?.nome}!
        </h1>
        <p className="text-blue-100">
          Bem-vindo ao Sistema de Gestão de Processos Jurídicos
        </p>
      </div>

      {/* Stats Cards */}
      {user?.role !== 'Admin' && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.processosAtivos}</div>
            <p className="text-xs text-muted-foreground">
              {stats.processosPendentes} pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queixas Abertas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.queixasAbertas}</div>
            <p className="text-xs text-muted-foreground">
              Requerem atenção
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reuniões Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.reunioesHoje}</div>
            <p className="text-xs text-muted-foreground">
              Agendadas para hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Processos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalProcessos}</div>
            <p className="text-xs text-muted-foreground">
              No sistema
            </p>
          </CardContent>
        </Card>
      </div>)}

      {/* Recent Activity */}
      {user?.role !== 'Admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Processes */}
          <Card>
            <CardHeader>
              <CardTitle>Processos Recentes</CardTitle>
              <CardDescription>Últimas atualizações em processos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processosRecentes.map((processo) => (
                  <div key={processo.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{processo.assunto}</p>
                      <p className="text-xs text-muted-foreground">
                        {processo.numeroProcesso} • {processo.responsavel.nome}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          processo.estado === 'EmAndamento' ? 'default' :
                            processo.estado === 'Aberto' ? 'secondary' :
                              'outline'
                        }
                      >
                        {processo.estado}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Meetings */}
          {/*
        <Card>
          <CardHeader>
            <CardTitle>Próximas Reuniões</CardTitle>
            <CardDescription>Reuniões agendadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reunioesProximas.length > 0 ? (
                reunioesProximas.map((reuniao) => (
                  <div key={reuniao.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{reuniao.titulo}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(reuniao.data).toLocaleDateString('pt-BR')} às {reuniao.hora}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        📍 {reuniao.local}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhuma reunião agendada
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        */}
        </div>
      )}

      {/* Quick Actions - Only for Admin */}
      {user?.role === 'Admin' && (
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Tarefas administrativas frequentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-medium">Cadastrar Funcionário</h3>
                <p className="text-sm text-muted-foreground">Adicionar novo membro à equipe</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {user?.role !== 'Admin' && (
        <>
          <div
            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => navigate('/processos')}
          >
            <FileText className="h-8 w-8 text-green-600 mb-2" />
            <h3 className="font-medium">Novo Processo</h3>
            <p className="text-sm text-muted-foreground">Registrar novo processo jurídico</p>
          </div>
          <div
            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => navigate('/queixas')}
          >
            <AlertTriangle className="h-8 w-8 text-orange-600 mb-2" />
            <h3 className="font-medium">Revisar Queixas</h3>
            <p className="text-sm text-muted-foreground">Analisar queixas pendentes</p>
          </div>
        </>
      )}

    </div>
  );
}