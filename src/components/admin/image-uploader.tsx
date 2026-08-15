"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface ImageUploaderProps {
  value?: string | null
  onChange: (url: string | null) => void
  label?: string
  className?: string
  aspectRatio?: "square" | "video" | "portrait" | "wide"
}

const ASPECT_CLASSES: Record<NonNullable<ImageUploaderProps["aspectRatio"]>, string> = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  wide: "aspect-[16/9]",
}

export function ImageUploader({
  value,
  onChange,
  label,
  className,
  aspectRatio = "square",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = useCallback(
    async (file: File) => {
      setUploading(true)
      try {
        const fd = new FormData()
        fd.append("file", file)
        const res = await fetch("/api/upload", { method: "POST", body: fd })
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Upload failed" }))
          throw new Error(err.error || "Upload failed")
        }
        const data = await res.json()
        onChange(data.url)
        toast.success("Image téléversée avec succès.")
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Échec du téléversement.")
      } finally {
        setUploading(false)
      }
    },
    [onChange],
  )

  const handleFile = (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner un fichier image.")
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Le fichier ne doit pas dépasser 8 Mo.")
      return
    }
    upload(file)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "relative rounded-xl border-2 border-dashed transition-colors overflow-hidden bg-muted/30",
          dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/20",
          ASPECT_CLASSES[aspectRatio],
        )}
      >
        {value ? (
          <>
            { }
            <img src={value} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="rounded-lg bg-white/20 hover:bg-white/30 px-3 py-1.5 text-sm text-white backdrop-blur-sm"
                >
                  Remplacer
                </button>
                <button
                  type="button"
                  onClick={() => onChange(null)}
                  className="rounded-lg bg-red-500/80 hover:bg-red-500 px-3 py-1.5 text-sm text-white flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  Retirer
                </button>
              </div>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors p-4"
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div className="text-sm font-medium">Glissez une image ici</div>
                <div className="text-xs">ou cliquez pour parcourir (max 8 Mo)</div>
              </>
            )}
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {value && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="ou collez une URL d'image…"
            className="flex-1 h-9 px-3 text-xs rounded-md border bg-background font-mono"
          />
        </div>
      )}
    </div>
  )
}
