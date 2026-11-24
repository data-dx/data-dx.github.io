param([string]$Title, [string]$Out)
# 截取 InfoRec 已開啟的視窗（依標題），用 PrintWindow，不受其他視窗遮蓋影響
Add-Type -AssemblyName UIAutomationClient, UIAutomationTypes, System.Drawing
Add-Type @"
using System; using System.Runtime.InteropServices;
public class W2 {
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
  [DllImport("user32.dll")] public static extern bool PrintWindow(IntPtr h, IntPtr hdc, uint f);
  [StructLayout(LayoutKind.Sequential)] public struct RECT { public int L, T, R, B; }
}
"@
$AE = [System.Windows.Automation.AutomationElement]
$TS = [System.Windows.Automation.TreeScope]
$p = Get-Process InfoRec -ErrorAction Stop | Select-Object -First 1
$cond = New-Object System.Windows.Automation.AndCondition(
  (New-Object System.Windows.Automation.PropertyCondition($AE::ProcessIdProperty, $p.Id)),
  (New-Object System.Windows.Automation.PropertyCondition($AE::NameProperty, $Title)))
$win = $AE::RootElement.FindFirst($TS::Descendants, $cond)
if (-not $win) { "找不到視窗：$Title"; exit 1 }
$h = [IntPtr]$win.Current.NativeWindowHandle
$r = New-Object W2+RECT; [W2]::GetWindowRect($h, [ref]$r) | Out-Null
$bmp = New-Object System.Drawing.Bitmap ($r.R - $r.L), ($r.B - $r.T)
$g = [System.Drawing.Graphics]::FromImage($bmp); $hdc = $g.GetHdc()
[W2]::PrintWindow($h, $hdc, 2) | Out-Null
$g.ReleaseHdc($hdc); $g.Dispose()
$bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
# 有 ImageMagick 就壓成 256 色 PNG8（截圖色數少，畫質不變，檔案約小一半）；不改尺寸、不重新取樣
if (Get-Command magick -ErrorAction SilentlyContinue) {
  & magick $Out -dither None -colors 256 -define png:compression-level=9 "PNG8:$Out"
}
"OK $($r.R - $r.L)x$($r.B - $r.T) $((Get-Item $Out).Length) bytes"
