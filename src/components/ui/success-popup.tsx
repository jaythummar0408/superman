"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Download, FileText, X, Plus } from "lucide-react";
import { Button } from "./button";

interface SuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onMergeMore?: () => void;
  fileName: string;
  fileSize: number;
  fileBlob: Blob | null;
  title?: string;
}

export function SuccessPopup({
  isOpen,
  onClose,
  onMergeMore,
  fileName: initialFileName,
  fileSize,
  fileBlob,
  title = "Task Completed Successfully!"
}: SuccessPopupProps) {
  const [fileName, setFileName] = useState(initialFileName);
  
  useEffect(() => {
    if (isOpen) {
      setFileName(initialFileName);
      
      // Calculate scrollbar width and prevent body scrolling to match search modal
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
    };
  }, [isOpen, initialFileName]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!fileBlob) return;
    
    // Make sure filename has extension if it was removed
    let finalName = fileName;
    const extension = initialFileName.split('.').pop() || 'pdf';
    if (!finalName.endsWith(`.${extension}`)) {
      finalName = `${finalName}.${extension}`;
    }

    const url = URL.createObjectURL(fileBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = finalName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/50 backdrop-blur-[2px] transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-500">
            <CheckCircle2 className="h-8 w-8" strokeWidth={2.5} />
          </div>
          
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Your file is ready. You can rename it below before downloading.
          </p>

          {/* File Card & Rename Input */}
          <div className="mb-6 w-full rounded-xl border border-border/60 bg-muted/20 p-4 text-left">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <label htmlFor="filename" className="mb-1 block text-xs font-medium text-muted-foreground">
                  File Name
                </label>
                <input
                  id="filename"
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
            <div className="flex justify-between px-1 text-xs text-muted-foreground">
              <span>Size: {(fileSize / 1024 / 1024).toFixed(2)} MB</span>
              <span>Ready to download</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex w-full flex-col sm:flex-row gap-3">
            <Button size="lg" className="w-full sm:flex-1 gap-2 shadow-md" onClick={handleDownload}>
              <Download className="h-5 w-5" />
              Download
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:flex-1 gap-2" 
              onClick={onMergeMore || onClose}
            >
              <Plus className="h-5 w-5 shrink-0" />
              Merge More Files
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
