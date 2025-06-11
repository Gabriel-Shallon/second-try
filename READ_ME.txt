///////////////// COMO USAR /////////////////


1. Coloque seu arquivo de cookies do twitter aqui em formato .txt (x.com_cookies.txt) (Possível de se fazer usando extensão get cookies e abrindo a página do twitter).

2. Abra sua página de bookmarks do twitter e cole no console o script.

3. Espere o script rodar até o final da página de bookmarks.

4. Copie o output e cole no arquivo chamado urls.txt.

5. Rode no terminal "gallery-dl --cookies x.com_cookies.txt -i urls.txt" e espere o processo de download terminar.

6. Caso queira tirar as midias das várias subpastas e coloca-las todas juntas em uma só pasta, rode no terminal: 

Get-ChildItem -Path .\gallery-dl -Recurse -File |
    ForEach-Object {
        Copy-Item $_.FullName -Destination .\downloads\ -Force
    }




