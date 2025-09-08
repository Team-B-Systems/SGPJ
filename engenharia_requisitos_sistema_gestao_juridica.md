# Engenharia de Requisitos --- Sistema de Gestão Jurídica (Departamento Jurídico)

## 1. Visão Geral

O sistema tem como objetivo centralizar e automatizar a gestão de
processos jurídicos dentro do departamento jurídico de uma organização,
garantindo: - Cadastro de processos e partes envolvidas - Workflow
completo (abertura, andamento, decisão e arquivamento) - Gestão
documental - Controle de prazos e alertas automáticos

## 2. Escopo do Sistema

O sistema deverá abranger tanto processos contenciosos (trabalhistas,
cíveis, tributários, administrativos) quanto consultivos (contratos,
pareceres, estatutos, compliance), além de demandas administrativas
internas.

## 3. Stakeholders

-   Advogados internos
-   Gestores jurídicos
-   Estagiários/assistentes
-   Diretoria/executivos
-   Escritórios terceirizados (acesso restrito)

## 4. Papéis e Permissões

-   **Administrador:** gerencia usuários, permissões e configurações
    globais
-   **Advogado:** cria, edita e acompanha processos, documentos e prazos
-   **Gestor:** valida decisões, acessa relatórios, arquiva processos
-   **Estagiário/Assistente:** auxilia em cadastros e inserção de
    documentos
-   **Diretoria:** acesso apenas a relatórios e visão consolidada

## 5. Taxonomia de Processos

-   **Trabalhista**
    -   Reclamações trabalhistas
    -   Benefícios e subsídios de morte
-   **Cível**
    -   Responsabilidade civil
    -   Fraudes/ações fraudulentas
-   **Societário**
    -   Elaboração e alteração de estatutos
    -   Atas societárias
-   **Contratual**
    -   Contratação de colaboradores e prestadores
    -   Contratos comerciais
-   **Previdenciário/Seguros**
    -   Pensão por morte
    -   Seguros corporativos
-   **Compliance**
    -   Investigações internas
    -   Auditorias de fraude
-   **Administrativo Interno**
    -   Procurações
    -   Consultas internas

## 6. Requisitos Funcionais

1.  Cadastrar processos e partes envolvidas
2.  Definir workflow (abertura → andamento → decisão → arquivamento)
3.  Associar documentos a processos (upload e versionamento)
4.  Controle de prazos com alertas automáticos
5.  Relatórios e dashboards
6.  Perfis de acesso diferenciados
7.  Integrações externas (ERP, tribunais, assinaturas digitais)

## 7. Requisitos Não Funcionais

-   Segurança de dados (LGPD)
-   Interface web responsiva
-   Disponibilidade mínima de 99,5%
-   Escalabilidade (nuvem preferencial)
-   Logs de auditoria

## 8. Modelo de Dados (Simplificado)

-   **Processo** (id, número, tipo, status, partes, prazos)
-   **Parte** (id, nome, CPF/CNPJ, papel no processo)
-   **Documento** (id, tipo, data, versão, processo_id)
-   **Prazo** (id, tipo, data_limite, alerta, processo_id)
-   **Usuário** (id, nome, perfil, permissões)

## 9. Fluxos Principais

-   **Cadastro de processo:** criar processo → vincular partes → anexar
    documentos iniciais
-   **Andamento:** atualizar status → anexar petições/decisões → gerar
    alertas
-   **Decisão:** registrar resultado → vincular parecer/documento →
    comunicar responsáveis
-   **Arquivamento:** gestor valida → processo marcado como encerrado →
    relatórios atualizados

## 10. Critérios de Aceite (Exemplos em Gherkin)

**Cadastro de Processo**

    Dado que sou um advogado logado  
    Quando cadastro um novo processo preenchendo os campos obrigatórios  
    Então o sistema deve salvar o processo e gerar um número interno único

**Controle de Prazos**

    Dado que um prazo está cadastrado para um processo  
    Quando a data estiver a 5 dias do vencimento  
    Então o sistema deve enviar alerta automático ao responsável

## 11. MVP (Produto Mínimo Viável)

-   Cadastro de processos e partes
-   Workflow básico (4 etapas)
-   Upload e associação de documentos
-   Controle de prazos com alertas por e-mail
-   Perfis de acesso (advogado, gestor, estagiário)
-   Relatórios básicos (processos ativos e prazos vencidos)

## 12. Roadmap

-   **Versão 1.0 (MVP):** núcleo funcional (cadastro, workflow, prazos,
    documentos, perfis básicos)
-   **Versão 1.1:** relatórios avançados, integrações ERP
-   **Versão 1.2:** busca avançada em documentos, versionamento
-   **Versão 1.3:** mobile app, API pública

## 13. Backlog Inicial

-   [ ] Cadastro de processo
-   [ ] Cadastro de partes
-   [ ] Upload de documentos
-   [ ] Workflow (abertura → arquivamento)
-   [ ] Controle de prazos com alertas
-   [ ] Perfis de acesso básicos
-   [ ] Relatórios simples
