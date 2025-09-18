import React, { forwardRef } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  Download,
  FileText,
  Calendar,
  MapPin,
  Users,
  Mail,
  Phone
} from 'lucide-react';
import { EnvolvidosProcesso } from '../envolvidos/envolvidos-processo';
import { Documento, Envolvido, Processo, Reuniao } from '../../lib/api';

interface ProcessDetailsProps {
  processo: Processo;
  documentos: Documento[];
  reunioes: Reuniao[];
  envolvidos: Envolvido[];
  onUpdateEnvolvidos?: (envolvidos: Envolvido[]) => void;
}

export const ProcessDetails = forwardRef<HTMLDivElement, ProcessDetailsProps>(({ processo, documentos, reunioes, envolvidos, onUpdateEnvolvidos }, ref) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aberto':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'EmAndamento':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'Arquivado':
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

  const getMeetingStatusBadge = (status: string) => {
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



  return (
    <div className="space-y-6">
      {/* Process Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{processo.assunto}</CardTitle>
              <CardDescription className="mt-2">
                <span className="font-mono text-sm">{processo.numeroProcesso}</span>
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              {getStatusBadge(processo.estado)}
              {getPriorityBadge(['alta', 'media', 'baixa'].sort(() => 0.5 - Math.random())[0])}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Descrição</h4>
                <p className="text-sm text-muted-foreground">Sem descrição</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Categoria</h4>
                <p className="text-sm">{processo.tipoProcesso}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Responsável</h4>
                <p className="text-sm">{processo.responsavel.nome} | {processo.numeroProcesso}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Data Abertura</h4>
                  <p className="text-sm">{new Date(processo.dataAbertura).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Última Atualização</h4>
                  <p className="text-sm">{new Date(processo.updatedAt).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Documents, Meetings, and Involved Parties */}
      <Tabs defaultValue="documentos" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documentos">
            <FileText className="w-4 h-4 mr-2" />
            Documentos ({documentos.length})
          </TabsTrigger>
          <TabsTrigger value="reunioes">
            <Calendar className="w-4 h-4 mr-2" />
            Reuniões ({reunioes.length})
          </TabsTrigger>
          <TabsTrigger value="envolvidos">
            <Users className="w-4 h-4 mr-2" />
            Envolvidos ({envolvidos.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documentos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentos Anexados</CardTitle>
              <CardDescription>
                Documentos relacionados a este processo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {documentos.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Documento</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Tamanho</TableHead>
                      <TableHead>Data Upload</TableHead>
                      <TableHead>Por</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentos.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{doc.titulo}</p>
                            <p className="text-sm text-muted-foreground">{doc.descricao}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.tipoDocumento}</Badge>
                        </TableCell>
                        <TableCell>{doc.tamanho}</TableCell>
                        <TableCell>
                          {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>{processo.responsavel.nome}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum documento anexado a este processo
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reunioes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reuniões</CardTitle>
              <CardDescription>
                Reuniões relacionadas a este processo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reunioes.length > 0 ? (
                <div className="space-y-4">
                  {reunioes.map((reuniao) => (
                    <Card key={reuniao.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">Reunião do processo: {processo.numeroProcesso}</h4>
                          {getMeetingStatusBadge(reuniao.estado)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                              {new Date(reuniao.dataHora).toLocaleDateString('pt-BR')}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                              {reuniao.local}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                              {reuniao.comissao.funcionarios?.map(f => f.funcionario.nome).join(', ')}
                            </div>
                            {reuniao.documento && (
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                                Ata anexada
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-4">
                          <h5 className="font-medium mb-2">Pauta:</h5>
                          <p className="text-sm text-muted-foreground">{processo.assunto}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma reunião agendada para este processo
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="envolvidos" className="space-y-4">
          <EnvolvidosProcesso
            processo={processo}
            envolvidos={envolvidos}
            onUpdateEnvolvidos={onUpdateEnvolvidos || (() => { })}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
})