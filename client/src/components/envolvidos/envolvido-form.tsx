import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAuth } from '../../lib/auth-context';
import { Envolvido } from '../../lib/api';
import { useProcessos } from '../../lib/processos-context';
import { papeisPorTipo, TipoDeProcesso, EnvolvidoPapelNoProcesso } from '../../lib/data';
import { useFuncionarios } from '../../lib/funcionarios-context';

interface EnvolvidoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (envolvido: Omit<Envolvido, 'id'>) => void;
  envolvido?: Envolvido;
  processoId?: number;
}

export function EnvolvidoForm({ isOpen, onClose, onSubmit, envolvido, processoId }: EnvolvidoFormProps) {
  const { user } = useAuth();
  const { funcionarios } = useFuncionarios();
  const { processos } = useProcessos();

  const [formData, setFormData] = useState({
    processoId: processoId?.toString() || processos[0]?.id.toString() || '',
    funcionarioId: '',
    nome: '',
    numeroIdentificacao: '',
    papelNoProcesso: '',
    isFuncionario: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [papeisNoProcesso, setPapeisNoProcesso] = useState<EnvolvidoPapelNoProcesso[]>([]);

  // Inicializa formulário
  useEffect(() => {
    if (envolvido) {
      setFormData({
        processoId: processoId?.toString() || '',
        funcionarioId: envolvido.envolvido.funcionarioId?.toString() || '',
        nome: envolvido.envolvido.nome,
        numeroIdentificacao: envolvido.envolvido.numeroIdentificacao,
        papelNoProcesso: envolvido.papelNoProcesso,
        isFuncionario: !!envolvido.envolvido.funcionarioId,
      });
    } else {
      setFormData({
        processoId: processoId?.toString() || '',
        funcionarioId: '',
        nome: '',
        numeroIdentificacao: '',
        papelNoProcesso: '',
        isFuncionario: false,
      });
    }
    setErrors({});
  }, [envolvido, processoId, isOpen]);

  // Atualiza papéis disponíveis de acordo com o tipo do processo
  useEffect(() => {
    const processo = processos.find(p => p.id.toString() === formData.processoId);
    if (processo) {
      setPapeisNoProcesso(papeisPorTipo[processo.tipoProcesso as TipoDeProcesso] || []);
    } else {
      setPapeisNoProcesso([]);
    }
  }, [formData.processoId, processos]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.processoId || formData.processoId === '') newErrors.processoId = 'Processo é obrigatório';
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.numeroIdentificacao.trim()) newErrors.numeroIdentificacao = 'Número de identificação é obrigatório';
    if (!formData.papelNoProcesso.trim()) newErrors.papelNoProcesso = 'Papel no processo é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log(formData)
    e.preventDefault();
    if (!validateForm()) return;

    const findProcessoId = processos.find(p => p.id.toString() === formData.processoId)?.id;

    onSubmit({
      createdAt: envolvido ? envolvido.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      papelNoProcesso: formData.papelNoProcesso,
      envolvido: {
        createdAt: envolvido ? envolvido.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        nome: formData.nome.trim(),
        numeroIdentificacao: formData.numeroIdentificacao.trim(),
        id: 0,
        funcionarioId: formData.isFuncionario ? parseInt(formData.funcionarioId) : undefined,
        interno: formData.isFuncionario,
      },
      envolvidoId: 0,
      processoJuridicoId: findProcessoId!,
    });

    onClose();
  };

  const handleFuncionarioSelect = (funcionarioId: string) => {
    setFormData(prev => ({ ...prev, funcionarioId, isFuncionario: !!funcionarioId }));
    const funcionario = funcionarios.find(f => f.id?.toString() === funcionarioId);
    if (funcionario) {
      setFormData(prev => ({
        ...prev,
        nome: funcionario.nome,
        numeroIdentificacao: funcionario.numeroIdentificacao,
      }));
    } else {
      // Se nenhum funcionário selecionado, limpar campos e habilitar
      setFormData(prev => ({ ...prev, nome: '', numeroIdentificacao: '' }));
    }
  };

  const isReadOnly = user?.role === 'Chefe';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isReadOnly
              ? 'Visualizar Envolvido'
              : envolvido
                ? 'Visualizar Envolvido'
                : 'Adicionar Envolvido'
            }
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Seleciona processo */}
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
                {processos.filter(p => p.estado !== 'Arquivado').map(p => (
                  <SelectItem key={p.id} value={p.id.toString()}>{p.numeroProcesso} - {p.assunto}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.processoId && <p className="text-destructive mt-1">{errors.processoId}</p>}
          </div>

          {/* Seleciona funcionário */}
          <div>
            <Label htmlFor="funcionarioId">Funcionário (opcional)</Label>
            <Select
              value={formData.funcionarioId}
              onValueChange={handleFuncionarioSelect}
              disabled={isReadOnly || envolvido !== undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um funcionário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nenhum">Nenhum</SelectItem>
                {funcionarios.filter(f => f.id !== user?.id).map(f => (
                  <SelectItem key={f.id} value={f.id?.toString()}>
                    {f.nome} ({f.numeroIdentificacao})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Papel no processo */}
          <div>
            <Label htmlFor="papelNoProcesso">Papel no processo *</Label>
            <Select
              value={formData.papelNoProcesso}
              onValueChange={(value: string) => setFormData({ ...formData, papelNoProcesso: value })}
              disabled={isReadOnly || envolvido !== undefined || papeisNoProcesso.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o papel no processo" />
              </SelectTrigger>
              <SelectContent>
                {papeisNoProcesso.map((papel, i) => (
                  <SelectItem key={i} value={papel}>{papel}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.papelNoProcesso && <p className="text-destructive mt-1">{errors.papelNoProcesso}</p>}
          </div>

          {/* Nome */}
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Nome completo"
              disabled={isReadOnly || envolvido !== undefined || formData.isFuncionario}
            />
            {errors.nome && <p className="text-destructive mt-1">{errors.nome}</p>}
          </div>

          {/* Número identificação */}
          <div>
            <Label htmlFor="numeroIdentificacao">Número Identificação *</Label>
            <Input
              id="numeroIdentificacao"
              value={formData.numeroIdentificacao}
              onChange={(e) => setFormData({ ...formData, numeroIdentificacao: e.target.value })}
              placeholder="Número Identificação"
              disabled={isReadOnly || envolvido !== undefined || formData.isFuncionario}
            />
            {errors.numeroIdentificacao && <p className="text-destructive mt-1">{errors.numeroIdentificacao}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {(isReadOnly || envolvido !== undefined) ? 'Fechar' : 'Cancelar'}
            </Button>
            {!(isReadOnly || envolvido !== undefined) && (
              <Button type="submit">{envolvido ? 'Atualizar' : 'Adicionar'}</Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
