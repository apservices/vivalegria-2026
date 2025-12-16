// CSV Import Utilities

export interface RecreadorCSVRow {
  registro: string;
  nome_completo: string;
  apelido: string;
  cpf: string;
  data_nascimento: string;
  telefone: string;
  email: string;
  endereco: string;
  transporte: string;
  pix_chave: string;
  experiencia_tempo: string;
  faixa_etaria_experiencia: string;
  habilidades: Record<string, string>;
  formacao: string;
  cursos: string;
  por_que_recreacao: string;
  experiencia_sucesso: string;
  referencia_profissional: string;
  uniformes: {
    calca: string;
    camiseta: string;
    macacao: string;
  };
  tem_cnpj: boolean;
  frequencia_desejada: string;
  interesse_pacotes: boolean;
  quer_mais_oportunidades: string;
  interesses_curto_longo_prazo: string;
}

export interface ReclamacaoCSVRow {
  data_abertura: string;
  responsavel_abertura: string;
  nome_cliente: string;
  telefone_cliente: string;
  descricao: string;
  protocolo: string;
  codigo_evento_externo: string;
}

export interface PesquisaCSVRow {
  data: string;
  nps_score: number;
  qualidade_recreacao: number;
  satisfacao_profissionais: number;
  contrataria_novamente: boolean;
  sugestoes: string;
  nome_cliente: string;
}

// Parse CSV string to array of objects
export function parseCSV(csvText: string): string[][] {
  const lines: string[][] = [];
  let currentLine: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++; // Skip next quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentLine.push(currentField.trim());
        currentField = '';
      } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
        currentLine.push(currentField.trim());
        if (currentLine.length > 1 || currentLine[0] !== '') {
          lines.push(currentLine);
        }
        currentLine = [];
        currentField = '';
        if (char === '\r') i++; // Skip \n
      } else if (char !== '\r') {
        currentField += char;
      }
    }
  }

  // Don't forget the last field/line
  if (currentField || currentLine.length > 0) {
    currentLine.push(currentField.trim());
    if (currentLine.length > 1 || currentLine[0] !== '') {
      lines.push(currentLine);
    }
  }

  return lines;
}

// Convert skill level text to number
function parseSkillLevel(text: string): string {
  if (!text) return "0";
  if (text.includes("Nível 3") || text.includes("Avançado")) return "3";
  if (text.includes("Nível 2") || text.includes("Intermediário")) return "2";
  if (text.includes("Nível 1") || text.includes("Básico")) return "1";
  return "0";
}

