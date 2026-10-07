[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$root = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$failures = [System.Collections.Generic.List[string]]::new()
$successes = [System.Collections.Generic.List[string]]::new()

function Add-Result {
    param(
        [bool]$Condition,
        [string]$Success,
        [string]$Failure
    )

    if ($Condition) {
        $successes.Add($Success)
        Write-Host "[OK] $Success" -ForegroundColor Green
    }
    else {
        $failures.Add($Failure)
        Write-Host "[FALHA] $Failure" -ForegroundColor Red
    }
}

function Get-ProjectFiles {
    # Ignora dependências instaladas, builds e metadados do Git nas varreduras recursivas.
    $ignored = '[\\/](node_modules|dist|\.git)([\\/]|$)'
    return @(Get-ChildItem -LiteralPath $root -Recurse -File | Where-Object { $_.FullName.Substring($root.Length) -notmatch $ignored })
}

function Get-FullPath {
    param([string]$RelativePath)
    return Join-Path $root ($RelativePath -replace '/', [System.IO.Path]::DirectorySeparatorChar)
}

function Test-RequiredFiles {
    $requiredFiles = @(
        'README.md',
        '.gitignore',
        'LICENSE',
        'frontend/README.md',
        'backend/README.md',
        'database/README.md',
        'assets/images/README.md',
        'assets/logo/parkflow-logo.svg',
        'assets/logo/parkflow-simbolo.svg',
        'docs/AUDITORIA-ENTREGA.md',
        'docs/requisitos/problema.md',
        'docs/requisitos/objetivos.md',
        'docs/requisitos/publico-alvo.md',
        'docs/requisitos/personas.md',
        'docs/requisitos/requisitos-funcionais.md',
        'docs/requisitos/requisitos-nao-funcionais.md',
        'docs/requisitos/regras-de-negocio.md',
        'docs/requisitos/escopo.md',
        'docs/uml/diagrama-casos-de-uso.drawio',
        'docs/uml/diagrama-classes.drawio',
        'docs/uml/README.md',
        'docs/uml/matriz-rastreabilidade.md',
        'docs/marca/identidade-visual.md',
        'docs/marca/README.md',
        'docs/pitch/proposta-de-valor.md',
        'docs/planejamento/trello.md',
        'docs/planejamento/backlog.md',
        'docs/planejamento/roadmap.md',
        'docs/superpowers/specs/2026-09-01-parkflow-parte-1-design.md',
        'docs/superpowers/plans/2026-09-01-parkflow-parte-1.md',
        'scripts/validar-entrega.ps1',
        'package.json',
        'frontend/package.json',
        'frontend/index.html',
        'frontend/vite.config.ts',
        'frontend/eslint.config.js',
        'frontend/public/favicon.svg',
        'frontend/src/main.tsx',
        'frontend/src/App.tsx',
        'frontend/src/domain/indicadores.ts',
        'frontend/src/domain/vagas.ts',
        'frontend/src/data/seed.ts',
        'frontend/src/services/storage.ts',
        'docs/uml/diagrama-atividade-mvp.drawio',
        'docs/uml/diagrama-sequencia-mvp.drawio',
        'docs/checkpoint-5/status-implementacao.md',
        'docs/checkpoint-5/auditoria-checkpoint-5.md'
    )

    $missing = @($requiredFiles | Where-Object { -not (Test-Path -LiteralPath (Get-FullPath $_) -PathType Leaf) })
    Add-Result ($missing.Count -eq 0) "Todos os $($requiredFiles.Count) arquivos obrigatórios existem." "Arquivos obrigatórios ausentes: $($missing -join ', ')"
}

function Test-IdentifierCount {
    param(
        [string]$RelativePath,
        [string]$Pattern,
        [int]$Expected,
        [string]$Label
    )

    $content = Get-Content -Raw -LiteralPath (Get-FullPath $RelativePath)
    $matches = [regex]::Matches($content, $Pattern, [System.Text.RegularExpressions.RegexOptions]::Multiline)
    $ids = @($matches | ForEach-Object { $_.Groups[1].Value })
    $duplicateIds = @($ids | Group-Object | Where-Object Count -gt 1)
    $valid = ($ids.Count -eq $Expected -and $duplicateIds.Count -eq 0)
    Add-Result $valid "${Label}: $Expected identificadores únicos." "${Label}: esperados $Expected; encontrados $($ids.Count); duplicados $($duplicateIds.Name -join ', ')."
}

function Test-Drawio {
    param(
        [string]$RelativePath,
        [int]$MinimumVertices,
        [int]$MinimumEdges
    )

    $fullPath = Get-FullPath $RelativePath
    try {
        [xml]$xml = Get-Content -Raw -LiteralPath $fullPath
    }
    catch {
        Add-Result $false '' "$RelativePath não contém XML bem formado: $($_.Exception.Message)"
        return
    }

    $rootIsMxfile = $xml.DocumentElement.LocalName -eq 'mxfile'
    $model = $xml.SelectSingleNode('/mxfile/diagram/mxGraphModel')
    $cells = @($xml.SelectNodes('/mxfile/diagram/mxGraphModel/root/mxCell'))
    $ids = @($cells | ForEach-Object { $_.GetAttribute('id') })
    $duplicates = @($ids | Group-Object | Where-Object Count -gt 1)
    $vertices = @($cells | Where-Object { $_.GetAttribute('vertex') -eq '1' })
    $edges = @($cells | Where-Object { $_.GetAttribute('edge') -eq '1' })
    $idLookup = @{}
    foreach ($id in $ids) { $idLookup[$id] = $true }

    $invalidReferences = [System.Collections.Generic.List[string]]::new()
    foreach ($edge in $edges) {
        foreach ($attribute in @('source', 'target')) {
            $reference = $edge.GetAttribute($attribute)
            if ($reference -and -not $idLookup.ContainsKey($reference)) {
                $invalidReferences.Add("$($edge.id).$attribute=$reference")
            }
        }
    }

    $invalidGeometry = [System.Collections.Generic.List[string]]::new()
    foreach ($vertex in $vertices) {
        $geometry = $vertex.SelectSingleNode('mxGeometry')
        if ($null -eq $geometry) {
            $invalidGeometry.Add($vertex.id)
            continue
        }
        if ($geometry.GetAttribute('relative') -ne '1') {
            try {
                $width = [double]::Parse($geometry.GetAttribute('width'), [System.Globalization.CultureInfo]::InvariantCulture)
                $height = [double]::Parse($geometry.GetAttribute('height'), [System.Globalization.CultureInfo]::InvariantCulture)
                [void][double]::Parse($geometry.GetAttribute('x'), [System.Globalization.CultureInfo]::InvariantCulture)
                [void][double]::Parse($geometry.GetAttribute('y'), [System.Globalization.CultureInfo]::InvariantCulture)
                if ($width -le 0 -or $height -le 0) { $invalidGeometry.Add($vertex.id) }
            }
            catch {
                $invalidGeometry.Add($vertex.id)
            }
        }
    }

    $raw = Get-Content -Raw -LiteralPath $fullPath
    $containsRaster = $raw -match '(?i)data:image|shape=image|<image\b'
    $valid = $rootIsMxfile -and $null -ne $model -and $duplicates.Count -eq 0 -and
        $vertices.Count -ge $MinimumVertices -and $edges.Count -ge $MinimumEdges -and
        $invalidReferences.Count -eq 0 -and $invalidGeometry.Count -eq 0 -and -not $containsRaster

    $failure = "$RelativePath inválido: mxfile=$rootIsMxfile; modelo=$($null -ne $model); vértices=$($vertices.Count); arestas=$($edges.Count); IDs duplicados=$($duplicates.Count); referências inválidas=$($invalidReferences.Count); geometrias inválidas=$($invalidGeometry.Count); raster=$containsRaster."
    Add-Result $valid "${RelativePath}: XML diagrams.net válido, $($vertices.Count) vértices, $($edges.Count) arestas e IDs únicos." $failure
}

function Test-Svg {
    param([string]$RelativePath)

    $fullPath = Get-FullPath $RelativePath
    try {
        [xml]$xml = Get-Content -Raw -LiteralPath $fullPath
        $raw = Get-Content -Raw -LiteralPath $fullPath
        $isSvg = $xml.DocumentElement.LocalName -eq 'svg'
        $hasTitle = $null -ne $xml.SelectSingleNode("/*[local-name()='svg']/*[local-name()='title']")
        $hasVector = $null -ne $xml.SelectSingleNode("/*[local-name()='svg']//*[local-name()='path' or local-name()='rect' or local-name()='circle']")
        $hasRaster = $raw -match '(?i)<image\b|data:image'
        Add-Result ($isSvg -and $hasTitle -and $hasVector -and -not $hasRaster) "${RelativePath}: SVG vetorial e acessível." "$RelativePath não atende à estrutura SVG vetorial esperada."
    }
    catch {
        Add-Result $false '' "$RelativePath não contém XML bem formado: $($_.Exception.Message)"
    }
}

function Test-RnfDiagramCoverage {
    param([string]$RelativePath)

    $fullPath = Get-FullPath $RelativePath
    if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
        Add-Result $false '' "$RelativePath não existe para validação da cobertura dos RNFs."
        return
    }

    try {
        [xml]$xml = Get-Content -Raw -LiteralPath $fullPath
    }
    catch {
        Add-Result $false '' "$RelativePath não pôde ser analisado para cobertura dos RNFs: $($_.Exception.Message)"
        return
    }

    $values = @($xml.SelectNodes('/mxfile/diagram/mxGraphModel/root/mxCell[@value]') | ForEach-Object { $_.GetAttribute('value') })
    $matches = @([regex]::Matches(($values -join ' '), '\bRNF(?:0[1-9]|1[0-2])\b') | ForEach-Object { $_.Value })
    $expected = @(1..12 | ForEach-Object { 'RNF{0:D2}' -f $_ })
    $missing = @($expected | Where-Object { $_ -notin $matches })
    $duplicates = @($matches | Group-Object | Where-Object Count -ne 1)
    $valid = $matches.Count -eq 12 -and $missing.Count -eq 0 -and $duplicates.Count -eq 0

    Add-Result $valid 'Diagrama de RNFs contém RNF01 a RNF12 exatamente uma vez.' "Cobertura do diagrama de RNFs inválida: encontrados=$($matches.Count); ausentes=$($missing -join ', '); repetidos=$($duplicates.Name -join ', ')."
}

