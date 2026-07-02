# Imagens dos produtos

O site já está pronto para GitHub Pages. Os produtos, descrições, categorias, busca, filtros e botões de WhatsApp já estão configurados.

## Para baixar as imagens localmente

Antes de subir ao GitHub, execute no PowerShell, dentro desta pasta:

```powershell
powershell -ExecutionPolicy Bypass -File .\baixar-imagens-e-atualizar.ps1
```

O script faz três coisas:

1. baixa todas as imagens do CDN da Hostinger/Zyro para `assets/produtos/`;
2. atualiza `products-data.js` para apontar para os arquivos locais;
3. gera um log em `data/download-imagens-log.txt`.

Depois disso, suba todos os arquivos para o GitHub.

## Observação

As URLs das imagens vieram dos arquivos `parte1.txt` e `parte2.txt`. Se alguma imagem não baixar, normalmente é por indisponibilidade temporária do CDN ou porque o arquivo foi removido na origem.
