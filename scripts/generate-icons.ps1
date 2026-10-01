Add-Type -AssemblyName System.Drawing

# Regenerates the ANDROID ADAPTIVE ICON layers from the existing brand assets.
# The glyph shape is extracted from icon.png (the authoritative square symbol),
# then centered inside the Android 66% safe zone. icon.png / logo.png / splash
# are correct by design and are NOT touched.

$root = Split-Path -Parent $PSScriptRoot
$imgDir = Join-Path $root 'assets\images'
$previewDir = Join-Path $env:TEMP 'opencode'
$SIZE = 1024

# --- 1. Read icon.png as an ARGB byte buffer ---
$icon = [System.Drawing.Bitmap]::FromFile((Join-Path $imgDir 'icon.png'))
$rect = New-Object System.Drawing.Rectangle 0, 0, $SIZE, $SIZE
$d = $icon.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bytes = New-Object byte[] ($d.Stride * $SIZE)
[System.Runtime.InteropServices.Marshal]::Copy($d.Scan0, $bytes, 0, $bytes.Length)
$icon.UnlockBits($d)
$icon.Dispose()

# --- 2. Build a source mask bitmap (white glyph on black, opaque) ---
$mask = New-Object System.Drawing.Bitmap $SIZE, $SIZE, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$md = $mask.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$mbytes = New-Object byte[] ($md.Stride * $SIZE)
$minX = $SIZE; $minY = $SIZE; $maxX = -1; $maxY = -1
for ($y = 0; $y -lt $SIZE; $y++) {
  $row = $y * $md.Stride
  $crow = $y * $d.Stride
  for ($x = 0; $x -lt $SIZE; $x++) {
    $i = $crow + $x * 4
    if ($bytes[$i + 3] -gt 0) {
      $mi = $row + $x * 4
      $mbytes[$mi] = 255; $mbytes[$mi + 1] = 255; $mbytes[$mi + 2] = 255; $mbytes[$mi + 3] = 255
      if ($x -lt $minX) { $minX = $x }
      if ($x -gt $maxX) { $maxX = $x }
      if ($y -lt $minY) { $minY = $y }
      if ($y -gt $maxY) { $maxY = $y }
    }
  }
}
[System.Runtime.InteropServices.Marshal]::Copy($mbytes, 0, $md.Scan0, $mbytes.Length)
$mask.UnlockBits($md)
Write-Output "Glyph found at bbox ${minX},${minY}..${maxX},${maxY}"

$gw = $maxX - $minX + 1
$gh = $maxY - $minY + 1

# --- 3. Scale the glyph into the center 66% safe zone ---
$BOX = 610
$scale = $BOX / [math]::Max($gw, $gh)
$nw = [int][math]::Round($gw * $scale)
$nh = [int][math]::Round($gh * $scale)
$offX = [int]((($SIZE - $nw) / 2))
$offY = [int]((($SIZE - $nh) / 2))

$buf = New-Object System.Drawing.Bitmap $SIZE, $SIZE, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($buf)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.Clear([System.Drawing.Color]::FromArgb(255, 0, 0, 0))
$srcRect = New-Object System.Drawing.Rectangle $minX, $minY, $gw, $gh
$dstRect = New-Object System.Drawing.Rectangle $offX, $offY, $nw, $nh
$g.DrawImage($mask, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$mask.Dispose()

# --- 4. Read the scaled mask (luminance = glyph alpha) ---
$bd = $buf.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bbytes = New-Object byte[] ($bd.Stride * $SIZE)
[System.Runtime.InteropServices.Marshal]::Copy($bd.Scan0, $bbytes, 0, $bbytes.Length)
$buf.UnlockBits($bd)
$buf.Dispose()

# --- 5. Write foreground (dark navy glyph) and monochrome (white glyph) ---
function Write-GlyphLayer {
  param($R, $G, $B, [string]$Path)
  $bmp = New-Object System.Drawing.Bitmap $SIZE, $SIZE, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $od = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $obytes = New-Object byte[] ($od.Stride * $SIZE)
  for ($y = 0; $y -lt $SIZE; $y++) {
    $orow = $y * $od.Stride
    $brow = $y * $bd.Stride
    for ($x = 0; $x -lt $SIZE; $x++) {
      $i = $orow + $x * 4
      $a = $bbytes[$brow + $x * 4]
      if ($a -gt 0) {
        $obytes[$i] = [byte]$B; $obytes[$i + 1] = [byte]$G; $obytes[$i + 2] = [byte]$R; $obytes[$i + 3] = $a
      }
    }
  }
  [System.Runtime.InteropServices.Marshal]::Copy($obytes, 0, $od.Scan0, $obytes.Length)
  $bmp.UnlockBits($od)
  $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Output "Wrote $Path"
}

Write-GlyphLayer -R 15 -G 23 -B 42 -Path (Join-Path $imgDir 'adaptive-icon-foreground.png')
Write-GlyphLayer -R 255 -G 255 -B 255 -Path (Join-Path $imgDir 'adaptive-icon-monochrome.png')

# --- 6. Contact sheet for human review ---
$sheet = New-Object System.Drawing.Bitmap 3200, 1100, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gr = [System.Drawing.Graphics]::FromImage($sheet)
$gr.Clear([System.Drawing.Color]::FromArgb(255, 245, 247, 250))

function Add-Panel {
  param([string]$Src, [int]$X, [int]$Y, [string]$Title)
  $fill = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
  $gr.FillRectangle($fill, $X, $Y, 1024, 1024)
  $fill.Dispose()
  if ($Src) {
    $img = [System.Drawing.Image]::FromFile($Src)
    $gr.DrawImage($img, $X, $Y, 1024, 1024)
    $img.Dispose()
  }
  $font = New-Object System.Drawing.Font 'Segoe UI', 28, ([System.Drawing.FontStyle]::Bold)
  $tb = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 30, 30, 30))
  $gr.DrawString($Title, $font, $tb, $X, 1032)
  $tb.Dispose(); $font.Dispose()
}

$disc = New-Object System.Drawing.Bitmap $SIZE, $SIZE, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$dg = [System.Drawing.Graphics]::FromImage($disc)
$dg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$blue = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 34, 120, 254))
$dg.FillEllipse($blue, 64, 64, 896, 896)
$blue.Dispose()
$fg = [System.Drawing.Bitmap]::FromFile((Join-Path $imgDir 'adaptive-icon-foreground.png'))
$dg.DrawImage($fg, 0, 0, $SIZE, $SIZE)
$fg.Dispose(); $dg.Dispose()
$disc.Save((Join-Path $previewDir 'preview-launcher.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$disc.Dispose()

Add-Panel -Src (Join-Path $previewDir 'preview-launcher.png') -X 20 -Y 20 -Title '1. LAUNCHER (blue circle + dark glyph)'
Add-Panel -Src (Join-Path $imgDir 'icon.png') -X 1090 -Y 20 -Title '2. CURRENT icon.png (reference)'
Add-Panel -Src (Join-Path $imgDir 'adaptive-icon-monochrome.png') -X 2160 -Y 20 -Title '3. MONOCHROME (themed)'

$sheet.Save((Join-Path $previewDir 'brand-preview.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$gr.Dispose(); $sheet.Dispose()
Write-Output "Preview: $(Join-Path $previewDir 'brand-preview.png')"