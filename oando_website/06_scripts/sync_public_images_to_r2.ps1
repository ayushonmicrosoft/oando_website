param(
  [string]$Bucket = "oando-assets-prod",
  [string]$SourceDir = "public/images",
  [int]$StartAt = 0
)

$ErrorActionPreference = "Stop"

if (!(Test-Path $SourceDir)) {
  throw "Source directory not found: $SourceDir"
}

$files = Get-ChildItem -Path $SourceDir -Recurse -File | Sort-Object FullName
$total = $files.Count

if ($total -eq 0) {
  Write-Host "No files found in $SourceDir"
  exit 0
}

if ($StartAt -lt 0 -or $StartAt -ge $total) {
  throw "StartAt must be between 0 and $($total - 1)"
}

Write-Host "Uploading $total files to R2 bucket '$Bucket' from '$SourceDir'..."
Write-Host "Resume index: $StartAt"

for ($i = $StartAt; $i -lt $total; $i++) {
  $file = $files[$i]
  $relative = $file.FullName.Substring((Resolve-Path $SourceDir).Path.Length).TrimStart('\')
  $key = ($relative -replace '\\','/')
  $objectKey = "images/$key"

  Write-Host "[$($i + 1)/$total] $objectKey"
  npx wrangler r2 object put "$Bucket/$objectKey" --file "$($file.FullName)" --remote | Out-Null
}

Write-Host "Upload complete."
