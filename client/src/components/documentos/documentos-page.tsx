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
  Download, 
  FileText, 
  Upload,
  Filter
} from 'lucide-react';
import { mockDocumentos, mockProcessos, type Documento } from '../../lib/mock-data';
import { DocumentoForm } from './documento-form';

export function DocumentosPage() {
  const [documentos, setDocumentos] = useState<Documento[]>(mockDocumentos);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Documento | null>(null);

  const filteredDocumentos = documentos.filter(doc => {
    const matchesSearch = doc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tipoDocumento.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = !selectedTipo || doc.tipoDocumento === selectedTipo;
    
    return matchesSearch && matchesTipo;
  });

  const handleCreateDocumento = (docData: Omit<Documento, 'id'>) => {
    const newDoc: Documento = {
      ...docData,
      id: (documentos.length + 1).toString(),
    };
    setDocumentos([...documentos, newDoc]);
    setShowForm(false);
  };

  const handleDownload = (documento: Documento) => {
    // Simulate file download
    const link = document.createElement('a');
    link.href = '#'; // In a real app, this would be the actual file URL
    link.download = documento.nomeArquivo;
    link.click();
    
    // Show a toast or notification that download started
    alert(`Download iniciado: ${documento.nomeArquivo}`);
  };

  const getProcessoTitulo = (processoId: string) => {
    const processo = mockProcessos.find(p => p.id === processoId);
    return processo ? processo.titulo : 'Processo não encontrado';
  };

  const getProcessoNumero = (processoId: string) => {
    const processo = mockProcessos.find(p => p.id === processoId);
    return processo ? processo.numeroProcesso : '';
  };

  const tiposDocumento = Array.from(new Set(documentos.map(doc => doc.tipoDocumento)));

  const stats = {
    total: documentos.length,
    peticoes: documentos.filter(d => d.tipoDocumento === 'Petição').length,
    contratos: documentos.filter(d => d.tipoDocumento === 'Contrato').length,
    minutas: documentos.filter(d => d.tipoDocumento === 'Minuta').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Gestão de Documentos</h1>
          <p className="text-muted-foreground">
            Gerencie documentos anexados aos processos jurídicos
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Anexar Documento
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">documentos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Petições</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.peticoes}</div>
            <p className="text-xs text-muted-foreground">petições</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.contratos}</div>
            <p className="text-xs text-muted-foreground">contratos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Minutas</CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.minutas}</div>
            <p className="text-xs text-muted-foreground">minutas</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Pesquisar Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por título, descrição, tipo ou autor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <select
                className="w-full h-10 px-3 py-2 text-sm bg-background border border-input rounded-md"
                value={selectedTipo}
                onChange={(e) => setSelectedTipo(e.target.value)}
              >
                <option value="">Todos os tipos</option>
                {tiposDocumento.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Documentos</CardTitle>
          <CardDescription>
            {filteredDocumentos.length} documento(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Documento</TableHead>
                  <TableHead>Processo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>Data Upload</TableHead>
                  <TableHead>Por</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocumentos.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium">{doc.titulo}</p>
                          <p className="text-sm text-muted-foreground">{doc.descricao}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {doc.nomeArquivo}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{getProcessoTitulo(doc.processoId)}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {getProcessoNumero(doc.processoId)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{doc.tipoDocumento}</Badge>
                    </TableCell>
                    <TableCell>{doc.tamanho}</TableCell>
                    <TableCell>
                      {new Date(doc.dataUpload).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>{doc.uploadedBy}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedDoc(doc)}
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalhes do Documento</DialogTitle>
                              <DialogDescription>
                                Informações completas sobre o documento
                              </DialogDescription>
                            </DialogHeader>
                            {selectedDoc && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium">Título</h4>
                                    <p className="text-sm text-muted-foreground">{selectedDoc.titulo}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Tipo</h4>
                                    <Badge variant="outline">{selectedDoc.tipoDocumento}</Badge>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Nome do Arquivo</h4>
                                    <p className="text-sm text-muted-foreground font-mono">{selectedDoc.nomeArquivo}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Tamanho</h4>
                                    <p className="text-sm text-muted-foreground">{selectedDoc.tamanho}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Data de Upload</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(selectedDoc.dataUpload).toLocaleDateString('pt-BR')}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Enviado por</h4>
                                    <p className="text-sm text-muted-foreground">{selectedDoc.uploadedBy}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-2">Descrição</h4>
                                  <p className="text-sm text-muted-foreground">{selectedDoc.descricao}</p>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Processo Relacionado</h4>
                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="font-medium">{getProcessoTitulo(selectedDoc.processoId)}</p>
                                    <p className="text-sm text-muted-foreground font-mono">
                                      {getProcessoNumero(selectedDoc.processoId)}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex justify-end">
                                  <Button onClick={() => handleDownload(selectedDoc)}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Baixar Documento
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(doc)}
                        >
                          <Download className="w-4 h-4" />
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

      {/* Document Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Anexar Documento</DialogTitle>
            <DialogDescription>
              Anexe um novo documento a um processo jurídico
            </DialogDescription>
          </DialogHeader>
          <DocumentoForm
            onSubmit={handleCreateDocumento}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}