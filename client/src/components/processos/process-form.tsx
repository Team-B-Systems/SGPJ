import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAuth } from '../../lib/auth-context';
import { type Processo } from '../../lib/mock-data';

interface ProcessFormProps {
  processo?: Processo | null;
  onSubmit: (data: Omit<Processo, 'id'>) => void;
  onCancel: () => void;
}

export function ProcessForm({ processo, onSubmit, onCancel }: ProcessFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    numeroProcesso: '',
    titulo: '',
    descricao: '',
    status: 'ativo' as const,
    dataAbertura: '',
    dataUltimaAtualizacao: '',
    responsavel: user?.nome || '',
    categoria: '',
    prioridade: 'media' as const,
  });

  useEffect(() => {
    if (processo) {
      setFormData({
        numeroProcesso: processo.numeroProcesso,
        titulo: processo.titulo,
        descricao: processo.descricao,
        status: processo.status,
        dataAbertura: processo.dataAbertura,
        dataUltimaAtualizacao: processo.dataUltimaAtualizacao,
        responsavel: processo.responsavel,
        categoria: processo.categoria,
        prioridade: processo.prioridade,
      });
    } else {
      // Set current date for new processes
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        dataAbertura: today,
        dataUltimaAtualizacao: today,
      }));
    }
  }, [processo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate process number if creating new process
    if (!processo) {
      const year = new Date().getFullYear();
      const processCount = Math.floor(Math.random() * 999) + 1;
      const numeroProcesso = `${year}-${processCount.toString().padStart(3, '0')}-JUR`;
      
      onSubmit({
        ...formData,
        numeroProcesso,
        dataUltimaAtualizacao: new Date().toISOString().split('T')[0],
      });
    } else {
      onSubmit({
        ...formData,
        dataUltimaAtualizacao: new Date().toISOString().split('T')[0],
      });
    }
  };

  const categorias = [
    'Trabalhista',
    'Civil',
    'Criminal',
    'Contratual',
    'Tributário',
    'Consultoria',
    'Compliance',
    'Outro'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="titulo">Título do Processo *</Label>
          <Input
            id="titulo"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            placeholder="Digite o título do processo"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria">Categoria *</Label>
          <Select 
            value={formData.categoria} 
            onValueChange={(value) => setFormData({ ...formData, categoria: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((categoria) => (
                <SelectItem key={categoria} value={categoria}>
                  {categoria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição *</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          placeholder="Descreva detalhadamente o processo"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value: 'ativo' | 'pendente' | 'arquivado') => 
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="arquivado">Arquivado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="prioridade">Prioridade</Label>
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
          <Label htmlFor="responsavel">Responsável</Label>
          <Input
            id="responsavel"
            value={formData.responsavel}
            onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
            placeholder="Nome do responsável"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

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