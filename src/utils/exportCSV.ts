/**
 * Utilitário para exportação de dados em CSV
 */

export interface ExportColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => string | number | null);
}

export const formatCSVValue = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  
  const stringValue = String(value);
  
  // Escapar aspas duplas e envolver em aspas se necessário
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
};

export const generateCSV = <T extends Record<string, unknown>>(
  data: T[],
  columns: ExportColumn<T>[]
): string => {
  // Header
  const headerRow = columns.map(col => formatCSVValue(col.header)).join(',');
  
  // Data rows
  const dataRows = data.map(row => {
    return columns.map(col => {
      let value: unknown;
      
      if (typeof col.accessor === 'function') {
        value = col.accessor(row);
      } else {
        value = row[col.accessor];
      }
      
      return formatCSVValue(value);
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\n');
};

export const downloadCSV = (csvContent: string, filename: string): void => {
  // Adicionar BOM para UTF-8 (para Excel reconhecer caracteres especiais)
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const exportToCSV = <T extends Record<string, unknown>>(
  data: T[],
  columns: ExportColumn<T>[],
  filename: string
): void => {
  const csvContent = generateCSV(data, columns);
  downloadCSV(csvContent, filename);
};

// Funções específicas para exportar dados comuns

export const exportReservas = (reservas: Array<{
  codigo?: string;
  nome_completo: string;
  data_evento: string;
  pacote_tipo: string;
  numero_criancas: number;
  total_calculado: number;
  status: string;
  telefone?: string;
  email?: string;
}>) => {
  const columns: ExportColumn<typeof reservas[0]>[] = [
    { header: 'Código', accessor: 'codigo' },
    { header: 'Cliente', accessor: 'nome_completo' },
    { header: 'Data Evento', accessor: (row) => new Date(row.data_evento).toLocaleDateString('pt-BR') },
    { header: 'Pacote', accessor: 'pacote_tipo' },
    { header: 'Crianças', accessor: 'numero_criancas' },
    { header: 'Valor Total', accessor: (row) => `R$ ${Number(row.total_calculado || 0).toFixed(2)}` },
    { header: 'Status', accessor: 'status' },
    { header: 'Telefone', accessor: 'telefone' },
    { header: 'Email', accessor: 'email' },
  ];
  
  const filename = `reservas_${new Date().toISOString().split('T')[0]}`;
  exportToCSV(reservas, columns, filename);
};

export const exportClientes = (clientes: Array<{
  nome_completo: string;
  cpf_cnpj: string;
  tipo_cadastro: string;
  telefone?: string | null;
  email?: string | null;
  cidade?: string | null;
  total_eventos: number;
  ticket_medio: number;
  status: string;
}>) => {
  const columns: ExportColumn<typeof clientes[0]>[] = [
    { header: 'Nome', accessor: 'nome_completo' },
    { header: 'CPF/CNPJ', accessor: 'cpf_cnpj' },
    { header: 'Tipo', accessor: 'tipo_cadastro' },
    { header: 'Telefone', accessor: 'telefone' },
    { header: 'Email', accessor: 'email' },
    { header: 'Cidade', accessor: 'cidade' },
    { header: 'Total Eventos', accessor: 'total_eventos' },
    { header: 'Ticket Médio', accessor: (row) => `R$ ${row.ticket_medio.toFixed(2)}` },
    { header: 'Status', accessor: 'status' },
  ];
  
  const filename = `clientes_${new Date().toISOString().split('T')[0]}`;
  exportToCSV(clientes, columns, filename);
};

export const exportFinanceiroEventos = (eventos: Array<{
  codigo?: string | null;
  data_evento: string;
  cliente: string;
  totalCache: number;
  totalPago: number;
}>) => {
  const columns: ExportColumn<typeof eventos[0]>[] = [
    { header: 'Código', accessor: 'codigo' },
    { header: 'Data Evento', accessor: (row) => new Date(row.data_evento).toLocaleDateString('pt-BR') },
    { header: 'Cliente', accessor: 'cliente' },
    { header: 'Cachê Total', accessor: (row) => `R$ ${row.totalCache.toFixed(2)}` },
    { header: 'Total Pago', accessor: (row) => `R$ ${row.totalPago.toFixed(2)}` },
    { header: 'Saldo', accessor: (row) => `R$ ${(row.totalCache - row.totalPago).toFixed(2)}` },
  ];
  
  const filename = `financeiro_eventos_${new Date().toISOString().split('T')[0]}`;
  exportToCSV(eventos, columns, filename);
};

export const exportFinanceiroRecreadores = (recreadores: Array<{
  nome: string;
  totalEventos: number;
  totalCache: number;
  totalPago: number;
  saldo: number;
}>) => {
  const columns: ExportColumn<typeof recreadores[0]>[] = [
    { header: 'Recreador', accessor: 'nome' },
    { header: 'Total Eventos', accessor: 'totalEventos' },
    { header: 'Cachê Total', accessor: (row) => `R$ ${row.totalCache.toFixed(2)}` },
    { header: 'Total Pago', accessor: (row) => `R$ ${row.totalPago.toFixed(2)}` },
    { header: 'Saldo a Pagar', accessor: (row) => `R$ ${row.saldo.toFixed(2)}` },
  ];
  
  const filename = `financeiro_recreadores_${new Date().toISOString().split('T')[0]}`;
  exportToCSV(recreadores, columns, filename);
};