function Test-MarkdownLinks {
    $markdownFiles = @(Get-ProjectFiles | Where-Object { $_.Extension -eq '.md' })
    $broken = [System.Collections.Generic.List[string]]::new()
    $checked = 0

    foreach ($file in $markdownFiles) {
        $content = Get-Content -Raw -LiteralPath $file.FullName
        $contentForLinks = [regex]::Replace($content, '(?s)```.*?```', '')
        $contentForLinks = [regex]::Replace($contentForLinks, '`[^`\r\n]*`', '')
        $matches = [regex]::Matches($contentForLinks, '!?(?:\[[^\]]*\])\(([^)]+)\)')
        foreach ($match in $matches) {
            $target = $match.Groups[1].Value.Trim()
            if ($target -match '^(?i:https?://|mailto:|#)') { continue }
            if ($target.StartsWith('<') -and $target.EndsWith('>')) { $target = $target.Substring(1, $target.Length - 2) }
            $target = ($target -split '#', 2)[0]
            $target = ($target -split '\?', 2)[0]
            if ([string]::IsNullOrWhiteSpace($target)) { continue }
            $target = [System.Uri]::UnescapeDataString($target)
            $resolved = Join-Path $file.DirectoryName ($target -replace '/', [System.IO.Path]::DirectorySeparatorChar)
            $checked++
            if (-not (Test-Path -LiteralPath $resolved)) {
                $relativeFile = $file.FullName.Substring($root.Length + 1)
                $broken.Add("$relativeFile -> $target")
            }
        }
    }

    Add-Result ($broken.Count -eq 0) "$checked links Markdown locais resolvidos." "Links Markdown quebrados: $($broken -join '; ')"
}