// Parse date from various formats
function parseDate(dateStr: string): string | null {
  if (!dateStr) return null;
  
  // Try DD/MM/YYYY
  const ddmmyyyy = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (ddmmyyyy) {
    const [, day, month, year] = ddmmyyyy;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  // Try "mon. DD, YYYY" format
  const months: Record<string, string> = {
    'jan': '01', 'fev': '02', 'mar': '03', 'abr': '04',
    'mai': '05', 'jun': '06', 'jul': '07', 'ago': '08',
    'set': '09', 'out': '10', 'nov': '11', 'dez': '12'
  };
  
  const monthMatch = dateStr.match(/(\w{3})\.\s*(\d{1,2}),\s*(\d{4})/);
  if (monthMatch) {
    const [, monthStr, day, year] = monthMatch;
    const month = months[monthStr.toLowerCase()] || '01';
    return `${year}-${month}-${day.padStart(2, '0')}`;
  }
  
  return null;
}

// Parse recreadores CSV
export function parseRecreadoresCSV(rows: string[][]): RecreadorCSVRow[] {
  if (rows.length < 2) return [];
  
  const headers = rows[0];
  const dataRows = rows.slice(1);
  
  return dataRows.map(row => {
    // Map column indices
    const getCol = (name: string) => {
      const idx = headers.findIndex(h => h.toLowerCase().includes(name.toLowerCase()));
      return idx >= 0 ? row[idx] || '' : '';
    };
    
    // Parse habilidades
    const habilidades: Record<string, string> = {};
    const habilidadeKeys = [
      { key: 'recreacao_infantil', search: 'Recreação infantil' },
      { key: 'musicas_dancas', search: 'Músicas e Danças' },
      { key: 'escultura_baloes', search: 'Escultura com Balões' },
      { key: 'pintura_tela', search: 'Pintura Artística em Tela' },
      { key: 'pintura_facial', search: 'Pintura Facial' },
      { key: 'oficina_micanga', search: 'Oficina Miçanga' },
      { key: 'oficina_slime', search: 'Oficina Slime' },
      { key: 'noite_pijama', search: 'Noite Pijama' },
      { key: 'oficina_cupcake', search: 'Oficina Cupcake' },
      { key: 'confeiteiros', search: 'Confeiteiros' },
      { key: 'baladinha_kids', search: 'Baladinha Kids' },
      { key: 'musicalizacao', search: 'Músicalização' },
      { key: 'area_baby', search: 'Área Baby' },
      { key: 'camarim_fashion', search: 'Camarim Fashion' },
      { key: 'jardinagem', search: 'Jardinagem' },
      { key: 'malabarismo', search: 'Malabarismo' },
      { key: 'show_magicas', search: 'Show de Mágicas' },
      { key: 'artes_cenicas', search: 'Artes Cênicas' },
    ];
    
    habilidadeKeys.forEach(({ key, search }) => {
      const idx = headers.findIndex(h => h.includes(search));
      if (idx >= 0) {
        habilidades[key] = parseSkillLevel(row[idx] || '');
      }
    });
    
    // Parse uniformes
    const uniformeCalcaIdx = headers.findIndex(h => h.includes('Calça'));
    const uniformeCamisetaIdx = headers.findIndex(h => h.includes('Camiseta'));
    const uniformeMacacaoIdx = headers.findIndex(h => h.includes('Macacão'));
    
    return {
      registro: getCol('Registro'),
      nome_completo: getCol('Nome completo'),
      apelido: getCol('Apelido'),
      cpf: getCol('CPF'),
      data_nascimento: parseDate(getCol('Nascimento')) || '',
      telefone: getCol('Telefone') || getCol('Whatsapp'),
      email: getCol('e-mail'),
      endereco: getCol('Endereço residencial'),
      transporte: getCol('transporte'),
      pix_chave: row[headers.findIndex(h => h.includes('PIX para pagamento'))] || '',
      experiencia_tempo: getCol('Tempo de experiência'),
      faixa_etaria_experiencia: getCol('Faixa etária'),
      habilidades,
      formacao: getCol('Formação Acadêmica'),
      cursos: getCol('Cursos'),
      por_que_recreacao: getCol('escolheu trabalhar'),
      experiencia_sucesso: getCol('grande sucesso'),
      referencia_profissional: getCol('referências profissionais'),
      uniformes: {
        calca: uniformeCalcaIdx >= 0 ? row[uniformeCalcaIdx] || '' : '',
        camiseta: uniformeCamisetaIdx >= 0 ? row[uniformeCamisetaIdx] || '' : '',
        macacao: uniformeMacacaoIdx >= 0 ? row[uniformeMacacaoIdx] || '' : ''
      },
      tem_cnpj: getCol('CNPJ').toLowerCase().includes('sim'),
      frequencia_desejada: getCol('frequência'),
      interesse_pacotes: getCol('pacotes').toLowerCase().includes('sim'),
      quer_mais_oportunidades: getCol('mais oportunidades'),
      interesses_curto_longo_prazo: getCol('curto e longo prazo')
    };
  }).filter(r => r.nome_completo);
}

// Parse reclamações CSV
export function parseReclamacoesCSV(rows: string[][]): ReclamacaoCSVRow[] {
  if (rows.length < 2) return [];
  
  const headers = rows[0];
  const dataRows = rows.slice(1);
  
  return dataRows.map(row => {
    const getCol = (idx: number) => row[idx] || '';
    
    return {
      data_abertura: parseDate(getCol(0)) || new Date().toISOString().split('T')[0],
      responsavel_abertura: getCol(1),
      nome_cliente: getCol(2),
      telefone_cliente: getCol(3),
      descricao: getCol(4),
      protocolo: getCol(5),
      codigo_evento_externo: getCol(7)
    };
  }).filter(r => r.descricao || r.nome_cliente);
}

// Parse pesquisas CSV
export function parsePesquisasCSV(rows: string[][]): PesquisaCSVRow[] {
  if (rows.length < 2) return [];
  
  const dataRows = rows.slice(1);
  
  return dataRows.map(row => {
    return {
      data: parseDate(row[0]) || new Date().toISOString().split('T')[0],
      nps_score: parseInt(row[1]) || 0,
      qualidade_recreacao: parseInt(row[2]) || 0,
      satisfacao_profissionais: parseInt(row[3]) || 0,
      contrataria_novamente: row[4]?.toLowerCase() === 'sim',
      sugestoes: row[5] || '',
      nome_cliente: row[6] || ''
    };
  }).filter(r => r.nome_cliente || r.nps_score > 0);
}

// Convert parsed data to Supabase insert format
export function recreadorToSupabase(data: RecreadorCSVRow) {
  return {
    registro: data.registro || null,
    nome_completo: data.nome_completo,
    apelido: data.apelido || null,
    cpf: data.cpf || null,
    data_nascimento: data.data_nascimento || null,
    telefone: data.telefone || null,
    email: data.email || null,
    endereco: data.endereco || null,
    transporte: data.transporte || null,
    pix_chave: data.pix_chave || null,
    experiencia_tempo: data.experiencia_tempo || null,
    faixa_etaria_experiencia: data.faixa_etaria_experiencia || null,
    habilidades: data.habilidades,
    formacao: data.formacao || null,
    cursos: data.cursos || null,
    por_que_recreacao: data.por_que_recreacao || null,
    experiencia_sucesso: data.experiencia_sucesso || null,
    referencia_profissional: data.referencia_profissional || null,
    uniformes: data.uniformes,
    tem_cnpj: data.tem_cnpj,
    frequencia_desejada: data.frequencia_desejada || null,
    interesse_pacotes: data.interesse_pacotes,
    quer_mais_oportunidades: data.quer_mais_oportunidades || null,
    interesses_curto_longo_prazo: data.interesses_curto_longo_prazo || null,
    status: 'ativo'
  };
}

export function reclamacaoToSupabase(data: ReclamacaoCSVRow, reservaId?: string) {
  // Determine category based on description
  let categoria = 'Outros';
  const desc = data.descricao.toLowerCase();
  if (desc.includes('atras') || desc.includes('pontual') || desc.includes('hora')) {
    categoria = 'Pontualidade';
  } else if (desc.includes('comportamento') || desc.includes('postura') || desc.includes('atitude')) {
    categoria = 'Comportamento do Recreador';
  } else if (desc.includes('qualidade') || desc.includes('serviço')) {
    categoria = 'Qualidade do Serviço';
  } else if (desc.includes('comunicação') || desc.includes('contato') || desc.includes('atend')) {
    categoria = 'Comunicação';
  } else if (desc.includes('material') || desc.includes('equipamento')) {
    categoria = 'Materiais/Equipamentos';
  }

  return {
    protocolo: data.protocolo || 'TEMP',
    reserva_id: reservaId || '00000000-0000-0000-0000-000000000000', // Placeholder
    categoria,
    descricao: data.descricao,
    status: 'resolvido', // Historical data
    responsavel_abertura: data.responsavel_abertura || null,
    nome_cliente: data.nome_cliente || null,
    telefone_cliente: data.telefone_cliente || null,
    codigo_evento_externo: data.codigo_evento_externo || null,
    created_at: data.data_abertura ? new Date(data.data_abertura).toISOString() : new Date().toISOString()
  };
}

export function pesquisaToSupabase(data: PesquisaCSVRow) {
  return {
    token: `IMPORT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    respostas: {
      nps_score: data.nps_score,
      qualidade_recreacao: data.qualidade_recreacao,
      satisfacao_profissionais: data.satisfacao_profissionais,
      contrataria_novamente: data.contrataria_novamente,
      sugestoes: data.sugestoes,
      nome_cliente: data.nome_cliente,
      imported: true,
      import_date: new Date().toISOString()
    },
    created_at: data.data ? new Date(data.data).toISOString() : new Date().toISOString()
  };
}