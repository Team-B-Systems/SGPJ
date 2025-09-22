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
  onSubmit: (data: Queixa | any) => void;
  onCancel: () => void;
}

export function QueixaForm({
  queixa,
  onSubmit,
  onCancel,
}: QueixaFormProps) {
  const { funcionarios, fetchFuncionarios } = useFuncionarios();

  useEffect(() => {
    if (!funcionarios.length) {
      fetchFuncionarios();
    }
  }, [funcionarios.length, fetchFuncionarios]);

  const [formData, setFormData] = useState({
    autorId: "",
    partePassivaId: "",
    departamentoAutor: "",
    departamentoPassivo: "",
    assuntoProcesso: "",
    dataEntrada: (new Date()).toISOString().split("T")[0],
    descricao: "",
    estado: "Pendente",        // valor default do enum
    ficheiro: undefined as File | undefined,
  });

  const isEdit = !!queixa;

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
        assuntoProcesso: queixa.assuntoProcesso ?? "",
        descricao: queixa.descricao,
        estado: queixa.estado ?? "Pendente",
        ficheiro: undefined,
      });
    } else {
      const today = new Date().toISOString().split("T")[0];
      setFormData(prev => ({ ...prev, dataEntrada: today }));
    }
  }, [queixa, funcionarios]);


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data = {
      dataEntrada: formData.dataEntrada,
      descricao: formData.descricao,
      estado: formData.estado,
      assuntoProcesso: formData.assuntoProcesso || undefined,
      ficheiro: formData.ficheiro || null,
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
            disabled
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
        {formData.estado === "Aceite" && (
          <div className="space-y-2">
            <Label htmlFor="assuntoProcesso">Assunto do Processo *</Label>
            <Input
              id="assuntoProcesso"
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, assuntoProcesso: e.target.value })
              }
              required
            />
          </div>
        )}

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
        <Label htmlFor="assuntoProcesso">Assunto do Processo</Label>
        <Input
          id="assuntoProcesso"
          type="text"
          onChange={(e) =>
            setFormData({ ...formData, ficheiro: e.target.files?.[0] })
          }
        />
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
