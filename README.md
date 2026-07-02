# Musical Pirambóia - site estático para GitHub Pages

Este pacote contém o site estático da Musical Pirambóia pronto para publicar no GitHub Pages.

## Conteúdo

- `index.html`: página principal com catálogo.
- `style.css`: estilos do site.
- `script.js`: busca, filtros, modal de produto e botões de WhatsApp.
- `products-data.js`: dados dos 96 produtos.
- `assets/logo-musical-piramboia.jpg`: logo enviada.
- `data/produtos.json`: versão limpa dos produtos.
- `data/image-urls.txt`: URLs das imagens dos produtos.
- `CNAME`: domínio `musicalpiramboia.com.br`.

## Observação sobre imagens

As imagens dos produtos estão referenciadas pelas URLs originais do CDN da Hostinger/Zyro, porque o pacote recebido contém as URLs dos produtos, não os arquivos locais das imagens.

Se quiser tentar baixar as imagens para a pasta local depois, execute no PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\baixar-imagens.ps1
```

Depois, será necessário alterar `products-data.js` para apontar para os arquivos locais baixados.

## Publicação

Envie todos os arquivos para a raiz do repositório do GitHub Pages.

## Baixar imagens localmente

Foi incluído o arquivo `baixar-imagens-e-atualizar.ps1`. Execute esse script no PowerShell antes de subir o projeto ao GitHub para baixar as imagens dos produtos para `assets/produtos/` e trocar as URLs remotas por caminhos locais.