function Test-ExternalVideoPolicy {
    $files = @(Get-ProjectFiles)
    $forbiddenNames = @($files | Where-Object { $_.Name -match '(?i)roteiro.*video|video.*roteiro' })
    $timedScript = [System.Collections.Generic.List[string]]::new()
    foreach ($file in $files | Where-Object { $_.Extension -in @('.md', '.txt') }) {
        $content = Get-Content -Raw -LiteralPath $file.FullName
        if ($content -match '(?m)^\s*[0-2]:[0-5][0-9]\s*[–—-]') {
            $timedScript.Add($file.FullName.Substring($root.Length + 1))
        }
    }
    Add-Result ($forbiddenNames.Count -eq 0 -and $timedScript.Count -eq 0) 'Nenhum arquivo ou conteúdo cronometrado de roteiro de vídeo foi salvo.' "Política do vídeo violada. Arquivos: $($forbiddenNames.Name -join ', '); conteúdo: $($timedScript -join ', ')."
}

function Test-PlaceholdersAndScope {
    $textFiles = @(Get-ProjectFiles | Where-Object { $_.Extension -in @('.md', '.drawio', '.svg') })
    $pending = [System.Collections.Generic.List[string]]::new()
    foreach ($file in $textFiles) {
        $content = Get-Content -Raw -LiteralPath $file.FullName
        if ($content -cmatch '\b(TBD|TODO|FIXME)\b') {
            $pending.Add($file.FullName.Substring($root.Length + 1))
        }
    }
    Add-Result ($pending.Count -eq 0) 'Nenhum marcador de pendência não intencional foi encontrado.' "Marcadores de pendência encontrados: $($pending -join ', ')."

    # O código do Checkpoint 5 fica somente em frontend/; backend e banco continuam sem código.
    $frontendPrefix = [System.IO.Path]::DirectorySeparatorChar + 'frontend' + [System.IO.Path]::DirectorySeparatorChar
    $functionalCode = @(Get-ProjectFiles | Where-Object {
        $_.Extension -in @('.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cs', '.go', '.rs', '.sql') -and
        -not $_.FullName.Substring($root.Length).StartsWith($frontendPrefix)
    })
    Add-Result ($functionalCode.Count -eq 0) 'Nenhum código funcional fora de frontend/ (backend e banco permanecem sem implementação).' "Arquivos de código fora de frontend/: $($functionalCode.FullName -join ', ')."
}

