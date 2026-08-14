"use client";

import React, { useState } from "react";
import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";
import { xml as xmlLang } from "@codemirror/lang-xml";
import { Trash2, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CodeEditor,
  CopyButton,
  Panel,
  Segmented,
  StatusNote,
  downloadText,
} from "@/components/tools/dev/dev-tool-ui";

const xmlExt = [xmlLang()];

const SAMPLE = `<note><to>World</to><from>Notch</from><tags><tag>dev</tag><tag>tools</tag></tags><meta id="1" pinned="true"/></note>`;

const PARSER_OPTS = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  preserveOrder: true,
  parseTagValue: false,
  trimValues: true,
};

/* ------------------------------------------------------------------ */
/* XML Formatter                                                      */
/* ------------------------------------------------------------------ */
export function XmlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [indent, setIndent] = useState(2);

  const run = (text: string, ind: number) => {
    if (!text.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    const check = XMLValidator.validate(text, { allowBooleanAttributes: true });
    if (check !== true) {
      setError(`${check.err.msg} (line ${check.err.line}, col ${check.err.col})`);
      setOutput("");
      return;
    }
    try {
      const parsed = new XMLParser(PARSER_OPTS).parse(text);
      const builder = new XMLBuilder({
        ...PARSER_OPTS,
        format: true,
        indentBy: " ".repeat(ind),
      });
      setOutput(builder.build(parsed).trimEnd());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not format XML");
      setOutput("");
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel
        title="Input XML"
        actions={
          <>
            <Segmented<"2" | "4">
              value={indent === 4 ? "4" : "2"}
              onChange={(v) => {
                const n = Number(v);
                setIndent(n);
                run(input, n);
              }}
              options={[
                { label: "2 spaces", value: "2" },
                { label: "4 spaces", value: "4" },
              ]}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setInput(SAMPLE);
                run(SAMPLE, indent);
              }}
            >
              Sample
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setInput("");
                setOutput("");
                setError(null);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
          </>
        }
      >
        <CodeEditor
          value={input}
          onChange={(v) => {
            setInput(v);
            run(v, indent);
          }}
          extensions={xmlExt}
          placeholder="Paste XML here…"
        />
        {error && (
          <div className="mt-3">
            <StatusNote variant="error">{error}</StatusNote>
          </div>
        )}
      </Panel>

      <Panel
        title="Formatted"
        actions={
          <>
            <CopyButton value={output} />
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              disabled={!output}
              onClick={() => downloadText("formatted.xml", output, "application/xml")}
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </>
        }
      >
        <CodeEditor value={output} extensions={xmlExt} readOnly placeholder="Formatted XML appears here…" />
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* XML Validator                                                      */
/* ------------------------------------------------------------------ */
export function XmlValidator() {
  const [input, setInput] = useState("");
  const [state, setState] = useState<{ ok: boolean; message: string } | null>(null);

  const validate = (text: string) => {
    if (!text.trim()) {
      setState(null);
      return;
    }
    const check = XMLValidator.validate(text, { allowBooleanAttributes: true });
    if (check === true) {
      setState({ ok: true, message: "Valid XML — the document is well-formed." });
    } else {
      setState({
        ok: false,
        message: `${check.err.msg} (line ${check.err.line}, col ${check.err.col})`,
      });
    }
  };

  return (
    <Panel
      title="XML to validate"
      actions={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setInput(SAMPLE);
              validate(SAMPLE);
            }}
          >
            Sample
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={() => {
              setInput("");
              setState(null);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </Button>
        </>
      }
    >
      <CodeEditor
        value={input}
        onChange={(v) => {
          setInput(v);
          validate(v);
        }}
        extensions={xmlExt}
        placeholder="Paste XML to check for well-formedness…"
      />
      {state && (
        <div className="mt-3">
          <StatusNote variant={state.ok ? "success" : "error"}>{state.message}</StatusNote>
        </div>
      )}
    </Panel>
  );
}
