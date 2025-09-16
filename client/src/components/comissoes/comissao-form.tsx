import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { useAuth } from '../../lib/auth-context';
import { mockFuncionarios, type Comissao } from '../../lib/mock-data';
import { X, Plus, Users } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface ComissaoFormProps {
  comissao?: Comissao | null;
  onSubmit: (data: Omit<Comissao, 'id'>) => void;
  onCancel: () => void;
}

export function ComissaoForm({ comissao, onSubmit, onCancel }: ComissaoFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    dataFormacao: '',
    status: 'ativa' as const,
    membros: [] as string[],
    responsavel: '',
  });

  const [selectedMember, setSelectedMember] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (comissao) {
      setFormData({
        nome: comissao.nome,
        descricao: comissao.descricao,
        dataFormacao: comissao.dataFormacao,
        status: comissao.status,
        membros: comissao.membros,
        responsavel: comissao.responsavel,
      });
    } else {
      // Set default values for new comissao
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        dataFormacao: today,
        responsavel: user?.nome || '',
        membros: user?.nome ? [user.nome] : [],
      }));
    }
  }, [comissao, user]);

  const addMember = () => {
    if (selectedMember) {
      const funcionario = mockFuncionarios.find(f => f.id === selectedMember);
      if (funcionario && !formData.membros.includes(funcionario.nome)) {
        setFormData({
          ...formData,
          membros: [...formData.membros, funcionario.nome]
        });
        setSelectedMember('');
      }
    }
  };

  const removeMember = (memberName: string) => {
    // Don't allow removing the responsible person
    if (memberName === formData.responsavel) {
      setError('Não é possível remover o responsável da comissão');
      return;
    }
    
    setFormData({
      ...formData,
      membros: formData.membros.filter(m => m !== memberName)
    });
    setError('');
  };

  const handleResponsavelChange = (funcionarioId: string) => {
    const funcionario = mockFuncionarios.find(f => f.id === funcionarioId);
    if (funcionario) {
      const newMembros = [...formData.membros];
      
      // Add the new responsible person to members if not already there
      if (!newMembros.includes(funcionario.nome)) {
        newMembros.push(funcionario.nome);
      }

      setFormData({
        ...formData,
        responsavel: funcionario.nome,
        membros: newMembros
      });
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.membros.length === 0) {
      setError('A comissão deve ter pelo menos um membro');
      return;
    }

    if (!formData.responsavel) {
      setError('Selecione um responsável para a comissão');
      return;
    }

    if (!formData.membros.includes(formData.responsavel)) {
      setError('O responsável deve ser um membro da comissão');
      return;
    }

    onSubmit(formData);
  };

  const availableFuncionarios = mockFuncionarios.filter(f => 
    !formData.membros.includes(f.nome)
  );

  const tiposComissao = [
    'Comissão de Ética',
    'Comissão de Compliance',
    'Comissão Disciplinar',
    'Comissão de Auditoria',
    'Comissão de Qualidade',
    'Comissão de Segurança',
    'Comissão de Recursos Humanos',
    'Comissão Técnica',
    'Comissão Executiva',
    'Outra'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome da Comissão *</Label>
          <Select 
            value={formData.nome} 
            onValueChange={(value) => setFormData({ ...formData, nome: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de comissão" />
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
              value=""
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="mt-2"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value: 'ativa' | 'inativa') => 
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativa">Ativa</SelectItem>
              <SelectItem value="inativa">Inativa</SelectItem>
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
          placeholder="Descreva o propósito e objetivos da comissão"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dataFormacao">Data de Formação *</Label>
          <Input
            id="dataFormacao"
            type="date"
            value={formData.dataFormacao}
            onChange={(e) => setFormData({ ...formData, dataFormacao: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="responsavel">Responsável *</Label>
          <Select 
            value={mockFuncionarios.find(f => f.nome === formData.responsavel)?.id || ''} 
            onValueChange={handleResponsavelChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o responsável" />
            </SelectTrigger>
            <SelectContent>
              {mockFuncionarios
                .filter(f => f.perfil === 'chefe' || f.perfil === 'administrador')
                .map((funcionario) => (
                  <SelectItem key={funcionario.id} value={funcionario.id}>
                    {funcionario.nome} - {funcionario.cargo}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Members Section */}
      <div className="space-y-4">
        <div>
          <Label>Membros da Comissão *</Label>
          <p className="text-sm text-muted-foreground">
            Adicione os membros que farão parte desta comissão
          </p>
        </div>

        {/* Add Member */}
        <div className="flex gap-2">
          <Select 
            value={selectedMember} 
            onValueChange={setSelectedMember}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Selecione um funcionário" />
            </SelectTrigger>
            <SelectContent>
              {availableFuncionarios.map((funcionario) => (
                <SelectItem key={funcionario.id} value={funcionario.id}>
                  {funcionario.nome} - {funcionario.cargo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={addMember} disabled={!selectedMember}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Current Members */}
        {formData.membros.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm">Membros Adicionados:</Label>
            <div className="flex flex-wrap gap-2">
              {formData.membros.map((membro, index) => (
                <Badge key={index} variant="secondary" className="pr-1">
                  <Users className="w-3 h-3 mr-1" />
                  {membro}
                  {membro === formData.responsavel && (
                    <span className="ml-1 text-xs text-blue-600">(Responsável)</span>
                  )}
                  {membro !== formData.responsavel && (
                    <button
                      type="button"
                      onClick={() => removeMember(membro)}
                      className="ml-2 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
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