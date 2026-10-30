"""Une template.html + styles.css + JS en un único HTML autocontenido (sin internet).

Uso:  python src/build.py
Salida: Estadistica_Sustitutiva_2026.html (en la carpeta STADISTICS)
"""
from pathlib import Path

SRC = Path(__file__).resolve().parent
OUT = SRC.parent / "Estadistica_Sustitutiva_2026.html"
JS_ORDER = ["lib.js", "content1.js", "content2.js", "content3.js", "app.js", "extras.js", "slides.js"]


def read(name: str) -> str:
    return (SRC / name).read_text(encoding="utf-8")


def main() -> None:
    js = "\n".join(read(n) for n in JS_ORDER).replace("</script", "<\\/script")
    html = read("template.html").replace("/*__CSS__*/", read("styles.css")).replace("/*__JS__*/", js)
    OUT.write_text(html, encoding="utf-8")
    print(f"OK -> {OUT.name} ({OUT.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
