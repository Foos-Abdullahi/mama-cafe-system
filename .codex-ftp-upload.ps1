param(
    [Parameter(Mandatory = $true)][string]$Source,
    [string]$RemoteRoot = '/',
    [Parameter(Mandatory = $true)][string]$User,
    [Parameter(Mandatory = $true)][string]$Password,
    [string]$HostName = 'srv1101.sostectechno.com'
)

$base = (Resolve-Path $Source).Path
$files = Get-ChildItem -LiteralPath $base -Recurse -File | Where-Object {
    $_.FullName -notmatch '\\node_modules\\|\\.git\\|\\tests\\|\\.env($|\.)' -and ($_.Name -notlike '.*' -or $_.Name -eq '.htaccess')
}

function Get-RemotePath([string]$localPath) {
    $relative = $localPath.Substring($base.Length).TrimStart('\').Replace('\', '/')
    return "/$($RemoteRoot.Trim('/'))/$relative".Replace('//', '/')
}

foreach ($file in $files) {
    $remote = Get-RemotePath $file.FullName
    & curl.exe --ftp-ssl --ftp-pasv --insecure --ftp-create-dirs --user "$User`:$Password" --upload-file $file.FullName "ftp://$HostName$remote"
    if ($LASTEXITCODE -ne 0) { throw "Upload failed: $($file.FullName)" }
}
