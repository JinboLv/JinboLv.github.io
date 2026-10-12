$ErrorActionPreference = 'Stop'
$projectSource = Split-Path -Parent $PSScriptRoot
$sourceArgument = Join-Path $projectSource '.'
$sourcePattern = '(?:^|\s)--source\s+"' + [regex]::Escape($sourceArgument) + '"(?=\s|$)'
$listeners = @(Get-NetTCPConnection -LocalPort 4000 -State Listen -ErrorAction SilentlyContinue)

if ($listeners.Count -eq 0) {
    Write-Host 'Local preview is already stopped.'
    exit 0
}

foreach ($serverId in ($listeners.OwningProcess | Select-Object -Unique)) {
    $serverProcess = Get-CimInstance Win32_Process -Filter "ProcessId = $serverId"
    if ($serverProcess.Name -ne 'ruby.exe' -or
        $serverProcess.CommandLine -notmatch 'jekyll.+serve' -or
        $serverProcess.CommandLine -notmatch $sourcePattern) {
        Write-Host 'Port 4000 belongs to another service; it was left running.'
        exit 1
    }
    Stop-Process -Id $serverId -Force
}

Write-Host 'Local preview stopped. Double-click preview.cmd to start again.'