function Test-PackageJson {
    try {
        $rootPackage = Get-Content -Raw -LiteralPath (Get-FullPath 'package.json') | ConvertFrom-Json
        $frontendPackage = Get-Content -Raw -LiteralPath (Get-FullPath 'frontend/package.json') | ConvertFrom-Json
    }
    catch {
        Add-Result $false '' "package.json inválido: $($_.Exception.Message)"
        return
    }

    $requiredScripts = @('dev', 'build', 'test', 'lint', 'preview')
    $missingRoot = @($requiredScripts | Where-Object { -not $rootPackage.scripts.PSObject.Properties[$_] })
    $missingFrontend = @($requiredScripts | Where-Object { -not $frontendPackage.scripts.PSObject.Properties[$_] })
    $hasWorkspace = @($rootPackage.workspaces) -contains 'frontend'
    $valid = $hasWorkspace -and $missingRoot.Count -eq 0 -and $missingFrontend.Count -eq 0
    Add-Result $valid 'package.json da raiz declara o workspace frontend e os scripts dev, build, test, lint e preview.' "package.json incompleto: workspace frontend=$hasWorkspace; scripts ausentes na raiz=$($missingRoot -join ', '); no frontend=$($missingFrontend -join ', ')."
}

Write-Host '=== Validação da entrega do ParkFlow (Parte 1 e Checkpoint 5) ===' -ForegroundColor Cyan
Test-RequiredFiles
Test-IdentifierCount 'docs/requisitos/requisitos-funcionais.md' '(?m)^### (RF\d{2})\s' 18 'Requisitos funcionais'
Test-IdentifierCount 'docs/requisitos/requisitos-nao-funcionais.md' '(?m)^### (RNF\d{2})\s' 12 'Requisitos não funcionais'
Test-IdentifierCount 'docs/requisitos/regras-de-negocio.md' '(?m)^### (RN\d{2})\s' 10 'Regras de negócio'
Test-Drawio 'docs/uml/diagrama-casos-de-uso.drawio' 18 10
Test-Drawio 'docs/uml/diagrama-classes.drawio' 15 7
Test-Drawio 'docs/uml/diagrama-atividade-mvp.drawio' 20 20
Test-Drawio 'docs/uml/diagrama-sequencia-mvp.drawio' 10 10
Test-Svg 'assets/logo/parkflow-logo.svg'
Test-Svg 'assets/logo/parkflow-simbolo.svg'
Test-MarkdownLinks
Test-ExternalVideoPolicy
Test-PlaceholdersAndScope
Test-PackageJson

Write-Host "`nSucessos: $($successes.Count) | Falhas: $($failures.Count)"
if ($failures.Count -gt 0) {
    Write-Host 'VALIDAÇÃO REPROVADA' -ForegroundColor Red
    exit 1
}

Write-Host 'VALIDAÇÃO APROVADA' -ForegroundColor Green
exit 0
