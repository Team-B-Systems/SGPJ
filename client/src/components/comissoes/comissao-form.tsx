import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { useAuth } from '../../lib/auth-context';
import { mockFuncionarios as funcionarios, type Comissao } from '../../lib/mock-data';
import { X, Plus, Users } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { ComissaoCreate } from '../../lib/api';
import { useFuncionarios } from '../../lib/funcionarios-context';

interface ComissaoFormProps {
  comissao?: ComissaoCreate | null;
  onSubmit: (data: ComissaoCreate, id?: number) => void;
  onCancel: () => void;
}

function formatDateForInput(dateString: string | null | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
}

export function ComissaoForm({ comissao, onSubmit, onCancel }: ComissaoFormProps) {
  const { funcionarios: fetchFuncionarios, } = useFuncionarios();
  const { user } = useAuth();

  const [formData, setFormData] = useState<ComissaoCreate>({
    nome: '',
    descricao: '',
    dataCriacao: '',
    estado: 'Pendente',
    dataEncerramento: '',
    funcionarios: []
  });

  const [responsavelId, setResponsavelId] = useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (comissao) {
      setFormData({
        nome: comissao.nome,
        descricao: comissao.descricao,
        dataCriacao: formatDateForInput(comissao.dataCriacao),
        dataEncerramento: formatDateForInput(comissao.dataEncerramento),
        estado: comissao.estado,
        funcionarios: comissao.funcionarios.map(f => ({
          funcionarioId: f.funcionarioId,
          papel: f.papel,
          comissaoId: f.comissaoId || 0
        }))
      });

      const responsavel = comissao.funcionarios.find(f => f.papel === 'Presidente');
      if (responsavel) setResponsavelId(responsavel.funcionarioId.toString());
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, dataCriacao: today }));
    }
  }, [comissao, user]);

  const addMember = () => {
    if (selectedMemberId) {
      const funcionarioId = parseInt(selectedMemberId, 10);
      if (!formData.funcionarios.some(f => f.funcionarioId === funcionarioId)) {
        setFormData(prev => ({
          ...prev,
          funcionarios: [...prev.funcionarios, { funcionarioId, papel: 'Membro', comissaoId: 0 }]
        }));
        setSelectedMemberId('');
      }
    }
  };

  const removeMember = (funcionarioId: number) => {
    if (responsavelId === funcionarioId.toString()) {
      setError('Não é possível remover o responsável da comissão');
      return;
    }
    setFormData(prev => ({
      ...prev,
      funcionarios: prev.funcionarios.filter(f => f.funcionarioId !== funcionarioId)
    }));
    setError('');
  };

  const handleResponsavelChange = (funcionarioIdStr: string) => {
    const funcionarioId = parseInt(funcionarioIdStr, 10);

    if (!formData.funcionarios.some(f => f.funcionarioId === funcionarioId)) {
      setFormData(prev => ({
        ...prev,
        funcionarios: [...prev.funcionarios, { funcionarioId, papel: 'Membro', comissaoId: 0 }]
      }));
    }
    setResponsavelId(funcionarioIdStr);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.funcionarios.length === 0) {
      setError('A comissão deve ter pelo menos um membro');
      return;
    }

    if (!responsavelId) {
      setError('Selecione um presidente para a comissão');
      return;
    }

    if (!formData.funcionarios.some(f => f.funcionarioId.toString() === responsavelId)) {
      setError('O responsável deve ser um membro da comissão');
      return;
    }

    const dataToSend: ComissaoCreate = {
      ...formData,
      dataCriacao: new Date(formData.dataCriacao).toISOString(),
      dataEncerramento: formData.dataEncerramento
        ? new Date(formData.dataEncerramento).toISOString()
        : '',
      funcionarios: formData.funcionarios.map(f => ({
        funcionarioId: f.funcionarioId,
        papel: f.funcionarioId.toString() === responsavelId ? 'Presidente' : 'Membro',
        comissaoId: 0
      }))
    };

    onSubmit(dataToSend, comissao?.id);
  };

  const availableFuncionarios = fetchFuncionarios.filter(
    f => !formData.funcionarios.some(m => m.funcionarioId.toString() === f.id)
  );

  const tiposComissao = [
    'Comissão de Ética',
    'Comissão Disciplinar',
    'Comissão de Auditoria',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nome e Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome da Comissão *</Label>
          <Select
            value={formData.nome}
            onValueChange={(value: any) => setFormData(prev => ({ ...prev, nome: value }))}
            disabled={!!comissao}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o nome da comissão" />
            </SelectTrigger>
            <SelectContent>
              {tiposComissao.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.nome === 'Outra' && (
            <Input
              placeholder="Digite o nome da comissão"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              className="mt-2"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="estado">Estado</Label>
          <Select
            value={formData.estado}
            onValueChange={(value: string) => setFormData(prev => ({ ...prev, estado: value }))}
            disabled={!comissao}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Aprovada">Aprovada</SelectItem>
              <SelectItem value="Rejeitada">Rejeitada</SelectItem>
              <SelectItem value="Dispensada">Dispensada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição *</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
          placeholder="Descreva o propósito e objetivos da comissão"
          rows={3}
          required
        />
      </div>

      {/* Datas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dataCriacao">Data de Criação *</Label>
          <Input
            id="dataCriacao"
            type="date"
            value={formData.dataCriacao}
            onChange={(e) => setFormData(prev => ({ ...prev, dataCriacao: e.target.value }))}
            required
            readOnly
            disabled={!comissao}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dataEncerramento">Data de Encerramento</Label>
          <Input
            id="dataEncerramento"
            type="date"
            value={formData.dataEncerramento || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, dataEncerramento: e.target.value }))}
            disabled={!comissao}
          />
        </div>
      </div>

      {/* Responsável */}
      <div className="space-y-2">
        <Label htmlFor="presidente">Presidente *</Label>
        <Select value={responsavelId || ''} onValueChange={handleResponsavelChange}  disabled={!!comissao} > 
          <SelectTrigger>
            <SelectValue placeholder="Selecione o presidente" />
          </SelectTrigger>
          <SelectContent>
            {fetchFuncionarios
              .filter(f => f.role !== 'Admin')
              .map((funcionario) => (
                <SelectItem key={funcionario.id} value={funcionario.id?.toString()}>
                  {funcionario.nome}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Membros */}
      <div className="space-y-4">
        <div>
          <Label>Membros da Comissão *</Label>
          <p className="text-sm text-muted-foreground">
            Adicione os membros que farão parte desta comissão
          </p>
        </div>

        <div className="flex gap-2">
          <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Selecione um membro" />
            </SelectTrigger>
            <SelectContent>
              {availableFuncionarios.map((funcionario) => (
                <SelectItem key={funcionario.id} value={funcionario.id?.toString()}>
                  {funcionario.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={addMember} disabled={!selectedMemberId}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {formData.funcionarios.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm">Membros Adicionados:</Label>
            <div className="flex flex-wrap gap-2">
              {formData.funcionarios.map((f, index) => {
                const membro = fetchFuncionarios.find(m => m.id?.toString() === f.funcionarioId.toString());
                const nomeMembro = membro ? membro.nome : 'Desconhecido';
                const isResponsavel = f.funcionarioId.toString() === responsavelId;
                return (
                  <Badge key={index} variant="secondary" className="pr-1">
                    <Users className="w-3 h-3 mr-1" />
                    {nomeMembro}
                    {isResponsavel && (
                      <span className="ml-1 text-xs text-blue-600">(Presidente)</span>
                    )}
                    {!isResponsavel && (
                      <button
                        type="button"
                        onClick={() => removeMember(f.funcionarioId)}
                        className="ml-2 hover:bg-gray-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Sobre Comissões:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>O responsável automaticamente se torna membro da comissão</li>
          <li>Apenas Chefes e Administradores podem ser responsáveis</li>
          <li>Comissões devem ter pelo menos um membro</li>
          <li>O responsável não pode ser removido dos membros</li>
        </ul>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {comissao ? 'Atualizar' : 'Cadastrar'} Comissão
        </Button>
      </div>
    </form>
  );
}
