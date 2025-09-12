
import React, { useEffect, useState } from 'react';
import './App.css';
// --- CSS original injetado como string para preservar tudo exatamente ---

// --- Helper to map status class names consistently ---
const statusClassFor = (status) => {
  if (!status) return '';
  return `status-${String(status).replace(/\s+/g, '')}`;
};

// --- Components ---
function Sidebar({ current, setCurrent }) {
  const items = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'processos', label: 'Processos', icon: '📁' },
    { key: 'audiencias', label: 'Reuniões', icon: '📅' },
    { key: 'documentos', label: 'Documentos', icon: '📄' },
    { key: 'usuarios', label: 'Funcionários', icon: '👤' },
    { key: 'relatorios', label: 'Relatórios', icon: '📈' },
    { key: 'configuracoes', label: 'Configurações', icon: '⚙️' }
  ];

  return (
    <div className="sidebar">
      <div className="logo">GESPROC</div>
      <ul className="menu">
        {items.map(it => (
          <li
            key={it.key}
            className={`menu-item ${current === it.key ? 'active' : ''}`}
            data-target={it.key}
            onClick={() => setCurrent(it.key)}
          >
            <i>{it.icon}</i> {it.label}
          </li>
        ))}
        <li className="menu-item" id="logout" onClick={() => { if(window.confirm('Tem certeza que deseja sair?')) alert('Saindo do sistema...'); }}>
          <i>🚪</i> Sair
        </li>
      </ul>
    </div>
  );
}

