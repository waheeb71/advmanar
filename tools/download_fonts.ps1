$dir = "E:\projects\reem-alnufooth-glass\assets\fonts"
New-Item -ItemType Directory -Force -Path $dir | Out-Null

$fonts = @(
  @{ name = "tajawal-400-arabic"; url = "https://fonts.gstatic.com/s/tajawal/v12/Iura6YBj_oCad4k1nzSBC45I.woff2" },
  @{ name = "tajawal-400-latin";  url = "https://fonts.gstatic.com/s/tajawal/v12/Iura6YBj_oCad4k1nzGBCw.woff2" },
  @{ name = "tajawal-500-arabic"; url = "https://fonts.gstatic.com/s/tajawal/v12/Iurf6YBj_oCad4k1l8KiHrRpiYlJ.woff2" },
  @{ name = "tajawal-500-latin";  url = "https://fonts.gstatic.com/s/tajawal/v12/Iurf6YBj_oCad4k1l8KiHrFpiQ.woff2" },
  @{ name = "tajawal-700-arabic"; url = "https://fonts.gstatic.com/s/tajawal/v12/Iurf6YBj_oCad4k1l4qkHrRpiYlJ.woff2" },
  @{ name = "tajawal-700-latin";  url = "https://fonts.gstatic.com/s/tajawal/v12/Iurf6YBj_oCad4k1l4qkHrFpiQ.woff2" },
  @{ name = "tajawal-800-arabic"; url = "https://fonts.gstatic.com/s/tajawal/v12/Iurf6YBj_oCad4k1l5anHrRpiYlJ.woff2" },
  @{ name = "tajawal-800-latin";  url = "https://fonts.gstatic.com/s/tajawal/v12/Iurf6YBj_oCad4k1l5anHrFpiQ.woff2" },
  @{ name = "plex-arabic-300"; url = "https://fonts.gstatic.com/s/ibmplexsansarabic/v15/Qw3NZRtWPQCuHme67tEYUIx3Kh0PHR9N6YOW_uCRXMR5Kw.woff2" },
  @{ name = "plex-latin-300";  url = "https://fonts.gstatic.com/s/ibmplexsansarabic/v15/Qw3NZRtWPQCuHme67tEYUIx3Kh0PHR9N6YOW_uCUXMQ.woff2" },
  @{ name = "plex-arabic-400"; url = "https://fonts.gstatic.com/s/ibmplexsansarabic/v15/Qw3CZRtWPQCuHme67tEYUIx3Kh0PHR9N6Ys43PWrfQ.woff2" },
  @{ name = "plex-latin-400";  url = "https://fonts.gstatic.com/s/ibmplexsansarabic/v15/Qw3CZRtWPQCuHme67tEYUIx3Kh0PHR9N6Ys93PU.woff2" },
  @{ name = "plex-arabic-500"; url = "https://fonts.gstatic.com/s/ibmplexsansarabic/v15/Qw3NZRtWPQCuHme67tEYUIx3Kh0PHR9N6YPO_-CRXMR5Kw.woff2" },
  @{ name = "plex-latin-500";  url = "https://fonts.gstatic.com/s/ibmplexsansarabic/v15/Qw3NZRtWPQCuHme67tEYUIx3Kh0PHR9N6YPO_-CUXMQ.woff2" },
  @{ name = "plex-arabic-600"; url = "https://fonts.gstatic.com/s/ibmplexsansarabic/v15/Qw3NZRtWPQCuHme67tEYUIx3Kh0PHR9N6YPi-OCRXMR5Kw.woff2" },
  @{ name = "plex-latin-600";  url = "https://fonts.gstatic.com/s/ibmplexsansarabic/v15/Qw3NZRtWPQCuHme67tEYUIx3Kh0PHR9N6YPi-OCUXMQ.woff2" }
)

foreach ($f in $fonts) {
  Invoke-WebRequest -UseBasicParsing -Uri $f.url -OutFile (Join-Path $dir ($f.name + ".woff2"))
  $size = (Get-Item (Join-Path $dir ($f.name + ".woff2"))).Length
  Write-Output ("{0} {1:N0} bytes" -f $f.name, $size)
}
