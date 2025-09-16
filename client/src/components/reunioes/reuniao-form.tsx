import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { useAuth } from '../../lib/auth-context';
import { mockProcessos, mockFuncionarios, type Reuniao } from '../../lib/mock-data';
import { X, Plus, Upload, File } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface ReuniaoFormProps {
  reuniao?: Reuniao | null;
  onSubmit: (data: Omit<Reuniao, 'id'>) => void;
  onCancel: () => void;
}

export function ReuniaoForm({ reuniao, onSubmit, onCancel }: ReuniaoFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    processoId: '',
    titulo: '',
    data: '',
    hora: '',
    local: '',
    pauta: '',
    ataAnexada: false,
    participantes: [] as string[],
    status: 'agendada' as const,
  });

  const [newParticipante, setNewParticipante] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (reuniao) {
      setFormData({
        processoId: reuniao.processoId,
        titulo: reuniao.titulo,
        data: reuniao.data,
        hora: reuniao.hora,
        local: reuniao.local,
        pauta: reuniao.pauta,
        ataAnexada: reuniao.ataAnexada,
        participantes: reuniao.participantes,
        status: reuniao.status,
      });
    } else {
      // Set default values for new meeting
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        data: today,
        participantes: user?.nome ? [user.nome] : [],
      }));
    }
  }, [reuniao, user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');

    if (file) {
      // Check if file is PDF
      if (file.type !== 'application/pdf') {
        setError('Apenas arquivos PDF são permitidos para atas');
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
      setFormData({ ...formData, ataAnexada: true });
    }
  };

  const addParticipante = () => {
    if (newParticipante.trim() && !formData.participantes.includes(newParticipante.trim())) {
      setFormData({
        ...formData,
        participantes: [...formData.participantes, newParticipante.trim()]
      });
      setNewParticipante('');
    }
  };

  const removeParticipante = (participante: string) => {
    setFormData({
      ...formData,
      participantes: formData.participantes.filter(p => p !== participante)
    });
  };

  const addFuncionarioAsParticipante = (funcionario: string) => {
    if (!formData.participantes.includes(funcionario)) {
      setFormData({
        ...formData,
        participantes: [...formData.participantes, funcionario]
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.participantes.length === 0) {
      setError('Adicione pelo menos um participante');
      return;
    }

    onSubmit(formData);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFormData({ ...formData, ataAnexada: false });
    setError('');
  };

  const locaisComuns = [
    'Sala de Reuniões A',
    'Sala de Reuniões B',
    'Sala de Conferências',
    'Auditório',
    'Escritório do Diretor',
    'Sala de Videoconferência',
    'Online (Teams/Zoom)',
    'Externa - Cliente',
    'Fórum',
    'Tribunal'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value: 'agendada' | 'realizada' | 'cancelada') => 
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agendada">Agendada</SelectItem>
              <SelectItem value="realizada">Realizada</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="titulo">Título da Reunião *</Label>
        <Input
          id="titulo"
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          placeholder="Ex: Reunião de Estratégia - Caso Silva"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="data">Data *</Label>
          <Input
            id="data"
            type="date"
            value={formData.data}
            onChange={(e) => setFormData({ ...formData, data: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hora">Hora *</Label>
          <Input
            id="hora"
            type="time"
            value={formData.hora}
            onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="local">Local *</Label>
          <Select 
            value={formData.local} 
            onValueChange={(value) => setFormData({ ...formData, local: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o local" />
            </SelectTrigger>
            <SelectContent>
              {locaisComuns.map((local) => (
                <SelectItem key={local} value={local}>
                  {local}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pauta">Pauta da Reunião *</Label>
        <Textarea
          id="pauta"
          value={formData.pauta}
          onChange={(e) => setFormData({ ...formData, pauta: e.target.value })}
          placeholder="Descreva os tópicos que serão discutidos na reunião"
          rows={4}
          required
        />
      </div>

      {/* Participants Section */}
      <div className="space-y-4">
        <div>
          <Label>Participantes *</Label>
          <p className="text-sm text-muted-foreground">
            Adicione os participantes da reunião
          </p>
        </div>

        {/* Quick Add from Team */}
        <div className="space-y-2">
          <Label className="text-sm">Adicionar da Equipe:</Label>
          <div className="flex flex-wrap gap-2">
            {mockFuncionarios.map((funcionario) => (
              <Button
                key={funcionario.id}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addFuncionarioAsParticipante(funcionario.nome)}
                disabled={formData.participantes.includes(funcionario.nome)}
              >
                <Plus className="w-3 h-3 mr-1" />
                {funcionario.nome}
              </Button>
            ))}
          </div>
        </div>

        {/* Manual Add */}
        <div className="flex gap-2">
          <Input
            placeholder="Nome do participante"
            value={newParticipante}
            onChange={(e) => setNewParticipante(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addParticipante())}
          />
          <Button type="button" onClick={addParticipante}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Current Participants */}
        {formData.participantes.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm">Participantes Adicionados:</Label>
            <div className="flex flex-wrap gap-2">
              {formData.participantes.map((participante, index) => (
                <Badge key={index} variant="secondary" className="pr-1">
                  {participante}
                  <button
                    type="button"
                    onClick={() => removeParticipante(participante)}
                    className="ml-2 hover:bg-gray-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ata Upload Section */}
      {formData.status === 'realizada' && (
        <div className="space-y-4">
          <div>
            <Label>Ata da Reunião</Label>
            <p className="text-sm text-muted-foreground">
              Anexe a ata da reunião (apenas PDF)
            </p>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {!selectedFile ? (
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <div className="mt-2">
                  <label htmlFor="ata-upload" className="cursor-pointer">
                    <span className="text-sm font-medium text-primary hover:text-primary/80">
                      Clique para anexar a ata
                    </span>
                    <input
                      id="ata-upload"
                      name="ata-upload"
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
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <File className="h-6 w-6 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
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
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Dicas para Reuniões Eficazes:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Defina uma pauta clara e objetiva</li>
          <li>Convide apenas os participantes necessários</li>
          <li>Estabeleça horário de início e fim</li>
          <li>Documente as decisões tomadas na ata</li>
        </ul>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {reuniao ? 'Atualizar' : 'Agendar'} Reunião
        </Button>
      </div>
    </form>
  );
}