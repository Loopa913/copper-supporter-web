"use client";

import { useState, useRef } from "react";
import { UploadCloud, Loader2, Image as ImageIcon, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    try {
      setIsUploading(true);
      const supabase = createClient();
      
      // 버킷 이름: 'images' (Supabase 대시보드에서 생성 필요)
      const bucketName = "images";
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert(`업로드 실패: ${uploadError.message} (Supabase Storage에 'images' 버킷이 있는지 확인해주세요)`);
        return;
      }

      // 업로드 성공 시 Public URL 가져오기
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        onChange(publicUrlData.publicUrl);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-border group bg-black/5">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={disabled}
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ) : (
          <div className="w-16 h-16 shrink-0 rounded-lg border border-dashed border-border bg-surface-warm flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-text-muted" />
          </div>
        )}

        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || isUploading}
            placeholder="직접 이미지 URL을 입력하거나..."
            className="input-field text-sm py-1.5 w-full"
          />
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border border-dashed rounded-lg p-3 text-center transition-colors ${
              disabled || isUploading
                ? "bg-black/5 border-border/50 cursor-not-allowed"
                : "bg-surface-warm border-border hover:border-copper/50 hover:bg-copper/5 cursor-pointer"
            }`}
            onClick={() => {
              if (!disabled && !isUploading) {
                fileInputRef.current?.click();
              }
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            {isUploading ? (
              <div className="flex items-center justify-center gap-2 text-sm text-copper">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>업로드 중...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-sm text-text-muted">
                <UploadCloud className="w-4 h-4" />
                <span>클릭 또는 이미지를 여기로 드래그 앤 드롭</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
