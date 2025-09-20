import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useAuth } from '../../lib/auth-context';
import { Envolvido } from '../../lib/api';
import { useProcessos } from '../../lib/processos-context';

interface EnvolvidoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (envolvido: Omit<Envolvido, 'id'>) => void;
  envolvido?: Envolvido;
  processoId?: number;
}

export function EnvolvidoForm({ isOpen, onClose, onSubmit, envolvido, processoId }: EnvolvidoFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    processoId: processoId || -1,
    nome: '',
    papelNoProcesso: '',
    numeroIdentificacao: '',
  });
  const papeisNoProcesso = ['Autor', 'Réu', 'Testemunha', 'Perito', 'Outro']
  const { processos } = useProcessos();

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (envolvido) {
      setFormData({
        processoId: envolvido.envolvido.id,
        nome: envolvido.envolvido.nome,
        papelNoProcesso: envolvido.envolvido.papelNoProcesso,
        numeroIdentificacao: envolvido.envolvido.numeroIdentificacao
      });
    } else {
      setFormData({
        processoId: processoId || -1,
        nome: '',
        papelNoProcesso: '',
        numeroIdentificacao: ''
      });
    }
    setErrors({});
  }, [envolvido, processoId, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.processoId) {
      newErrors.processoId = 'Processo é obrigatório';
    }

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.numeroIdentificacao.trim()) {
      newErrors.numeroIdentificacao = 'numeroIdentificacao é obrigatório';
    }

    if (formData.papelNoProcesso === '') {
      newErrors.cargo = 'Cargo é obrigatório para funcionários internos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const findProcessoId = processos.find(p => p.numeroProcesso === formData.processoId.toString() && p.estado !== 'Arquivado')?.id;
    
    onSubmit({
      createdAt: envolvido ? envolvido.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      envolvido: {
        createdAt: envolvido ? envolvido.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        nome: formData.nome.trim(),
        numeroIdentificacao: formData.numeroIdentificacao.trim(),
        papelNoProcesso: formData.papelNoProcesso,
        id: 0,
      },
      envolvidoId: 0,
      processoJuridicoId: findProcessoId!,
    });

    onClose();
  };

  /*const handleFuncionarioSelect = (funcionarioId: string) => {
    const funcionario = mockFuncionarios.find(f => f.id === funcionarioId);
    if (funcionario) {
      setFormData({
        ...formData,
        nome: funcionario.nome,
        papelNoProcesso: '',
        numeroIdentificacao: funcionario.email,
      });
    }
  };*/

  const isReadOnly = user?.role === 'Chefe';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isReadOnly
              ? 'Visualizar Envolvido'
              : envolvido
                ? 'Editar Envolvido'
                : 'Adicionar Envolvido'
            }
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="processoId">Processo *</Label>
            <Select
              value={formData.processoId}
              onValueChange={(value: any) => setFormData({ ...formData, processoId: value })}
              disabled={isReadOnly || !!processoId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um processo" />
              </SelectTrigger>
              <SelectContent>
                {processos.map((processo) => {
                  if (processo.estado !== 'Arquivado') {
                    return (<SelectItem key={processo.id} value={processo.numeroProcesso}>
                    {processo.numeroProcesso} - {processo.assunto}
                  </SelectItem>);
                  }
                  return null;
                })}
              </SelectContent>
            </Select>
            {errors.processoId && <p className="text-destructive mt-1">{errors.processoId}</p>}
          </div>

          <div>
            <Label>Tipo de Envolvido *</Label>
            <Select
              value={formData.papelNoProcesso}
              onValueChange={(value: any) => setFormData({ ...formData, papelNoProcesso: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o papel no processo" />
              </SelectTrigger>
              <SelectContent>
                {papeisNoProcesso.map((papel, index) => (
                  <SelectItem key={index} value={papel}>
                    {papel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.processoId && <p className="text-destructive mt-1">{errors.processoId}</p>}
          </div>

          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Nome completo"
              disabled={isReadOnly}
            />
            {errors.nome && <p className="text-destructive mt-1">{errors.nome}</p>}
          </div>

          <div>
            <Label htmlFor="numeroIdentificacao">Número Identificação *</Label>
            <Input
              id="numeroIdentificacao"
              value={formData.numeroIdentificacao}
              onChange={(e) => setFormData({ ...formData, numeroIdentificacao: e.target.value })}
              placeholder="Número Identificação"
              disabled={isReadOnly}
            />
            {errors.numeroIdentificacao && <p className="text-destructive mt-1">{errors.numeroIdentificacao}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {isReadOnly ? 'Fechar' : 'Cancelar'}
            </Button>
            {!isReadOnly && (
              <Button type="submit">
                {envolvido ? 'Atualizar' : 'Adicionar'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}