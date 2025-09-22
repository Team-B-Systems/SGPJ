import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import {
    Archive,
    AlertTriangle,
    FileCheck,
    Calendar,
    User,
    X,
    File,
    Upload
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Processo } from '../../lib/api';

interface ArchiveProcessFormProps {
    processo: Processo;
    onSubmit: (archiveData: {
        decisaoDiretora: string;
        motivoArquivamento: string;
        observacoes: string;
        dataDecisao: string;
        numeroDespacho?: string;
        ficheiro: File;
    }) => void;
    onCancel: () => void;
}

export function ArchiveProcessForm({ processo, onSubmit, onCancel }: ArchiveProcessFormProps) {
    const [formData, setFormData] = useState({
        decisaoDiretora: '',
        titulo: '',
        motivoArquivamento: '',
        observacoes: '',
        dataDecisao: new Date().toISOString().split('T')[0],
        numeroDespacho: '',
        tamanho: -1,
        ficheiro: new Object() as File,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const motivosArquivamento = [
        'Processo concluído com sucesso',
        'Processo indeferido',
        'Processo cancelado a pedido',
        'Processo transferido para outra instância',
        'Processo arquivado por falta de documentação',
        'Processo arquivado por prescrição',
        'Outro motivo'
    ];

    const removeFile = () => {
        setSelectedFile(null);
        setFormData({
            ...formData,
            titulo: '',
            tamanho: -1,
        });
        setErrors({
            ...errors,
            ficheiro: ''
        })
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.decisaoDiretora.trim()) {
            newErrors.decisaoDiretora = 'A decisão da diretora é obrigatória';
        } else if (formData.decisaoDiretora.length < 10) {
            newErrors.decisaoDiretora = 'A decisão deve ter pelo menos 10 caracteres';
        }

        if (!formData.motivoArquivamento) {
            newErrors.motivoArquivamento = 'Selecione um motivo para o arquivamento';
        }

        if (!formData.dataDecisao) {
            newErrors.dataDecisao = 'A data da decisão é obrigatória';
        }

        if (formData.tamanho === -1) {
            newErrors.ficheiro = 'Selecione um arquivo PDF';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            // Check if file is PDF
            if (file.type !== 'application/pdf') {
                // Add to errors this: 'Apenas arquivos PDF são permitidos'
                setErrors({
                    ...errors,
                    ficheiro: 'Apenas arquivos PDF são permitidos',
                });
                setSelectedFile(null)
                setSelectedFile(null);
                return;
            }

            // Check file size (limit to 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setErrors({
                    ...errors,
                    ficheiro: 'Arquivo muito grande. Limite máximo: 10MB',
                });
                setSelectedFile(null);
                return;
            }

            setSelectedFile(file);
            setFormData({
                ...formData,
                tamanho: file.size,
                ficheiro: file,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            onSubmit(formData);
        } catch (error) {
            console.error('Erro ao arquivar processo:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Process Info */}
            <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileCheck className="w-5 h-5 text-blue-600" />
                        Processo a ser Arquivado
                    </CardTitle>
                    <CardDescription>
                        Confirme os dados do processo antes de proceder com o arquivamento
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Número do Processo</p>
                            <p className="font-mono font-semibold">{processo.numeroProcesso}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Estado Atual</p>
                            <Badge variant="secondary">{processo.estado}</Badge>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Título</p>
                        <p className="font-medium">{processo.tipoProcesso}-{processo.assunto}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Responsável</p>
                            <p>{processo.responsavel.nome}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Data de Abertura</p>
                            <p>{new Date(processo.dataAbertura).toLocaleDateString('pt-BR')}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription>
                    <strong>Atenção:</strong> O arquivamento de um processo é uma ação irreversível.
                    Certifique-se de que todas as informações estão corretas antes de confirmar.
                </AlertDescription>
            </Alert>

            {/* Archive Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Decisão da Diretora */}
                <div className="space-y-2">
                    <Label htmlFor="decisaoDiretora" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Decisão da Diretora *
                    </Label>
                    <Textarea
                        id="decisaoDiretora"
                        placeholder="Descreva a decisão da diretora que fundamenta o arquivamento deste processo..."
                        value={formData.decisaoDiretora}
                        onChange={(e) => setFormData({ ...formData, decisaoDiretora: e.target.value })}
                        className={errors.decisaoDiretora ? 'border-red-300 focus:border-red-500' : ''}
                        rows={4}
                        maxLength={1000}
                    />
                    <div className="flex justify-between items-center">
                        {errors.decisaoDiretora ? (
                            <p className="text-sm text-red-600">{errors.decisaoDiretora}</p>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Mínimo 10 caracteres. Descreva a decisão de forma clara e objetiva.
                            </p>
                        )}
                        <span className="text-sm text-muted-foreground">
                            {formData.decisaoDiretora.length}/1000
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Motivo do Arquivamento */}
                    <div className="space-y-2">
                        <Label htmlFor="motivoArquivamento">
                            Motivo do Arquivamento *
                        </Label>
                        <Select
                            value={formData.motivoArquivamento}
                            onValueChange={(value: any) => setFormData({ ...formData, motivoArquivamento: value })}
                        >
                            <SelectTrigger className={errors.motivoArquivamento ? 'border-red-300 focus:border-red-500' : ''}>
                                <SelectValue placeholder="Selecione o motivo" />
                            </SelectTrigger>
                            <SelectContent>
                                {motivosArquivamento.map((motivo) => (
                                    <SelectItem key={motivo} value={motivo}>
                                        {motivo}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.motivoArquivamento && (
                            <p className="text-sm text-red-600">{errors.motivoArquivamento}</p>
                        )}
                    </div>

                    {/* Data da Decisão */}
                    <div className="space-y-2">
                        <Label htmlFor="dataDecisao" className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Data da Decisão *
                        </Label>
                        <Input
                            id="dataDecisao"
                            type="date"
                            value={(new Date()).toISOString().split('T')[0]}
                            className={errors.dataDecisao ? 'border-red-300 focus:border-red-500' : ''}
                            disabled
                        />
                        {errors.dataDecisao && (
                            <p className="text-sm text-red-600">{errors.dataDecisao}</p>
                        )}
                    </div>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                    <Label>Arquivo PDF *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        {!selectedFile ? (
                            <div className="text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="mt-4">
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <span className="text-sm font-medium text-primary hover:text-primary/80">
                                            Clique para selecionar um arquivo
                                        </span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            accept=".pdf"
                                            className="sr-only"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Apenas arquivos PDF até 10MB
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <File className="h-8 w-8 text-red-500" />
                                    <div>
                                        <p className="text-sm font-medium">{selectedFile.name}</p>
                                        <p className="text-xs text-gray-500">{formData.tamanho}</p>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={removeFile}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 sm:flex-none"
                    >
                        {isLoading ? (
                            <>
                                <Archive className="w-4 h-4 mr-2 animate-pulse" />
                                Arquivando...
                            </>
                        ) : (
                            <>
                                <Archive className="w-4 h-4 mr-2" />
                                Confirmar Arquivamento
                            </>
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 sm:flex-none"
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
}