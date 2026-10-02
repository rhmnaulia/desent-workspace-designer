# Fonts

`bricolage-display.woff2` is [Bricolage Grotesque](https://github.com/ateliertriay/bricolage)
(SIL Open Font License, see `OFL.txt`), trimmed for this site: the 400–700 weight range only,
optical size pinned to 14 (the open cut Google Fonts serves) and width to 100, and Latin glyphs only.
That's 31 kB instead of the 41 kB Google Fonts serves, and the heading font sits on the
critical path for the first paint.

Rebuild it from the upstream variable font with [fontTools](https://github.com/fonttools/fonttools):

```bash
fonttools varLib.instancer "BricolageGrotesque[opsz,wdth,wght].ttf" opsz=14 wdth=100 wght=400:700 -o instanced.ttf
pyftsubset instanced.ttf --flavor=woff2 --output-file=bricolage-display.woff2 \
  --unicodes="U+0020-007E,U+00A0-00FF,U+2013-2014,U+2018-201D,U+2022,U+2026,U+2192,U+2212" \
  --layout-features="kern,liga,calt,tnum,lnum"
```
