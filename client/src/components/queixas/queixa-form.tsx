import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { type Queixa } from '../../lib/mock-data';

interface QueixaFormProps {
  queixa?: Queixa | null;
  onSubmit: (data: Omit<Queixa, 'id'>) => void;
  onCancel: () => void;
}

export function QueixaForm({ queixa, onSubmit, onCancel }: QueixaFormProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    requerente: '',
    dataAbertura: '',
    status: 'aberta' as const,
    prioridade: 'media' as const,
  });

  useEffect(() => {
    if (queixa) {
      setFormData({
        titulo: queixa.titulo,
        descricao: queixa.descricao,
        requerente: queixa.requerente,
        dataAbertura: queixa.dataAbertura,
        status: queixa.status,
        prioridade: queixa.prioridade,
      });
    } else {
      // Set current date for new complaints
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        dataAbertura: today,
      }));
    }
  }, [queixa]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="titulo">Título da Queixa *</Label>
        <Input
          id="titulo"
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          placeholder="Descreva brevemente a queixa"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="requerente">Requerente *</Label>
        <Input
          id="requerente"
          value={formData.requerente}
          onChange={(e) => setFormData({ ...formData, requerente: e.target.value })}
          placeholder="Nome da pessoa ou entidade que fez a queixa"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição Detalhada *</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          placeholder="Descreva detalhadamente a queixa, incluindo contexto e circunstâncias"
          rows={6}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prioridade">Prioridade *</Label>
          <Select 
            value={formData.prioridade} 
            onValueChange={(value: 'baixa' | 'media' | 'alta') => 
              setFormData({ ...formData, prioridade: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="baixa">Baixa</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value: 'aberta' | 'em_analise' | 'resolvida') => 
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aberta">Aberta</SelectItem>
              <SelectItem value="em_analise">Em Análise</SelectItem>
              <SelectItem value="resolvida">Resolvida</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataAbertura">Data de Abertura *</Label>
          <Input
            id="dataAbertura"
            type="date"
            value={formData.dataAbertura}
            onChange={(e) => setFormData({ ...formData, dataAbertura: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Orientações para Registro de Queixas:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Seja específico e objetivo na descrição</li>
          <li>Inclua datas, horários e pessoas envolvidas quando relevante</li>
          <li>Classifique a prioridade adequadamente</li>
          <li>Mantenha um tom profissional e imparcial</li>
        </ul>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {queixa ? 'Atualizar' : 'Registrar'} Queixa
        </Button>
      </div>
    </form>
  );
}