# Exports every .pptx in the catalog folder to PDF using PowerPoint itself,
# so the PDF matches the slides exactly. Run: powershell -File export.ps1
$ErrorActionPreference = 'Stop'
$catalog = Split-Path -Parent $PSScriptRoot
$ppt = New-Object -ComObject PowerPoint.Application
try {
  Get-ChildItem -Path $catalog -Filter *.pptx | ForEach-Object {
    $pdf = [System.IO.Path]::ChangeExtension($_.FullName, '.pdf')
    # Open(FileName, ReadOnly, Untitled, WithWindow)
    $deck = $ppt.Presentations.Open($_.FullName, $true, $false, $false)
    $deck.SaveAs($pdf, 32)  # 32 = ppSaveAsPDF
    $deck.Close()
    Write-Output "exported $pdf"
  }
} finally {
  $ppt.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($ppt) | Out-Null
}
