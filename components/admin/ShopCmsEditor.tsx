"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import type { ShopContent } from "@/lib/cms/shop-content";
import { SoftCard } from "@/components/ui/SoftCard";
import { updateSiteContent } from "@/app/admin/actions";
import { ImageUpload } from "@/components/ui/ImageUpload";

export function ShopCmsEditor({
  initialData,
  disabled,
}: {
  initialData: ShopContent;
  disabled: boolean;
}) {
  const [data, setData] = useState<ShopContent>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    setSaved(false);
    try {
      const safeData = JSON.parse(JSON.stringify(data));
      await updateSiteContent("shop", "intro", safeData.intro);
      await updateSiteContent("shop", "goods", safeData.goods);
      await updateSiteContent("shop", "cta", safeData.cta);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save shop content", error);
      alert("저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleIntroChange(key: keyof typeof data.intro, value: string) {
    setData((prev) => ({
      ...prev,
      intro: { ...prev.intro, [key]: value },
    }));
  }

  function handleCtaChange(key: keyof typeof data.cta, value: string) {
    setData((prev) => ({
      ...prev,
      cta: { ...prev.cta, [key]: value },
    }));
  }

  function handleGoodsChange(index: number, key: keyof typeof data.goods[0], value: any) {
    setData((prev) => {
      const newGoods = [...prev.goods];
      newGoods[index] = { ...newGoods[index], [key]: value };
      return { ...prev, goods: newGoods };
    });
  }

  function addGoods() {
    setData((prev) => ({
      ...prev,
      goods: [
        ...prev.goods,
        { id: Math.random().toString(36).substr(2, 9), name: "", description: "", imageUrls: [] },
      ],
    }));
  }

  function removeGoods(index: number) {
    setData((prev) => ({
      ...prev,
      goods: prev.goods.filter((_, i) => i !== index),
    }));
  }

  return (
    <SoftCard interactive={false} className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-text-primary">
            굿즈 제작 지원 편집
          </h2>
          <p className="mt-1 text-sm font-light text-text-secondary">
            굿즈 제작 지원 창의 소개 문구와 상품 목록을 관리합니다.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={disabled || isSaving}
          className="btn-copper flex min-w-[100px] items-center justify-center gap-2"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            "저장됨"
          ) : (
            <>
              <Save className="h-4 w-4" />
              저장
            </>
          )}
        </button>
      </div>

      <div className="space-y-6">
        <div className="space-y-4 rounded-xl bg-black/[0.02] p-4">
          <h3 className="font-medium">소개 섹션</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-medium text-text-secondary">제목</label>
              <input
                type="text"
                value={data.intro.title}
                onChange={(e) => handleIntroChange("title", e.target.value)}
                disabled={disabled}
                className="input-field"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-medium text-text-secondary">설명</label>
              <textarea
                value={data.intro.description}
                onChange={(e) => handleIntroChange("description", e.target.value)}
                disabled={disabled}
                className="input-field min-h-[80px] resize-y"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-medium text-text-secondary">지원 안내 (Support Note)</label>
              <textarea
                value={data.intro.supportNote}
                onChange={(e) => handleIntroChange("supportNote", e.target.value)}
                disabled={disabled}
                className="input-field min-h-[60px] resize-y"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-xl bg-black/[0.02] p-4">
          <h3 className="font-medium">하단 이동 링크 (CTA 버튼)</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary">버튼 텍스트</label>
              <input
                type="text"
                value={data.cta.label}
                onChange={(e) => handleCtaChange("label", e.target.value)}
                disabled={disabled}
                className="input-field"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary">이동할 링크 URL</label>
              <input
                type="text"
                value={data.cta.href}
                onChange={(e) => handleCtaChange("href", e.target.value)}
                disabled={disabled}
                placeholder="https://..."
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">상품 목록</h3>
            <button
              type="button"
              onClick={addGoods}
              disabled={disabled}
              className="flex items-center gap-1 text-sm font-medium text-copper hover:underline"
            >
              <Plus className="h-4 w-4" />
              상품 추가
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {data.goods.map((item, index) => (
              <div key={item.id} className="relative rounded-xl border border-border p-4">
                <button
                  type="button"
                  onClick={() => removeGoods(index)}
                  disabled={disabled}
                  className="absolute right-2 top-2 rounded-md p-1.5 text-text-muted hover:bg-black/5 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="mt-2 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-text-secondary">상품명</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleGoodsChange(index, "name", e.target.value)}
                      disabled={disabled}
                      className="input-field text-sm py-1.5"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-text-secondary">설명</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleGoodsChange(index, "description", e.target.value)}
                      disabled={disabled}
                      className="input-field text-sm py-1.5"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-text-secondary">이미지 (최대 10장)</label>
                      <button
                        type="button"
                        onClick={() => {
                          const urls = item.imageUrls?.length ? item.imageUrls : (item.imageUrl ? [item.imageUrl] : []);
                          if (urls.length < 10) {
                            handleGoodsChange(index, "imageUrls", [...urls, ""]);
                          }
                        }}
                        disabled={disabled || (item.imageUrls?.length || (item.imageUrl ? 1 : 0)) >= 10}
                        className="text-[11px] font-medium text-copper hover:underline disabled:opacity-50"
                      >
                        + 사진 추가
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(item.imageUrls?.length ? item.imageUrls : (item.imageUrl ? [item.imageUrl] : [""])).map((url, imgIndex) => (
                        <div key={imgIndex} className="relative">
                          <ImageUpload
                            value={url}
                            onChange={(newUrl) => {
                              const urls = item.imageUrls?.length ? [...item.imageUrls] : (item.imageUrl ? [item.imageUrl] : [""]);
                              urls[imgIndex] = newUrl;
                              handleGoodsChange(index, "imageUrls", urls);
                              // clean up imageUrl if exists
                              if (item.imageUrl) handleGoodsChange(index, "imageUrl", "");
                            }}
                            disabled={disabled}
                          />
                          {(item.imageUrls?.length || (item.imageUrl ? 1 : 0)) > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const urls = item.imageUrls?.length ? [...item.imageUrls] : (item.imageUrl ? [item.imageUrl] : [""]);
                                urls.splice(imgIndex, 1);
                                handleGoodsChange(index, "imageUrls", urls);
                              }}
                              className="absolute -right-2 -top-2 rounded-full bg-white p-1 text-red-500 shadow-md border border-border hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SoftCard>
  );
}
