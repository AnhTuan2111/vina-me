# Mở tệp Word bằng Microsoft Word, cập nhật mọi trường (mục lục, số trang) rồi lưu PDF.
# Dùng: pwsh -NoProfile -File render-pdf.ps1 [-OutDir <thư mục>] [-UpdateDocx] <tệp.docx> [tệp khác.docx ...]
# Mặc định mở chỉ đọc, không sửa tệp Word (dùng cho hồ sơ mẫu ở thư mục BA gửi; luôn kèm -OutDir ra thư mục làm việc).
# -UpdateDocx: dùng cho bản dựng HSDX.docx ở thư mục làm việc. Word lưu lại chính tệp Word sau khi cập nhật trường, để tệp giao
# cho BA có mục lục và số trang thật, không còn chữ giữ chỗ của mục lục.
# Chạy bằng PowerShell 7 (pwsh). Trên máy đã thử (10/11/2026), Windows PowerShell 5.1 treo ở bước SaveAs2 với cùng tệp.
# Không có tham số theo vị trí: mọi đối số không kèm tên là tệp Word.
[CmdletBinding(PositionalBinding = $false)]
param([string]$OutDir, [switch]$UpdateDocx, [Parameter(ValueFromRemainingArguments = $true)][string[]]$Files)
$ErrorActionPreference = 'Stop'
if (-not $Files) { throw 'Thiếu tệp Word: render-pdf.ps1 [-OutDir <thư mục>] [-UpdateDocx] <tệp.docx>' }
$w = New-Object -ComObject Word.Application
$w.Visible = $false; $w.DisplayAlerts = 0
try {
  if ($OutDir) { New-Item -ItemType Directory -Force $OutDir | Out-Null; $OutDir = (Resolve-Path $OutDir).Path }
  foreach ($f in $Files) {
    $full = (Resolve-Path $f).Path
    # Open(FileName, ConfirmConversions, ReadOnly, AddToRecentFiles)
    $d = $w.Documents.Open($full, $false, (-not $UpdateDocx), $false)
    $d.Fields.Update() | Out-Null
    foreach ($t in $d.TablesOfContents) { $t.Update() }
    if ($UpdateDocx) { $d.Save() }
    $name = [IO.Path]::GetFileNameWithoutExtension($full) + '.pdf'
    $pdf = if ($OutDir) { Join-Path $OutDir $name } else { [IO.Path]::ChangeExtension($full, '.pdf') }
    $d.SaveAs2($pdf, 17)
    $d.Close(0)
    Write-Output $pdf
  }
} finally { $w.Quit() }
