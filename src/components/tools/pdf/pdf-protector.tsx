"use client";

import React, { useState } from "react";
import { PDFDocument } from "@cantoo/pdf-lib";
import { FileUp, Lock, Eye, EyeOff } from "lucide-react";

import {
  FileUploader,
  Panel,
  Field,
  FileChip,
  ProcessButton,
  ResultCard,
  StatusNote,
  controlInputClass,
  downloadBlob,
} from "@/components/tools/pdf/pdf-ui";

export function PdfProtector() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string; size: number } | null>(null);

  const protectFile = async () => {
    if (!file) return;
    if (password.length < 3) return setError("Choose a password of at least 3 characters.");
    if (password !== confirm) return setError("Passwords don't match.");
    setProcessing(true);
    setError(null);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      await doc.encrypt({ userPassword: password, ownerPassword: password });
      const out = await doc.save();
      const blob = new Blob([out as BlobPart], { type: "application/pdf" });
      setResult({ blob, name: file.name.replace(/\.pdf$/i, "") + "_protected.pdf", size: blob.size });
    } catch {
      setError("Couldn't protect this file. Make sure it is a valid PDF.");
    } finally {
      setProcessing(false);
    }
  };

  if (result) {
    return (
      <div className="mx-auto max-w-2xl">
        <ResultCard
          fileName={result.name}
          size={result.size}
          onDownload={() => downloadBlob(result.blob, result.name)}
          onReset={() => {
            setResult(null);
            setFile(null);
            setPassword("");
            setConfirm("");
          }}
          title="PDF password-protected"
          note="Keep your password safe — it cannot be recovered."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Panel>
        {!file ? (
          <FileUploader onFileSelect={(f) => setFile(f[0])} accept=".pdf,application/pdf" maxSizeMB={50} title="Select a PDF to protect" icon={FileUp} />
        ) : (
          <div className="space-y-5">
            <FileChip file={file} onRemove={() => setFile(null)} />
            <Field label="Password">
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className={`${controlInputClass} pr-10`}
                />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
            <Field label="Confirm password">
              <input type={show ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" className={controlInputClass} />
            </Field>
          </div>
        )}
      </Panel>
      {error && <StatusNote variant="error">{error}</StatusNote>}
      {file && (
        <ProcessButton onClick={protectFile} loading={processing} disabled={!password || !confirm}>
          <Lock className="h-5 w-5" />
          Protect PDF
        </ProcessButton>
      )}
    </div>
  );
}
