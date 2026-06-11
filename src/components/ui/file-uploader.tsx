"use client";

import React, { useCallback, useRef, useState } from "react";
import { UploadCloud, type LucideIcon } from "lucide-react";
import { toast } from "sonner";

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
}

export function FileUploader({
  onFileSelect,
  accept,
  multiple = false,
  maxSizeMB = 25,
  title = "Click or drag file to this area to upload",
  subtitle,
  icon: Icon = UploadCloud,
  className = "",
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const acceptedTypes = accept ? accept.split(',').map(t => t.trim().toLowerCase()) : [];

    for (const file of files) {
      // 1. Validate File Type
      if (acceptedTypes.length > 0) {
        let isAccepted = false;
        for (const type of acceptedTypes) {
          if (type.startsWith('.')) {
            // Extension match (e.g. .pdf)
            if (file.name.toLowerCase().endsWith(type)) {
              isAccepted = true;
              break;
            }
          } else if (type.endsWith('/*')) {
            // Wildcard MIME match (e.g. image/*)
            const baseType = type.split('/')[0];
            if (file.type.startsWith(`${baseType}/`)) {
              isAccepted = true;
              break;
            }
          } else {
            // Exact MIME match (e.g. application/pdf)
            if (file.type === type) {
              isAccepted = true;
              break;
            }
          }
        }

        if (!isAccepted) {
          toast.error(`File "${file.name}" is not a supported format.`);
          continue; // Skip this file
        }
      }

      // 2. Validate File Size
      if (file.size > maxSizeBytes) {
        toast.error(`File "${file.name}" exceeds the ${maxSizeMB}MB limit.`);
        continue; // Skip this file
      }
      
      validFiles.push(file);
    }

    return validFiles;
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) {
        // If single file mode, only take the first file
        const filesToProcess = multiple ? droppedFiles : [droppedFiles[0]];
        const validFiles = validateFiles(filesToProcess);
        
        if (validFiles.length > 0) {
          onFileSelect(validFiles);
        }
      }
    },
    [multiple, onFileSelect, maxSizeMB, accept]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const selectedFiles = Array.from(e.target.files);
        const validFiles = validateFiles(selectedFiles);
        
        if (validFiles.length > 0) {
          onFileSelect(validFiles);
        }
        
        // Reset input so the same file can be uploaded again if needed
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [onFileSelect, maxSizeMB, accept]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-all duration-200 ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border/60 bg-muted/10 hover:border-primary/50 hover:bg-muted/30"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
        />

        <div
          className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
            isDragging ? "bg-primary/20 text-primary" : "bg-primary/10 text-primary"
          }`}
        >
          <Icon className="h-6 w-6" strokeWidth={1.5} />
        </div>

        <h3 className="mb-1.5 text-base font-semibold text-foreground">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground">
          {subtitle || `Support for ${multiple ? 'multiple' : 'single'} file upload. Maximum file size: ${maxSizeMB}MB`}
        </p>
      </div>
    </div>
  );
}
