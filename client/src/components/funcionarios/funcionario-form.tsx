import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { type Funcionario } from '../../lib/mock-data';

interface FuncionarioFormProps {
  funcionario?: Funcionario | null;
  onSubmit: (data: Omit<Funcionario, 'id'>) => void;
  onCancel: () => void;
}

export function FuncionarioForm({ funcionario, onSubmit, onCancel }: FuncionarioFormProps) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cargo: '',
    departamento: '',
    dataAdmissao: '',
    status: 'ativo' as const,
    perfil: 'funcionario' as const,
  });

  useEffect(() => {
    if (funcionario) {
      setFormData({
        nome: funcionario.nome,
        email: funcionario.email,
        cargo: funcionario.cargo,
        departamento: funcionario.departamento,
        dataAdmissao: funcionario.dataAdmissao,
        status: funcionario.status,
        perfil: funcionario.perfil,
      });
    } else {
      // Set current date for new employees
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        dataAdmissao: today,
      }));
    }
  }, [funcionario]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const departamentos = [
    'Jurídico',
    'Administrativo',
    'Financeiro',
    'Recursos Humanos',
    'TI',
    'Comercial',
    'Outro'
  ];

  const cargos = [
    'Advogado Júnior',
    'Advogado Pleno',
    'Advogado Sênior',
    'Paralegal',
    'Assistente Jurídico',
    'Coordenador Jurídico',
    'Chefe de Departamento',
    'Gerente',
    'Diretor',
    'Administrador do Sistema',
    'Analista',
    'Assistente',
    'Outro'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome Completo *</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Digite o nome completo"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="email@empresa.com"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cargo">Cargo *</Label>
          <Select 
            value={formData.cargo} 
            onValueChange={(value) => setFormData({ ...formData, cargo: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o cargo" />
            </SelectTrigger>
            <SelectContent>
              {cargos.map((cargo) => (
                <SelectItem key={cargo} value={cargo}>
                  {cargo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="departamento">Departamento *</Label>
          <Select 
            value={formData.departamento} 
            onValueChange={(value) => setFormData({ ...formData, departamento: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o departamento" />
            </SelectTrigger>
            <SelectContent>
              {departamentos.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="perfil">Perfil de Acesso *</Label>
          <Select 
            value={formData.perfil} 
            onValueChange={(value: 'funcionario' | 'chefe' | 'administrador') => 
              setFormData({ ...formData, perfil: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="funcionario">Funcionário</SelectItem>
              <SelectItem value="chefe">Chefe</SelectItem>
              <SelectItem value="administrador">Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value: 'ativo' | 'inativo') => 
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataAdmissao">Data de Admissão *</Label>
          <Input
            id="dataAdmissao"
            type="date"
            value={formData.dataAdmissao}
            onChange={(e) => setFormData({ ...formData, dataAdmissao: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Permissões por Perfil:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li><strong>Funcionário:</strong> Visualizar e gerenciar processos, documentos, reuniões</li>
          <li><strong>Chefe:</strong> Todas as funções do funcionário + gestão de comissões</li>
          <li><strong>Administrador:</strong> Acesso total + gestão de funcionários</li>
        </ul>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {funcionario ? 'Atualizar' : 'Cadastrar'} Funcionário
        </Button>
      </div>
    </form>
  );
}