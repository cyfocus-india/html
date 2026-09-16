"""Small dependency-free structural audit for the static HTML template."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parent.parent
HTML_FILES = [ROOT / "index.html", ROOT / "index1.html", *sorted((ROOT / "pages").glob("*.html"))]


class PageAudit(HTMLParser):
    void_elements = {
        "area", "base", "br", "col", "embed", "hr", "img", "input",
        "link", "meta", "param", "source", "track", "wbr",
    }

    def __init__(self):
        super().__init__()
        self.ids = []
        self.labels = []
        self.controls = []
        self.links = []
        self.h1_count = 0
        self.issues = []
        self.stack = []

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if "id" in attributes:
            self.ids.append(attributes["id"])
        if tag == "label" and "for" in attributes:
            self.labels.append(attributes["for"])
        if tag in {"input", "select", "textarea"} and attributes.get("type") != "hidden" and "id" in attributes:
            self.controls.append(attributes["id"])
        if tag == "h1":
            self.h1_count += 1
        if tag == "img":
            if "alt" not in attributes:
                self.issues.append("image missing alt text")
            if "width" not in attributes or "height" not in attributes:
                self.issues.append("image missing intrinsic dimensions")
        if tag == "button" and "type" not in attributes:
            self.issues.append("button missing explicit type")
        for name in ("href", "src"):
            if attributes.get(name):
                self.links.append(attributes[name])
        if tag not in self.void_elements:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if tag in self.void_elements:
            return
        if not self.stack or self.stack[-1] != tag:
            self.issues.append(f"unbalanced closing tag: {tag}")
            if tag in self.stack:
                while self.stack and self.stack[-1] != tag:
                    self.stack.pop()
                if self.stack:
                    self.stack.pop()
        else:
            self.stack.pop()


def audit_page(file_path):
    source = file_path.read_text(encoding="utf-8")
    parser = PageAudit()
    parser.feed(source)
    issues = list(parser.issues)

    duplicate_ids = sorted({item for item in parser.ids if parser.ids.count(item) > 1})
    missing_labels = sorted(set(parser.controls) - set(parser.labels))
    if duplicate_ids:
        issues.append(f"duplicate ids: {duplicate_ids}")
    if missing_labels:
        issues.append(f"unlabelled form controls: {missing_labels}")
    if parser.h1_count != 1:
        issues.append(f"expected one h1, found {parser.h1_count}")
    if parser.stack:
        issues.append(f"unclosed tags: {parser.stack}")
    if not source.lower().startswith("<!doctype html>"):
        issues.append("missing HTML5 doctype")
    if '<html lang="en">' not in source:
        issues.append("missing page language")

    for raw_link in parser.links:
        if raw_link.startswith(("http://", "https://", "mailto:", "tel:", "#", "data:")):
            continue
        local_path = urlsplit(raw_link).path
        if local_path and not (file_path.parent / local_path).resolve().exists():
            issues.append(f"broken local reference: {raw_link}")

    return issues


def main():
    failures = []
    for html_file in HTML_FILES:
        issues = audit_page(html_file)
        if issues:
            failures.append(f"{html_file.relative_to(ROOT)}: " + "; ".join(issues))

    if failures:
        print("\n".join(failures))
        raise SystemExit(1)
    print(f"Structural audit passed for {len(HTML_FILES)} HTML pages.")


if __name__ == "__main__":
    main()
