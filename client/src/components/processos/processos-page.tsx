import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Plus,
  Search,
  Edit,
  Eye,
  Archive,
} from "lucide-react";
import { ProcessForm } from "./process-form";
import { ProcessDetails } from "./process-details";
import { useProcessos } from "../../lib/processos-context";
import { Processo, registerProcess } from "../../lib/api";

export function ProcessosPage() {
  const { processos, loading, total, fetchProcessos } = useProcessos();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProcess, setSelectedProcess] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProcess, setEditingProcess] = useState<Processo | null>(null);

  // ✅ carregar processos ao montar
  useEffect(() => {
    fetchProcessos();
  }, [fetchProcessos]);

  const filteredProcessos = processos.filter(
    (processo) =>
      processo.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      processo.numeroProcesso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      processo.tipoProcesso.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Aberto":
        return <Badge className="bg-green-100 text-green-800">Aberto</Badge>;
      case "EmAndamento":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Em andamento</Badge>
        );
      case "Fechado":
        return <Badge className="bg-gray-100 text-gray-800">Fechado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Criar processo
  const handleCreateProcess = async (processData: Omit<Processo, "id">) => {
    try {
      await registerProcess({
        assunto: processData.assunto,
        tipo: processData.tipoProcesso,
      })
      await fetchProcessos(); // recarregar lista
    } catch (error) {
      console.error("Erro ao criar processo:", error);
    } finally {
      setShowForm(false);
    }
  };

  // Editar processo
  const handleEditProcess = async (processData: Omit<Processo, "id">) => {
    if (editingProcess) {
      try {
        console.log({ ...processData })
        setShowForm(false);
      } catch (error) {
        console.error("Erro ao atualizar processo:", error);
      }
    }
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
        <Button
          onClick={() => {
            setShowForm(true);
            setEditingProcess(null);
          }}
        >
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
                placeholder="Buscar por assunto ou número..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => fetchProcessos()} // 🔹 recarrega da API
            >
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
            {loading
              ? "Carregando..."
              : `${filteredProcessos.length} de ${total} processo(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
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
                    <TableCell>{processo.assunto}</TableCell>
                    <TableCell>{processo.tipoProcesso}</TableCell>
                    <TableCell>{getStatusBadge(processo.estado)}</TableCell>
                    <TableCell>
                      {new Date(processo.dataAbertura).toLocaleDateString(
                        "pt-BR"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* Detalhes */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedProcess(processo.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[90vw] max-w-none max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Detalhes do Processo</DialogTitle>
                              <DialogDescription>
                                {processo.numeroProcesso} - {processo.assunto}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedProcess === processo.id && (
                              <ProcessDetails
                                processo={processo}
                                documentos={processo.documentos}
                                reunioes={processo.reunioes}
                                envolvidos={processo.envolvidos}
                              />
                            )}
                          </DialogContent>
                        </Dialog>

                        {/* Editar */}
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

                        {/* Arquivar */}
                        {processo.estado !== "Encerrado" && (
                          <Button variant="ghost" size="sm">
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
              {editingProcess ? "Editar Processo" : "Novo Processo"}
            </DialogTitle>
            <DialogDescription>
              {editingProcess
                ? "Atualize as informações do processo"
                : "Preencha os dados para registrar um novo processo"}
            </DialogDescription>
          </DialogHeader>

          <ProcessForm
          processo={editingProcess}
          onSubmit={(data) => {
            if (editingProcess) {
              handleEditProcess(data);
            } else {
              handleCreateProcess(data);
            }
          }}
          onCancel={() => {
            setEditingProcess(null);
            setShowForm(false);
          }}
        />
        </DialogContent>
      </Dialog>
    </div>
  );
}
