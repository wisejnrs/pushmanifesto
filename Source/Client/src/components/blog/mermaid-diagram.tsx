"use client";

import { useEffect, useRef, useState } from "react";

let mermaidLoaded = false;

export function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        if (!mermaidLoaded) {
          mermaid.initialize({ startOnLoad: false, theme: "default", securityLevel: "strict" });
          mermaidLoaded = true;
        }
        const id = "mmd-" + Math.abs(hash(chart)).toString(36);
        const { svg } = await mermaid.render(id, chart);
        if (active) setSvg(svg);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Failed to render diagram");
      }
    })();
    return () => {
      active = false;
    };
  }, [chart]);

  if (error) {
    return (
      <pre className="overflow-x-auto rounded-md bg-slate-100 p-4 text-xs text-red-600">
        {error}
        {"\n\n"}
        {chart}
      </pre>
    );
  }

  return (
    <div
      ref={ref}
      className="my-6 flex justify-center [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

export default MermaidDiagram;
