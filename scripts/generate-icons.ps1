Add-Type -AssemblyName System.Drawing

$outDir = Resolve-Path (Join-Path $PSScriptRoot "..\assets\images")

function New-Icon {
  param(
    [int]$Size,
    [string]$Path,
    [string]$Glyph,
    [int]$FontSize,
    [int]$BgR,
    [int]$BgG,
    [int]$BgB,
    [bool]$Solid = $true,
    [bool]$GlyphOnly = $false
  )
  $bmp = New-Object System.Drawing.Bitmap $Size, $Size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.Clear([System.Drawing.Color]::Transparent)

  if (-not $GlyphOnly) {
    $brushBg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, $BgR, $BgG, $BgB))
    $g.FillRectangle($brushBg, 0, 0, $Size, $Size)
    $brushBg.Dispose()
  }

  if ($Glyph) {
    $font = New-Object System.Drawing.Font "Segoe UI", $FontSize, ([System.Drawing.FontStyle]::Bold)
    $brushText = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    $rect = New-Object System.Drawing.RectangleF 0, 0, $Size, $Size
    $g.DrawString($Glyph, $font, $brushText, $rect, $format)
    $font.Dispose()
    $brushText.Dispose()
    $format.Dispose()
  }

  $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
}

# Main app icon - brand blue with white "N"
New-Icon -Size 1024 -Path (Join-Path $outDir "icon.png") -Glyph "N" -FontSize 560 -BgR 37 -BgG 99 -BgB 235

# Adaptive icon foreground - letter centered in the 66% safe zone
New-Icon -Size 1024 -Path (Join-Path $outDir "adaptive-icon-foreground.png") -Glyph "N" -FontSize 460 -BgR 0 -BgG 0 -BgB 0 -GlyphOnly $true

# Adaptive icon background - solid brand blue
New-Icon -Size 1024 -Path (Join-Path $outDir "adaptive-icon-background.png") -Glyph "" -FontSize 0 -BgR 37 -BgG 99 -BgB 235 -GlyphOnly $false

# Monochrome - white glyph on transparent (system tints it)
New-Icon -Size 1024 -Path (Join-Path $outDir "adaptive-icon-monochrome.png") -Glyph "N" -FontSize 460 -BgR 0 -BgG 0 -BgB 0 -GlyphOnly $true

# Web favicon - small square
New-Icon -Size 64 -Path (Join-Path $outDir "favicon.png") -Glyph "N" -FontSize 36 -BgR 37 -BgG 99 -BgB 235

Write-Output "Icons generated in $outDir"