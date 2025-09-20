import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAuth } from '../../lib/auth-context';
import { Processo } from '../../lib/api';

interface ProcessFormProps {
  processo?: Processo | null;
  onSubmit: (data: Omit<Processo, 'id'>) => void;
  onCancel: () => void;
}

const tiposProcesso = [
  'Disciplinar',
  'Laboral',
  'Administrativo',
  'Civil'
];

export function ProcessForm({ processo, onSubmit, onCancel }: ProcessFormProps) {
  const { user } = useAuth();

  const [formData, setFormData] = useState<Omit<Processo, 'id'>>({
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    numeroProcesso: '',
    dataAbertura: new Date().toISOString().split('T')[0],
    assunto: '',
    tipoProcesso: '',
    estado: '',
    dataEncerramento: null,
    responsavel: user!,       // agora correto: User, não string
    documentos: [],
    parecer: null,
    envolvidos: [],
    reunioes: [],
  });

  useEffect(() => {
    if (processo) {
      setFormData({
        ...processo,
        updatedAt: new Date().toISOString(),
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData((prev) => ({
        ...prev,
        dataAbertura: today,
        updatedAt: today,
      }));
    }
  }, [processo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!processo) {
      // gera número de processo automaticamente
      const year = new Date().getFullYear();
      const processCount = Math.floor(Math.random() * 999) + 1;
      const numeroProcesso = `${year}-${processCount.toString().padStart(3, '0')}-JUR`;

      onSubmit({
        ...formData,
        numeroProcesso,
      });
    } else {
      onSubmit({
        ...formData,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="assunto">Assunto *</Label>
          <Input
            id="assunto"
            value={formData.assunto}
            onChange={(e) =>
              setFormData({ ...formData, assunto: e.target.value })
            }
            placeholder="Digite o assunto do processo"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipoProcesso">Tipo de Processo *</Label>
          <Select
            id="tipoProcesso"
            value={formData.tipoProcesso}
            onValueChange={(e: any) =>
              setFormData({ ...formData, tipoProcesso: e })
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de processo" />
            </SelectTrigger>
            <SelectContent>
              {tiposProcesso.map((tipo, index) => (
                <SelectItem key={index} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="estado">Estado *</Label>
          <Input
            id="estado"
            value={processo ? formData.estado : 'Aberto'}
            onChange={(e) =>
              setFormData({ ...formData, estado: e.target.value })
            }
            placeholder="Aberto, Em andamento, Encerrado..."
            required
            disabled={processo === null}
          />
        </div>

        {processo == null && (
          <div className="space-y-2">
            <Label htmlFor="dataAbertura">Data de Abertura *</Label>
            <Input
              id="dataAbertura"
              type="date"
              value={formData.dataAbertura}
              onChange={(e) =>
                setFormData({ ...formData, dataAbertura: e.target.value })
              }
              required
              disabled={processo === null}
            />
          </div>
        )}
      </div>

      {processo && (
        <div className="space-y-2">
          <Label htmlFor="numeroProcesso">Número do Processo</Label>
          <Input
            id="numeroProcesso"
            value={formData.numeroProcesso}
            disabled
            className="bg-gray-50"
          />
        </div>
      )}

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {processo ? 'Atualizar' : 'Criar'} Processo
        </Button>
      </div>
    </form>
  );
}
