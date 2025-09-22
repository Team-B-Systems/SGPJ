import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { User } from '../../lib/api';

interface FuncionarioFormProps {
  funcionario?: User | null;
  onSubmit: (data: Omit<User, 'id'>) => void;
  onCancel: () => void;
}

export function FuncionarioForm({ funcionario, onSubmit, onCancel }: FuncionarioFormProps) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cargo: '',
    numeroIdentificacao: '',
    nomeDepartamento: '',
    dataAdmissao: '',
    estado: 'Inativo',
    role: '',
    senha: 'senha123',
  });

  useEffect(() => {
    if (funcionario) {
      setFormData({
        nome: funcionario.nome,
        email: funcionario.email,
        cargo: funcionario.categoria,
        numeroIdentificacao: funcionario.numeroIdentificacao,
        nomeDepartamento: funcionario.departamento,
        dataAdmissao: funcionario.createdAt.split('T')[0],
        estado: funcionario.estado,
        role: funcionario.role,
        senha: '',
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
    // Map formData to match Omit<User, 'id'>
    const mappedData: Omit<User, 'id'> = {
      nome: formData.nome,
      email: formData.email,
      categoria: formData.cargo,
      departamento: formData.nomeDepartamento,
      createdAt: new Date(formData.dataAdmissao).toISOString(),
      updatedAt: new Date().toISOString(),
      estado: formData.estado,
      role: formData.role,
      numeroIdentificacao: formData.numeroIdentificacao,
      senha: formData.senha,
      twoFactorSecret: false,
    };
    onSubmit(mappedData);
  };

  const departamentos = [
    'Recursos Humanos',
    'Jurídico',
    'Financeiro',
    'TI'
  ];

  const cargos = [
    'Técnico',
    'Chefe'
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
            readOnly={!!funcionario} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numero_identificacao">Número Identificação *</Label>
          <Input
            id="numero_identificacao"
            type="text"
            value={formData.numeroIdentificacao}
            onChange={(e) => setFormData({ ...formData, numeroIdentificacao: e.target.value })}
            placeholder="Digite o número de identificação"
            required
            readOnly={!!funcionario}   // impede edição, mas o valor é enviado
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cargo">Categoria *</Label>
          <Select
            value={formData.cargo}
            onValueChange={(value: any) => setFormData({ ...formData, cargo: value })}
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="departamento">Departamento *</Label>
          <Select
            value={formData.nomeDepartamento}
            onValueChange={(value: any) => setFormData({ ...formData, nomeDepartamento: value })}
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

        <div className="space-y-2">
          <Label htmlFor="perfil">Perfil de Acesso *</Label>
          <Select
            value={formData.role}
            onValueChange={(value: 'Funcionario' | 'Chefe' | 'Admin') =>
              setFormData({ ...formData, role: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Funcionário">Funcionário</SelectItem>
              <SelectItem value="Chefe">Chefe</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="senha">Senha</Label>
          <Input
            id="senha"
            value={formData.senha}
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <Select
            value={formData.estado}
            disabled
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ativo">Ativo</SelectItem>
              <SelectItem value="Inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Informações úteis</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li><strong>Funcionário:</strong> Visualizar e gerenciar processos, documentos, reuniões</li>
          <li><strong>Chefe:</strong> Todas as funções do funcionário + gestão de comissões</li>
          <li><strong>senha123:</strong> Esta senha é a padrão para todos os funcionários novos, no primeiro acesso o funcionário deve alterar a senha</li>
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