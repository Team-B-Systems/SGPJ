import React, { useState, useEffect, FormEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Queixa, User } from "../../lib/api";
import { useFuncionarios } from "../../lib/funcionarios-context";
import { useProcessos } from '../../lib/processos-context';

interface QueixaFormProps {
  queixa?: any | null;
  funcionarios: User[] | null;
  isEdit?: boolean;
  partesPassivas: { id: number; nome: string }[];
  departamentos: { id: number; nome: string }[];
  processos?: { id: number; titulo: string }[];
  onSubmit: (data: Queixa) => void;
  onCancel: () => void;
}

export function QueixaForm({ isEdit = false,
  queixa,
  processos = [],
  onSubmit,
  onCancel,
}: QueixaFormProps) {
  const { funcionarios, fetchFuncionarios } = useFuncionarios();
  const { fetchProcessos } = useProcessos();

  useEffect(() => {
    if (!funcionarios.length) {
      fetchFuncionarios();
    }
  }, [funcionarios.length, fetchFuncionarios]);

  useEffect(() => {
    if (!processos.length) {
      fetchProcessos();
    }
  }, [processos.length,fetchProcessos]);

  const [formData, setFormData] = useState({
    autorId: "",
    partePassivaId: "",
    departamentoAutor: "",
    departamentoPassivo: "",
    dataEntrada: "",
    descricao: "",
    estado: "Pendente",        // valor default do enum
    ficheiro: undefined as File | undefined,
    processoId: "",
  });

  useEffect(() => {
    if (queixa && funcionarios) {
      const autor = funcionarios.find(f => f.id === queixa.funcionarioId);
      const passiva = funcionarios.find(f => f.id === queixa.pPassivaId);

      setFormData({
        autorId: queixa.funcionarioId.toString(),
        departamentoAutor: autor?.departamento ?? "",
        partePassivaId: queixa.pPassivaId.toString(),
        departamentoPassivo: passiva?.departamento ?? "",
        dataEntrada: queixa.dataEntrada.split("T")[0],
        descricao: queixa.descricao,
        estado: queixa.estado ?? "Pendente",
        ficheiro: undefined,
        processoId: queixa.processoId?.toString() ?? "",
      });
    } else {
      const today = new Date().toISOString().split("T")[0];
      setFormData(prev => ({ ...prev, dataEntrada: today }));
    }
  }, [queixa, funcionarios]);


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data: Queixa = {
      dataEntrada: formData.dataEntrada,
      descricao: formData.descricao,
      estado: formData.estado,
      ficheiro: formData.ficheiro || null,
      processoId: formData.processoId ? Number(formData.processoId) : undefined,
      funcionarioId: Number(formData.autorId),
      pPassivaId: Number(formData.partePassivaId),
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição *</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) =>
            setFormData({ ...formData, descricao: e.target.value })
          }
          rows={6}
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dataEntrada">Data de Entrada *</Label>
          <Input
            id="dataEntrada"
            type="date"
            value={formData.dataEntrada}
            onChange={(e) =>
              setFormData({ ...formData, dataEntrada: e.target.value })
            }
             readOnly={!!queixa}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estado">Estado *</Label>

          {queixa ? (
            <Select
              value={formData.estado}
              onValueChange={(value: string) =>
                setFormData({ ...formData, estado: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EmAnalise">Em Análise</SelectItem>
                <SelectItem value="Aceite">Aceite</SelectItem>
                <SelectItem value="Rejeitada">Rejeitada</SelectItem>
              </SelectContent>
            </Select>
          ) : (

            <Input
              value="Pendente"
              readOnly
              className="bg-gray-100 text-gray-700"
            />
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* === AUTOR === */}
        <div className="space-y-2">
          <Label htmlFor="autorId">Autor *</Label>
          <Select
            value={formData.autorId}
            onValueChange={(v: string) => {
              const f = funcionarios?.find(
                fun => fun?.id != null && fun.id.toString() === v
              );

              setFormData({
                ...formData,
                autorId: v,
                departamentoAutor: f?.departamento ?? "",
                partePassivaId:
                  formData.partePassivaId === v ? "" : formData.partePassivaId,
                departamentoPassivo:
                  formData.partePassivaId === v ? "" : formData.departamentoPassivo,
              });
            }}
            disabled={!!queixa} 
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {funcionarios?.map(f =>
                f?.id != null ? (
                  <SelectItem key={f.id} value={f.id.toString()}>
                    {f.nome}
                  </SelectItem>
                ) : null
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="departamentoAutor">Departamento (Autor)</Label>
          <Input
            id="departamentoAutor"
            value={formData.departamentoAutor}
            readOnly
            className="bg-gray-100"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        {/* === PARTE PASSIVA === */}
        <div className="space-y-2">
          <Label htmlFor="partePassivaId">Parte Passiva *</Label>
          <Select
            value={formData.partePassivaId}
            onValueChange={(v: string) => {
              const f = funcionarios?.find(
                fun => fun?.id != null && fun.id.toString() === v
              );

              setFormData({
                ...formData,
                partePassivaId: v,
                departamentoPassivo: f?.departamento ?? "",
              });
            }}
            disabled={!!queixa} 
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {funcionarios
                ?.filter(
                  (f): f is User =>
                    f?.id != null &&
                    f.id.toString() !== formData.autorId
                )
                .map(f => {
                  const id = f.id!;
                  return (
                    <SelectItem key={id} value={id.toString()}>
                      {f.nome}
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="departamentoPassivo">Departamento (Parte Passiva)</Label>
          <Input
            id="departamentoPassivo"
            value={formData.departamentoPassivo}
            readOnly
            className="bg-gray-100"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="processoId">Processo (opcional)</Label>
        <Select
          value={formData.processoId}
          onValueChange={(v: any) =>
            setFormData({ ...formData, processoId: v })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um processo" />
          </SelectTrigger>
          <SelectContent>
            {processos.map((p) => (
              <SelectItem key={p.id} value={p.id.toString()}>
                {p.titulo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ficheiro">Anexo (opcional)</Label>
        <Input
          id="ficheiro"
          type="file"
          accept="application/pdf,image/*"
          onChange={(e) =>
            setFormData({ ...formData, ficheiro: e.target.files?.[0] })
          }
        />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{queixa ? "Atualizar" : "Registrar"} Queixa</Button>
      </div>
    </form>
  );
}
