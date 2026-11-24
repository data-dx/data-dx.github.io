# 啟動 InfoRec（已開就沿用），點主選單後用方向鍵移到目標選單，再按 Enter 開視窗
# 點下去開的是「紀錄」選單（主選單順序：常用、資料、文件、紀錄、工具、支援）
#   工具 > 偏好設定：-Rights 1 -Class TFormPrefs
#   常用 > 文件交換：-Lefts 3 -Class TFormDocEx
param([int]$Rights = 0, [int]$Lefts = 0, [int]$Downs = 0, [string]$Class = 'TFormPrefs')
$ErrorActionPreference = 'Stop'
$Root = 'W:\delphi_sa\001_InfoRec'
$Run  = Join-Path $Root 'RUN'
. (Join-Path $Root 'tools\ui_auto\lib_uia.ps1')

function Send-Key($pop, [int]$vk) {
  [UiAutoInput]::PostMessage([IntPtr]$pop.Current.NativeWindowHandle, [UiAutoInput]::WM_KEYDOWN, [IntPtr]$vk, [IntPtr]::Zero) | Out-Null
  Start-Sleep -Milliseconds 500
}

$proc = Get-Process InfoRec -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $proc) { $proc = Start-Process (Join-Path $Run 'InfoRec.exe') -WorkingDirectory $Run -PassThru }
$mainWin = Wait-UiaWindow -ProcessId $proc.Id -ClassName 'TFormInfoRec' -TimeoutSec 30
Start-Sleep -Milliseconds 1500
$mr = $mainWin.Current.BoundingRectangle
$mainHwnd = [IntPtr]$mainWin.Current.NativeWindowHandle
[UiAutoInput]::SetForegroundWindow($mainHwnd) | Out-Null

$menuRect = [UiAutoInput]::GetTopMenuItemRect($mainHwnd, '文件')
if ($menuRect.Right -le $menuRect.Left) { $menuRect = [UiAutoInput]::GetTopMenuItemRectByIndex($mainHwnd, 2) }
if ($menuRect.Right -gt $menuRect.Left) {
  $x = [int](($menuRect.Left + $menuRect.Right) / 2); $y = [int](($menuRect.Top + $menuRect.Bottom) / 2)
} else { $x = [int]$mr.Left + 180; $y = [int]$mr.Top + 44 }
[UiAutoInput]::ClickNonClientMenu($mainHwnd, $x, $y, 200)

$pop = Wait-UiaWindow -ProcessId $proc.Id -ClassName '#32768' -TimeoutSec 8
Start-Sleep -Milliseconds 400
for ($i = 0; $i -lt $Rights; $i++) { Send-Key $pop 0x27; $pop = Wait-UiaWindow -ProcessId $proc.Id -ClassName '#32768' -TimeoutSec 5 }
for ($i = 0; $i -lt $Lefts;  $i++) { Send-Key $pop 0x25; $pop = Wait-UiaWindow -ProcessId $proc.Id -ClassName '#32768' -TimeoutSec 5 }
for ($i = 0; $i -lt $Downs;  $i++) { Send-Key $pop 0x28 }
Send-Key $pop 0x0D
$w = Wait-UiaWindow -ProcessId $proc.Id -ClassName $Class -TimeoutSec 10
"OPENED " + $w.Current.Name
