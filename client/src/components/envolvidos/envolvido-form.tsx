import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Envolvido, mockProcessos, mockFuncionarios } from '../../lib/mock-data';
import { useAuth } from '../../lib/auth-context';

interface EnvolvidoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (envolvido: Omit<Envolvido, 'id'>) => void;
  envolvido?: Envolvido;
  processoId?: string;
}

export function EnvolvidoForm({ isOpen, onClose, onSubmit, envolvido, processoId }: EnvolvidoFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    processoId: processoId || '',
    nome: '',
    tipo: 'externo' as 'interno' | 'externo',
    parte: 'ativa' as 'ativa' | 'passiva',
    cargo: '',
    contato: '',
    email: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (envolvido) {
      setFormData({
        processoId: envolvido.processoId,
        nome: envolvido.nome,
        tipo: envolvido.tipo,
        parte: envolvido.parte,
        cargo: envolvido.cargo || '',
        contato: envolvido.contato,
        email: envolvido.email
      });
    } else {
      setFormData({
        processoId: processoId || '',
        nome: '',
        tipo: 'externo',
        parte: 'ativa',
        cargo: '',
        contato: '',
        email: ''
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

    if (!formData.contato.trim()) {
      newErrors.contato = 'Contato é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (formData.tipo === 'interno' && !formData.cargo?.trim()) {
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

    onSubmit({
      processoId: formData.processoId,
      nome: formData.nome.trim(),
      tipo: formData.tipo,
      parte: formData.parte,
      cargo: formData.cargo?.trim(),
      contato: formData.contato.trim(),
      email: formData.email.trim()
    });

    onClose();
  };

  const handleFuncionarioSelect = (funcionarioId: string) => {
    const funcionario = mockFuncionarios.find(f => f.id === funcionarioId);
    if (funcionario) {
      setFormData({
        ...formData,
        nome: funcionario.nome,
        cargo: funcionario.cargo,
        email: funcionario.email
      });
    }
  };

  const isReadOnly = user?.perfil === 'chefe';

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
              onValueChange={(value) => setFormData({ ...formData, processoId: value })}
              disabled={isReadOnly || !!processoId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um processo" />
              </SelectTrigger>
              <SelectContent>
                {mockProcessos.map((processo) => (
                  <SelectItem key={processo.id} value={processo.id}>
                    {processo.numeroProcesso} - {processo.titulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.processoId && <p className="text-destructive mt-1">{errors.processoId}</p>}
          </div>

          <div>
            <Label>Tipo de Envolvido *</Label>
            <RadioGroup
              value={formData.tipo}
              onValueChange={(value: 'interno' | 'externo') => 
                setFormData({ ...formData, tipo: value, nome: '', cargo: '', email: '' })
              }
              className="flex gap-6 mt-2"
              disabled={isReadOnly}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="interno" id="interno" />
                <Label htmlFor="interno">Funcionário Interno</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="externo" id="externo" />
                <Label htmlFor="externo">Parte Externa</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.tipo === 'interno' && !isReadOnly && (
            <div>
              <Label htmlFor="funcionario">Selecionar Funcionário</Label>
              <Select onValueChange={handleFuncionarioSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um funcionário" />
                </SelectTrigger>
                <SelectContent>
                  {mockFuncionarios.map((funcionario) => (
                    <SelectItem key={funcionario.id} value={funcionario.id}>
                      {funcionario.nome} - {funcionario.cargo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
            <Label>Parte no Processo *</Label>
            <RadioGroup
              value={formData.parte}
              onValueChange={(value: 'ativa' | 'passiva') => setFormData({ ...formData, parte: value })}
              className="flex gap-6 mt-2"
              disabled={isReadOnly}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ativa" id="ativa" />
                <Label htmlFor="ativa">Parte Ativa (Requerente)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="passiva" id="passiva" />
                <Label htmlFor="passiva">Parte Passiva (Requerido)</Label>
              </div>
            </RadioGroup>
          </div>

          {(formData.tipo === 'interno' || formData.cargo) && (
            <div>
              <Label htmlFor="cargo">
                Cargo {formData.tipo === 'interno' ? '*' : ''}
              </Label>
              <Input
                id="cargo"
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                placeholder="Cargo ou função"
                disabled={isReadOnly}
              />
              {errors.cargo && <p className="text-destructive mt-1">{errors.cargo}</p>}
            </div>
          )}

          <div>
            <Label htmlFor="contato">Contato *</Label>
            <Input
              id="contato"
              value={formData.contato}
              onChange={(e) => setFormData({ ...formData, contato: e.target.value })}
              placeholder="Telefone ou celular"
              disabled={isReadOnly}
            />
            {errors.contato && <p className="text-destructive mt-1">{errors.contato}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@exemplo.com"
              disabled={isReadOnly}
            />
            {errors.email && <p className="text-destructive mt-1">{errors.email}</p>}
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