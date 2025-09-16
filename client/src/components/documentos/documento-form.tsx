import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAuth } from '../../lib/auth-context';
import { mockProcessos, type Documento } from '../../lib/mock-data';
import { Upload, File, X } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface DocumentoFormProps {
  onSubmit: (data: Omit<Documento, 'id'>) => void;
  onCancel: () => void;
}

export function DocumentoForm({ onSubmit, onCancel }: DocumentoFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    tipoDocumento: '',
    processoId: '',
    nomeArquivo: '',
    tamanho: '',
    dataUpload: new Date().toISOString().split('T')[0],
    uploadedBy: user?.nome || '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');

    if (file) {
      // Check if file is PDF
      if (file.type !== 'application/pdf') {
        setError('Apenas arquivos PDF são permitidos');
        setSelectedFile(null);
        return;
      }

      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Arquivo muito grande. Limite máximo: 10MB');
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setFormData({
        ...formData,
        nomeArquivo: file.name,
        tamanho: formatFileSize(file.size),
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Por favor, selecione um arquivo PDF');
      return;
    }

    onSubmit(formData);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFormData({
      ...formData,
      nomeArquivo: '',
      tamanho: '',
    });
    setError('');
  };

  const tiposDocumento = [
    'Petição',
    'Contrato',
    'Minuta',
    'Ata',
    'Parecer',
    'Sentença',
    'Decisão',
    'Documento Administrativo',
    'Procuração',
    'Certidão',
    'Outro'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="titulo">Título do Documento *</Label>
        <Input
          id="titulo"
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          placeholder="Digite o título do documento"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          placeholder="Descreva o conteúdo ou propósito do documento"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="processoId">Processo Relacionado *</Label>
          <Select 
            value={formData.processoId} 
            onValueChange={(value) => setFormData({ ...formData, processoId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o processo" />
            </SelectTrigger>
            <SelectContent>
              {mockProcessos.map((processo) => (
                <SelectItem key={processo.id} value={processo.id}>
                  {processo.numeroProcesso} - {processo.titulo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipoDocumento">Tipo de Documento *</Label>
          <Select 
            value={formData.tipoDocumento} 
            onValueChange={(value) => setFormData({ ...formData, tipoDocumento: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {tiposDocumento.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label>Arquivo PDF *</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          {!selectedFile ? (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-sm font-medium text-primary hover:text-primary/80">
                    Clique para selecionar um arquivo
                  </span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept=".pdf"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Apenas arquivos PDF até 10MB
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <File className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{formData.tamanho}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Requisitos para Upload:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Formato: Apenas arquivos PDF</li>
          <li>Tamanho máximo: 10MB</li>
          <li>Nomeação: Use nomes descritivos e profissionais</li>
          <li>Qualidade: Certifique-se de que o documento está legível</li>
        </ul>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Anexar Documento
        </Button>
      </div>
    </form>
  );
}