function Header({ title, notifications = 3, user = { name: 'Genuino Cavquila', role: 'Administrador' } }) {
  return (
    <div className="header">
      <h1 className="page-title">{title}</h1>
      <div className="header-icons">
        <div className="header-icon-item">
          <i className="fa-solid fa-bell">🔔</i>
          <span className="notification-badge">{notifications}</span>
        </div>
        <div className="header-icon-item">
          <i className="fa-solid fa-envelope">✉️</i>
        </div>
        <div className="user-info">
          <div className="user-avatar">{user.name ? user.name.charAt(0) : 'U'}</div>
          <div className="user-details">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div id="dashboard-content" className="content-section active-content">
      <div className="dashboard">
        <div className="card">
          <div className="card-title">Processos Pendentes</div>
          <div className="card-value">24</div>
        </div>
        <div className="card">
          <div className="card-title">Reuniões Hoje</div>
          <div className="card-value">3</div>
        </div>
        <div className="card">
          <div className="card-title">Prazos Próximos</div>
          <div className="card-value">5</div>
        </div>
        <div className="card">
          <div className="card-title">Pendentes</div>
          <div className="card-value">18</div>
        </div>
      </div>

      <div className="table-container">
        <h2>Próximas Reuniões</h2>
        <table>
          <thead>
            <tr>
              <th>Processo</th>
              <th>Cordenador</th>
              <th>Data</th>
              <th>Horário</th>
              <th>Local</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>000123-4</td>
              <td>Maria Silva</td>
              <td>15/08/2023</td>
              <td>14:00</td>
              <td>Caixa 1</td>
            </tr>
            <tr>
              <td>000456-1</td>
              <td>João Santos</td>
              <td>15/08/2023</td>
              <td>16:30</td>
              <td>Caixa 1</td>
            </tr>
            <tr>
              <td>000789-9</td>
              <td>Empresa XYZ</td>
              <td>16/08/2023</td>
              <td>09:00</td>
              <td>Caixa 1</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Processos({ onOpenProcessView }) {
  const processosData = [
    { id: '1', numero: '000123-4', colaborador: 'Maria Silva', dataAbertura: '12/03/2023', progresso: 75, status: 'Pendente' },
    { id: '2', numero: '000456-1', colaborador: 'João Santos', dataAbertura: '05/04/2023', progresso: 40, status: 'Andamento' },
    { id: '3', numero: '000789-9', colaborador: 'Empresa XYZ', dataAbertura: '20/01/2023', progresso: 100, status: 'Arquivado' }
  ];

  return (
    <div id="processos-content" className="content-section">
      <div className="header-actions">
        <h2>Gestão de Processos</h2>
        <button className="btn btn-primary" id="btn-novo-processo">+ Novo Processo</button>
      </div>

      <div className="table-container">
        <h2>Todos os Processos</h2>
        <table>
          <thead>
            <tr>
              <th>Número</th>
              <th>Funcionário</th>
              <th>Data de Abertura</th>
              <th>Prazo</th>
              <th>Estado</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {processosData.map(p => (
              <tr key={p.id} data-id={p.id}>
                <td>{p.numero}</td>
                <td>{p.colaborador}</td>
                <td>{p.dataAbertura}</td>
                <td>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: p.progresso + '%' }}>{/* empty text */}</div>
                  </div>
                </td>
                <td><span className={`status ${statusClassFor(p.status)}`}>{p.status}</span></td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => alert('Carregar Documento (em desenvolvimento)')}>Carregar Documento</button>
                  <button className="btn btn-primary btn-sm" onClick={() => onOpenProcessView(p.id)}>Visualizar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Envolvidos() {
  return (
    <div id="envolvidos-content" className="content-section">
      <h2>Gestão de envolvidos</h2>
      <p>Conteúdo da gestão de envolvidos será exibido aqui.</p>
    </div>
  );
}

function Audiencias({ audiencias, onAddAudiencia }) {
  // audiencias passed from parent
  return (
    <div id="audiencias-content" className="content-section">
      <div className="header-actions">
        <h2>Gestão de Reuniões</h2>
        <button className="btn btn-primary" id="btn-nova-audiencia" onClick={() => onAddAudiencia(null)}>+ Nova Reunião</button>
      </div>

      <div className="table-container">
        <table id="tabela-audiencias">
          <thead>
            <tr>
              <th>Processo</th>
              <th>Data</th>
              <th>Horário</th>
              <th>Local</th>
              <th>Cordenador</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {audiencias.map(a => (
              <tr key={a.id}>
                <td>{a.processo}</td>
                <td>{a.data}</td>
                <td>{a.horario}</td>
                <td>{a.local}</td>
                <td>{a.responsavel}</td>
                <td><span className={`status ${statusClassFor(a.status)}`}>{a.status}</span></td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => alert('Editar audiência: em desenvolvimento')}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => alert('Excluir audiência: em desenvolvimento')}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Documentos({ documentos, onNewDocument }) {
  return (
    <div id="documentos-content" className="content-section">
      <div className="header-actions">
        <h2>Gestão de Documentos</h2>
        <button className="btn btn-success" id="btn-novo-documento" onClick={() => onNewDocument(null)}>+ Novo Documento</button>
      </div>
      <div className="table-container">
        <table id="tabela-documentos">
          <thead>
            <tr>
              <th>Nome do Documento</th>
              <th>Tipo</th>
              <th>Data de Envio</th>
              <th>Anexado a</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {documentos.map(doc => (
              <tr key={doc.id}>
                <td>{doc.nome}</td>
                <td>{doc.tipo}</td>
                <td>{doc.dataEnvio}</td>
                <td>{doc.processo}</td>
                <td>
                  <a href={doc.arquivo} className="btn btn-secondary btn-sm" target="_blank" rel="noreferrer">Visualizar</a>
                  <button className="btn btn-danger btn-sm" onClick={() => alert('Excluir documento em desenvolvimento')}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Usuarios({ usuarios, onAddUser, onEditUser }) {
  const [search, setSearch] = useState('');
  const filtered = usuarios.filter(u => u.nome.toLowerCase().includes(search.toLowerCase()));

  return (
    <div id="usuarios-content" className="content-section">
      <div className="header-actions">
        <h2>Gestão de Funcionários</h2>
        <div>
          <button className="btn btn-primary" id="btn-novo-usuario" onClick={() => onAddUser(null)}>+ Novo Funcionário</button>
        </div>
      </div>

      <div className="search-box">
        <input type="text" className="search-input" placeholder="Pesquisar Funcionários..." value={search} onChange={e => setSearch(e.target.value)} />
        <button className="btn btn-secondary" onClick={() => {}} >Buscar</button>
      </div>

      <br />

      <div className="table-container">
        <table id="tabela-usuarios">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Perfil</th>
              <th>Status</th>
              <th>Último Acesso</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>{u.nome}</td>
                <td>{u.email}</td>
                <td><span className={`role-badge role-${u.perfil}`}>{u.perfil}</span></td>
                <td><span className={`status ${statusClassFor(u.status)}`}>{u.status}</span></td>
                <td>{u.ultimoAcesso}</td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => onEditUser(u.id)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => { if(window.confirm('Tem certeza que deseja excluir este usuário?')) alert('Usuário excluído com sucesso!'); }}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Relatorios() {
  return (
    <div id="relatorios-content" className="content-section">
      <div className="header-actions">
        <h2>Gestão de Relatórios</h2>
      </div>

      <div className="form-container">
        <form id="form-relatorio" onSubmit={(e) => { e.preventDefault(); alert('Relatório gerado (simulação)'); }}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="relatorio-tipo">Tipo de Relatório</label>
              <select id="relatorio-tipo">
                <option value="processos">Relatório de Processos</option>
                <option value="envolvidos">Relatório de envolvidos</option>
                <option value="documentos">Relatório de Documentos</option>
                <option value="usuarios">Relatório de Funcionários</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="relatorio-periodo">Período</label>
              <input type="text" id="relatorio-periodo" placeholder="Ex: Últimos 30 dias" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="relatorio-responsavel">Responsável</label>
              <select id="relatorio-responsavel">
                <option value="">Todos</option>
                <option value="ana">Ana Silva</option>
                <option value="carlos">Carlos Santos</option>
                <option value="mariana">Mariana Oliveira</option>
              </select>
            </div>
            <div className="form-group" style={{ alignSelf: 'flex-end' }}>
              <button type="submit" className="btn btn-primary">Gerar Relatório</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Modals ---
function Modal({ id, title, children, isOpen, onClose }) {
  return (
    <div className="modal" id={id} style={{ display: isOpen ? 'flex' : 'none' }} onClick={(e) => { if (e.target.classList && e.target.classList.contains('modal')) onClose(); }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  // inject CSS once
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'gesproc-original-css';
    document.head.appendChild(style);
    return () => {
      const s = document.getElementById('gesproc-original-css');
      if (s) s.remove();
    };
  }, []);

  const [current, setCurrent] = useState('dashboard');
  const [pageTitle, setPageTitle] = useState('Dashboard');

  useEffect(() => {
    // map current key to title (same labels as sidebar)
    const map = {
      dashboard: 'Dashboard',
      processos: 'Processos',
      audiencias: 'Reuniões',
      documentos: 'Documentos',
      usuarios: 'Funcionários',
      relatorios: 'Relatórios',
      configuracoes: 'Configurações'
    };
    setPageTitle(map[current] || 'Dashboard');
  }, [current]);

  // Modal states
  const [modalState, setModalState] = useState({
    processo: false,
    documento: false,
    audiencia: false,
    usuario: false,
    viewProcesso: false
  });

  // Data (could be moved to backend later)
  const [usuarios, setUsuarios] = useState([
    { id: 1, nome: 'Genuino Cavquila', email: 'cavuquila@escritorio.com', perfil: 'admin', status: 'Pendente', ultimoAcesso: '15/08/2023 14:30' },
    { id: 2, nome: 'Vilma Cajama', email: 'viltrudes@escritorio.com', perfil: 'Técnico Jurídico', status: 'Pendente', ultimoAcesso: '15/08/2023 09:15' },
    { id: 3, nome: 'Kenedy Bundi', email: 'kenedi@gmail.com', perfil: 'estagiario', status: 'Pendente', ultimoAcesso: '14/08/2023 16:45' },
    { id: 4, nome: 'Tchipita Armadon', email: 'armando@escritorio.com', perfil: 'secretario', status: 'inPendente', ultimoAcesso: '10/08/2023 11:20' }
  ]);

  const [audiencias, setAudiencias] = useState(() => JSON.parse(localStorage.getItem('audiencias')) || [
    { id: 1, processo: '000123-4', cliente: 'Maria Silva', data: '2023-08-15', horario: '14:00', local: 'Caixa 2', responsavel: 'Ana Silva', status: 'Concluída' },
    { id: 2, processo: '000456-1', cliente: 'João Santos', data: '2023-08-15', horario: '16:30', local: 'Caixa 1', responsavel: 'Carlos Santos', status: 'Agendada' },
    { id: 3, processo: '000789-9', cliente: 'Empresa XYZ', data: '2023-08-16', horario: '09:00', local: 'Caixa 1', responsavel: 'Ana Silva', status: 'Agendada' }
  ]);

  useEffect(() => {
    localStorage.setItem('audiencias', JSON.stringify(audiencias));
  }, [audiencias]);

  const [documentos, setDocumentos] = useState([
    { id: 1, nome: 'Contrato de Prestação de Serviços', tipo: 'Contrato', dataEnvio: '10/08/2023', processo: '000123-4', arquivo: '#' },
    { id: 2, nome: 'Petição Inicial', tipo: 'Petição', dataEnvio: '11/08/2023', processo: '000456-1', arquivo: '#' },
    { id: 3, nome: 'Cópia da Identidade de João Santos', tipo: 'Identidade', dataEnvio: '11/08/2023', processo: '000456-1', arquivo: '#' }
  ]);

  // viewProcesso data
  const [viewProcessoData, setViewProcessoData] = useState(null);

  function abrirModal(key) {
    setModalState(prev => ({ ...prev, [key]: true }));
    document.body.style.overflow = 'hidden';
  }
  function fecharModal(key) {
    setModalState(prev => ({ ...prev, [key]: false }));
    document.body.style.overflow = 'auto';
  }

  function handleAddAudiencia() {
    abrirModal('audiencia');
  }

  function handleNewDocumento() {
    abrirModal('documento');
  }

  function handleAddUsuario() {
    abrirModal('usuario');
  }

  function handleEditUsuario(id) {
    // open modal and populate (simple alert for now)
    abrirModal('usuario');
    alert('Edição de usuário: funcionalidade de preenchimento do formulário em desenvolvimento');
  }

  function handleOpenProcessView(id) {
    const processosData = [
      { id: '1', numero: '000123-4', cliente: 'Maria Silva', dataAbertura: '12/03/2023', status: 'Pendente', progresso: 75 },
      { id: '2', numero: '000456-1', cliente: 'João Santos', dataAbertura: '05/04/2023', status: 'Andamento', progresso: 40 },
      { id: '3', numero: '000789-9', cliente: 'Empresa XYZ', dataAbertura: '20/01/2023', status: 'Arquivado', progresso: 100 }
    ];
    const proc = processosData.find(p => p.id === id);
    if (proc) {
      setViewProcessoData(proc);
      abrirModal('viewProcesso');
    } else {
      alert('Processo não encontrado!');
    }
  }

  // handlers for forms (processo, audiencia, documento, usuario)
  function handleSubmitProcesso(e) {
    e.preventDefault();
    alert('Processo salvo com sucesso!');
    fecharModal('processo');
  }

  function handleSubmitUsuario(e) {
    e.preventDefault();
    alert('Usuário salvo com sucesso!');
    fecharModal('usuario');
  }

  function handleSubmitAudiencia(e) {
    e.preventDefault();
    const form = e.target;
    const nova = {
      id: audiencias.length > 0 ? Math.max(...audiencias.map(a => a.id)) + 1 : 1,
      processo: form['audiencia-processo'].value,
      data: form['audiencia-data'].value,
      horario: form['audiencia-horario'].value,
      local: form['audiencia-local'].value,
      responsavel: form['audiencia-responsavel'].value,
      status: form['audiencia-status'].value
    };
    setAudiencias(prev => [...prev, nova]);
    fecharModal('audiencia');
    form.reset();
  }

  function handleSubmitDocumento(e) {
    e.preventDefault();
    const form = e.target;
    const arquivoInput = form['documento-arquivo'];
    const arquivoObj = arquivoInput.files && arquivoInput.files[0] ? URL.createObjectURL(arquivoInput.files[0]) : '#';
    const novo = {
      id: documentos.length > 0 ? Math.max(...documentos.map(d => d.id)) + 1 : 1,
      nome: form['documento-nome'].value,
      tipo: form['documento-tipo'].value,
      dataEnvio: new Date().toLocaleDateString('pt-BR'),
      processo: form['documento-processo'].value,
      arquivo: arquivoObj
    };
    setDocumentos(prev => [...prev, novo]);
    fecharModal('documento');
    alert('Documento salvo com sucesso!');
    form.reset();
  }

  return (
    <div className="container">
      <Sidebar current={current} setCurrent={setCurrent} />

      <div className="main-content">
        <Header title={pageTitle} />

        {/* Render sections conditionally but keep classNames identical to original */}
        {current === 'dashboard' && <Dashboard />}
        {current === 'processos' && <Processos onOpenProcessView={handleOpenProcessView} />}
        {current === 'audiencias' && <Audiencias audiencias={audiencias} onAddAudiencia={handleAddAudiencia} />}
        {current === 'documentos' && <Documentos documentos={documentos} onNewDocument={handleNewDocumento} />}
        {current === 'usuarios' && <Usuarios usuarios={usuarios} onAddUser={handleAddUsuario} onEditUser={handleEditUsuario} />}
        {current === 'relatorios' && <Relatorios />}

        {/* Envolvidos (static placeholder) */}
        {current === 'configuracoes' && <Envolvidos />}

      </div>

      {/* Modals (kept in DOM but controlled via state) */}
      <Modal id="modal-processo" title="Novo Processo" isOpen={modalState.processo} onClose={() => fecharModal('processo')}>
        <form id="form-processo" onSubmit={handleSubmitProcesso}>
          <div className="form-group">
            <label htmlFor="tipo-processo">Tipo de Processo</label>
            <select id="tipo-processo" name="tipo-processo" required>
              <option value="">Selecione um Processo</option>
              <option value="subsidio">Atribuição de Subsidio de Morte</option>
              <option value="disciplinar">Processo disciplinar</option>
            </select>
          </div>

          <div className="form-buttons">
            <button type="button" className="btn btn-secondary" onClick={() => fecharModal('processo')}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Salvar Processo</button>
          </div>
        </form>
      </Modal>

      <Modal id="modal-documento" title="Novo Documento" isOpen={modalState.documento} onClose={() => fecharModal('documento')}>
        <form id="form-documento" onSubmit={handleSubmitDocumento}>
          <input type="hidden" id="documento-id" />
          <div className="form-group">
            <label htmlFor="documento-nome">Nome do Documento</label>
            <input type="text" id="documento-nome" name="documento-nome" required />
          </div>
          <div className="form-group">
            <label htmlFor="documento-tipo">Tipo de Documento</label>
            <input type="text" id="documento-tipo" name="documento-tipo" placeholder="Ex: Contrato, Petição, Identidade" required />
          </div>
          <div className="form-group">
            <label htmlFor="documento-processo">Anexar a qual Processo?</label>
            <input type="text" id="documento-processo" name="documento-processo" placeholder="Número do processo (Ex: 000123-4)" required />
          </div>
          <div className="form-group">
            <label htmlFor="documento-arquivo">Carregar Arquivo</label>
            <input type="file" id="documento-arquivo" name="documento-arquivo" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={() => fecharModal('documento')}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Salvar Documento</button>
          </div>
        </form>
      </Modal>

      <Modal id="modal-audiencia" title="Nova Audiência" isOpen={modalState.audiencia} onClose={() => fecharModal('audiencia')}>
        <form id="form-audiencia" onSubmit={handleSubmitAudiencia}>
          <input type="hidden" id="audiencia-id" />
          <div className="form-group">
            <label htmlFor="audiencia-processo">Número do Processo</label>
            <input type="text" id="audiencia-processo" name="audiencia-processo" placeholder="Ex: 000123-4" required />
          </div>
          <div className="form-group">
            <label htmlFor="audiencia-data">Data</label>
            <input type="date" id="audiencia-data" name="audiencia-data" required />
          </div>
          <div className="form-group">
            <label htmlFor="audiencia-horario">Horário</label>
            <input type="time" id="audiencia-horario" name="audiencia-horario" required />
          </div>
          <div className="form-group">
            <label htmlFor="audiencia-local">Local</label>
            <input type="text" id="audiencia-local" name="audiencia-local" placeholder="Ex: 2ª Vara Cível, Tribunal de Família" required />
          </div>
          <div className="form-group">
            <label htmlFor="audiencia-responsavel">Responsável</label>
            <select id="audiencia-responsavel" name="audiencia-responsavel" required>
              <option value="">Selecione um Técnico Jurídico</option>
              <option value="ana">Ana Silva</option>
              <option value="carlos">Carlos Santos</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="audiencia-status">Status</label>
            <select id="audiencia-status" name="audiencia-status" required>
              <option value="Agendada">Agendada</option>
              <option value="Concluída">Concluída</option>
              <option value="Remarcada">Remarcada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={() => fecharModal('audiencia')}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Salvar Audiência</button>
          </div>
        </form>
      </Modal>

      <Modal id="modal-usuario" title="Novo Funcionário" isOpen={modalState.usuario} onClose={() => fecharModal('usuario')}>
        <form id="form-usuario" onSubmit={handleSubmitUsuario}>
          <input type="hidden" id="usuario-id" />
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="usuario-nome">Nome Completo</label>
              <input type="text" id="usuario-nome" name="usuario-nome" required />
            </div>
            <div className="form-group">
              <label htmlFor="usuario-email">Email</label>
              <input type="email" id="usuario-email" name="usuario-email" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="usuario-perfil">Perfil</label>
              <select id="usuario-perfil" name="usuario-perfil" required>
                <option value="">Selecione um perfil</option>
                <option value="admin">Administrador</option>
                <option value="Técnico Jurídico">Técnico Juridico</option>
                <option value="estagiario">Chefe Departamento</option>
                <option value="secretario">Outro</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="usuario-status">Estado</label>
              <select id="usuario-status" name="usuario-status" required>
                <option value="Pendente">Activo</option>
                <option value="inPendente">Desativo</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="usuario-senha">Senha</label>
              <input type="password" id="usuario-senha" name="usuario-senha" />
              <small>Deixe em branco para manter a senha atual</small>
            </div>
            <div className="form-group">
              <label htmlFor="usuario-confirmar-senha">Confirmar Senha</label>
              <input type="password" id="usuario-confirmar-senha" name="usuario-confirmar-senha" />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={() => fecharModal('usuario')}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar</button>
          </div>
        </form>
      </Modal>

      <Modal id="modal-view-processo" title="Detalhes do Processo" isOpen={modalState.viewProcesso} onClose={() => fecharModal('viewProcesso')}>
        <div id="processo-details-content">
          {viewProcessoData ? (
            <>
              <div className="form-group"><strong>Nº do Processo:</strong> <span id="view-proc-numero">{viewProcessoData.numero}</span></div>
              <div className="form-group"><strong>Envolvido:</strong> <span id="view-proc-cliente">{viewProcessoData.cliente}</span></div>
              <div className="form-group"><strong>Data de Abertura:</strong> <span id="view-proc-data">{viewProcessoData.dataAbertura}</span></div>
              <div className="form-group"><strong>Estado:</strong> <span id="view-proc-status">{viewProcessoData.status}</span></div>
              <div className="form-group"><strong>Prazo:</strong>
                <div className="progress-bar-container">
                  <div id="view-proc-progress" className="progress-bar" style={{ width: (viewProcessoData.progresso || 0) + '%' }}>{(viewProcessoData.progresso || 0) + '%'}</div>
                </div>
              </div>
            </>
          ) : (
            <div>Carregando...</div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <button type="button" className="btn btn-secondary" onClick={() => fecharModal('viewProcesso')}>Fechar</button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
