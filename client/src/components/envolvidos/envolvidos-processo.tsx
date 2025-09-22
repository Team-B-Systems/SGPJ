import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Plus, Edit, Trash2, Mail, Phone, Eye } from 'lucide-react';
import { EnvolvidoForm } from './envolvido-form';
import { useAuth } from '../../lib/auth-context';
import { addParteEnvolvida, AdicionarParteDTO, Envolvido, Processo, removeParteEnvolvida } from '../../lib/api';
import { useProcessos } from '../../lib/processos-context';

interface EnvolvidosProcessoProps {
  processo: Processo;
  envolvidos: Envolvido[];
  onUpdateEnvolvidos: (envolvidos: Envolvido[]) => void;
}

export function EnvolvidosProcesso({ processo, envolvidos, onUpdateEnvolvidos }: EnvolvidosProcessoProps) {
  const { user } = useAuth();
  const [selectedEnvolvido, setSelectedEnvolvido] = useState<Envolvido | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { fetchProcessos } = useProcessos();

  const canEdit = (user?.role === 'Funcionário' && user?.email == processo.responsavel.email) || user?.role === 'Admin';

  const handleSubmitEnvolvido = async (envolvidoData: Omit<Envolvido, "id">) => {
    try {
      if (selectedEnvolvido) {
        // Por enquanto o backend só tem "add", então atualização pode ser feita localmente
        const updatedEnvolvidos = envolvidos.map((env) =>
          env.id === selectedEnvolvido.id
            ? { ...envolvidoData, id: selectedEnvolvido.id }
            : env
        );
        onUpdateEnvolvidos(updatedEnvolvidos);
      } else {
        // Cria DTO para API
        const dto: AdicionarParteDTO = {
          processoId: processo.id,
          nome: envolvidoData.envolvido.nome,
          numeroIdentificacao: envolvidoData.envolvido.numeroIdentificacao,
          papel: envolvidoData.envolvido.papelNoProcesso,
        };

        await addParteEnvolvida(dto);

        // Atualiza lista local com resposta real do backend
        await fetchProcessos();
      }
    } catch (err: any) {
      console.error(err.response?.data?.error || "Erro ao salvar envolvido");
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


  const handleDeleteEnvolvido = async (id: number) => {
    try {
      await removeParteEnvolvida(processo.id, id);
      // Atualiza lista local com resposta real do backend
      await fetchProcessos();
    } catch (err: any) {
      console.error(err.response?.data?.error || "Erro ao remover envolvido");
    } finally {
      setSelectedEnvolvido(null);
      setIsFormOpen(false);
    }
  };

  const getTipoBadge = (tipo: string) => {
    return (
      <Badge variant='default'>
        {tipo}
      </Badge>
    );
  };

  const getParteBadge = (parte: string) => {
    return (
      <Badge variant={parte === 'ativa' ? 'default' : 'outline'}>
        {parte === 'ativa' ? 'Parte Ativa' : 'Parte Passiva'}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Partes Envolvidas</CardTitle>
            <CardDescription>
              Pessoas e entidades envolvidas neste processo ({envolvidos.length})
            </CardDescription>
          </div>
          {canEdit && (
            <Button
              onClick={() => setIsFormOpen(true)}
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar Envolvido
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {envolvidos.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead>Nº Identificação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {envolvidos.map((envolvido) => (
                <TableRow key={envolvido.id}>
                  <TableCell>
                    <p className="font-medium">{envolvido.envolvido.nome}</p>
                  </TableCell>
                  <TableCell>{getTipoBadge(envolvido.papelNoProcesso)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                      {envolvido.envolvido.numeroIdentificacao}
                    </div>
                  </TableCell>
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
                                  Tem certeza que deseja remover {envolvido.envolvido.nome} da lista de envolvidos?
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteEnvolvido(envolvido.id)}//handleDeleteEnvolvido(envolvido.id)}
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
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Nenhuma parte envolvida cadastrada para este processo
            </p>
            {canEdit && (
              <Button onClick={() => setIsFormOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Primeiro Envolvido
              </Button>
            )}
          </div>
        )}

        {/* Form Dialog */}
        <EnvolvidoForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedEnvolvido(null);
          }}
          onSubmit={handleSubmitEnvolvido}
          envolvido={selectedEnvolvido || undefined}
          processoId={processo.id}
        />
      </CardContent>
    </Card>
  );
}