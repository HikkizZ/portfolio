/**
 * Plugin rehype propio, sin dependencias nuevas.
 *
 * En el Markdown de los proyectos, cada decisión técnica se escribe como
 * `### Título` seguido de párrafos `**Decisión:** …`, `**Por qué:** …`,
 * opcionalmente `**Alternativa descartada:** …` y `**Qué cambiaría hoy:** …`
 * (02_diseno.md §3.2/§6.10, 04_plan_implementacion.md Fase 3). Este plugin
 * corre después de remark-rehype (sobre el árbol hast, ya HTML) y reescribe
 * ese patrón como el mismo `<dl>` que dibuja
 * src/components/ui/DecisionBlock.astro, con las mismas clases, para que el
 * cuerpo Markdown se vea igual sin necesitar MDX. Si cambian las clases de
 * DecisionBlock.astro, hay que actualizarlas también acá.
 *
 * Solo transforma un `h3` cuyo párrafo siguiente empiece exactamente con
 * `**Decisión:**` — cualquier otro `h3` (no debería haber otros en el
 * cuerpo) queda intacto.
 */

interface HastText {
  type: "text";
  value: string;
}

interface HastElement {
  type: "element";
  tagName: string;
  properties?: Record<string, unknown>;
  children: HastNode[];
}

interface HastRoot {
  type: "root";
  children: HastNode[];
}

type HastNode = HastElement | HastText | { type: string; children?: HastNode[] };

type DecisionKey = "decision" | "why" | "discarded" | "changeToday";

const LABELS: Record<string, DecisionKey> = {
  "Decisión:": "decision",
  "Por qué:": "why",
  "Alternativa descartada:": "discarded",
  "Qué cambiaría hoy:": "changeToday",
};

// Debe reflejar es.json → "decision" (dt visibles del bloque).
const DT_LABEL_TEXT: Record<DecisionKey, string> = {
  decision: "Decisión",
  why: "Por qué",
  discarded: "Alternativa descartada",
  changeToday: "Qué cambiaría hoy",
};

function isElement(node: HastNode, tagName?: string): node is HastElement {
  return node.type === "element" && (!tagName || (node as HastElement).tagName === tagName);
}

function textOf(node: HastNode): string {
  if (node.type === "text") return (node as HastText).value;
  const children = (node as HastElement).children ?? [];
  return children.map(textOf).join("");
}

function parseDecisionParagraph(
  p: HastElement,
): { key: DecisionKey; content: HastNode[] } | null {
  const [first, ...rest] = p.children;
  if (!first || !isElement(first, "strong")) return null;
  const key = LABELS[textOf(first).trim()];
  if (!key) return null;

  const content = [...rest];
  if (content.length > 0 && content[0].type === "text") {
    const text = content[0] as HastText;
    content[0] = { type: "text", value: text.value.replace(/^\s+/, "") };
  }
  return { key, content };
}

function dt(text: string): HastElement {
  return {
    type: "element",
    tagName: "dt",
    properties: { className: ["text-mono", "text-text-muted"] },
    children: [{ type: "text", value: text }],
  };
}

function dd(content: HastNode[]): HastElement {
  return {
    type: "element",
    tagName: "dd",
    properties: { className: ["mt-1", "text-body", "text-text"] },
    children: content,
  };
}

function buildDecisionBlock(heading: HastElement, entries: Map<DecisionKey, HastNode[]>): HastElement {
  const order: DecisionKey[] = ["decision", "why", "discarded", "changeToday"];
  const rows: HastElement[] = [];
  for (const key of order) {
    const content = entries.get(key);
    if (!content) continue;
    rows.push({
      type: "element",
      tagName: "div",
      children: [dt(DT_LABEL_TEXT[key]), dd(content)],
    });
  }

  return {
    type: "element",
    tagName: "div",
    properties: { className: ["border-l-2", "border-border-strong", "pl-4"] },
    children: [
      {
        type: "element",
        tagName: "h3",
        properties: { className: ["text-h3", "text-text"] },
        children: heading.children,
      },
      {
        type: "element",
        tagName: "dl",
        properties: { className: ["mt-3", "flex", "flex-col", "gap-3"] },
        children: rows,
      },
    ],
  };
}

function isWhitespaceText(node: HastNode): boolean {
  return node.type === "text" && /^\s*$/.test((node as HastText).value);
}

function transform(children: HastNode[]): HastNode[] {
  const result: HastNode[] = [];

  for (let i = 0; i < children.length; i++) {
    const node = children[i];

    if (isElement(node, "h3")) {
      const entries = new Map<DecisionKey, HastNode[]>();
      let j = i + 1;
      while (j < children.length) {
        if (isWhitespaceText(children[j])) {
          j++;
          continue;
        }
        if (!isElement(children[j], "p")) break;
        const parsed = parseDecisionParagraph(children[j] as HastElement);
        if (!parsed) break;
        entries.set(parsed.key, parsed.content);
        j++;
      }

      if (entries.has("decision") && entries.has("why")) {
        result.push(buildDecisionBlock(node, entries));
        i = j - 1;
        continue;
      }
    }

    if (isElement(node)) {
      node.children = transform(node.children);
    }
    result.push(node);
  }

  return result;
}

export default function rehypeDecisionBlocks() {
  return (tree: HastRoot) => {
    tree.children = transform(tree.children);
  };
}
