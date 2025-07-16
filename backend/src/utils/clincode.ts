export function gerarClincode(tamanho = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < tamanho; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
} 