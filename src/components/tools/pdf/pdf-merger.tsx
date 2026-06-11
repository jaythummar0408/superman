"use client";

import React, { useState, useRef } from "react";
import { FileUploader } from "@/components/ui/file-uploader";
import { Button } from "@/components/ui/button";
import { FileText, X, Merge, FileUp, GripVertical } from "lucide-react";
import { SuccessPopup } from "@/components/ui/success-popup";

export function PdfMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Success Popup State
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [mergedFileBlob, setMergedFileBlob] = useState<Blob | null>(null);
  const [mergedFileName, setMergedFileName] = useState("");
  const [mergedFileSize, setMergedFileSize] = useState(0);

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleFileSelect = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSort = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const _files = [...files];
      const draggedFileContent = _files.splice(dragItem.current, 1)[0];
      _files.splice(dragOverItem.current, 0, draggedFileContent);
      setFiles(_files);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    
    setIsProcessing(true);
    
    // Simulate processing time (2.5 seconds loader)
    setTimeout(() => {
      setIsProcessing(false);
      
      // Calculate total size to simulate merged file size
      const totalSize = files.reduce((acc, file) => acc + file.size, 0);
      
      // Generate a mock blob (Replace with pdf-lib output later)
      const fakeBlob = new Blob(["Mock PDF Content"], { type: "application/pdf" });
      
      setMergedFileBlob(fakeBlob);
      setMergedFileName("merged-document.pdf");
      setMergedFileSize(totalSize);
      setIsSuccessOpen(true);
      
    }, 2500);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="rounded-2xl border border-border/40 bg-white dark:bg-card p-6 shadow-sm">
        
        {/* Main Uploader Component (Always visible at the top) */}
        <FileUploader
          onFileSelect={handleFileSelect}
          accept=".pdf,application/pdf"
          multiple={true}
          maxSizeMB={50}
          title="Select PDF files to merge"
          subtitle="Support for multiple PDF upload. Maximum file size: 50MB"
          icon={FileUp}
        />

        {/* Selected Files List (Below the uploader) */}
        {files.length > 0 && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Selected Files ({files.length})
              </h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setFiles([])}
                className="text-muted-foreground"
              >
                Clear all
              </Button>
            </div>

            <div className="space-y-3">
              {files.map((file, index) => (
                <div 
                  key={`${file.name}-${index}`}
                  draggable
                  onDragStart={(e) => (dragItem.current = index)}
                  onDragEnter={(e) => (dragOverItem.current = index)}
                  onDragEnd={handleSort}
                  onDragOver={(e) => e.preventDefault()}
                  className="flex cursor-grab active:cursor-grabbing items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <GripVertical className="h-5 w-5 text-muted-foreground/50 shrink-0" />
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Area */}
      {files.length > 0 && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <Button 
            size="lg" 
            className="w-full sm:w-auto min-w-[200px] h-14 text-base shadow-md"
            disabled={files.length < 2 || isProcessing}
            onClick={handleMerge}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></span>
                Merging PDFs...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Merge className="h-5 w-5" />
                Merge PDFs
              </span>
            )}
          </Button>
          
          {files.length === 1 && (
            <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
              Please select at least 2 PDF files to merge.
            </p>
          )}
        </div>
      )}

      {/* Success Modal */}
      <SuccessPopup 
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        onMergeMore={() => {
          setFiles([]);
          setIsSuccessOpen(false);
        }}
        fileName={mergedFileName}
        fileSize={mergedFileSize}
        fileBlob={mergedFileBlob}
        title="PDFs Merged Successfully!"
      />
    </div>
  );
}
