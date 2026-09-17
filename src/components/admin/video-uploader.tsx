"use client"

import { useState, useRef, useCallback } from "react"
import { X, Loader2, Video as VideoIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface VideoUploaderProps {
  value?: string | null
  onChange: (url: string | null) => void
  label?: string
  className?: string
}

const MAX_MB = 40

export function VideoUploader({ value, onChange, label, className }: VideoUploaderProps) {
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
        toast.success("Vidéo téléversée avec succès.")
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
    if (!["video/mp4", "video/webm"].includes(file.type)) {
      toast.error("Veuillez sélectionner un fichier vidéo MP4 ou WebM.")
      return
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`Le fichier ne doit pas dépasser ${MAX_MB} Mo.`)
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
          "relative rounded-xl border-2 border-dashed transition-colors overflow-hidden bg-muted/30 aspect-video",
          dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/20",
        )}
      >
        {value ? (
          <>
            <video src={value} className="w-full h-full object-cover" muted loop autoPlay playsInline />
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
                  <VideoIcon className="w-5 h-5" />
                </div>
                <div className="text-sm font-medium">Glissez une vidéo ici</div>
                <div className="text-xs">ou cliquez pour parcourir (MP4/WebM, max {MAX_MB} Mo)</div>
              </>
            )}
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/webm"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  )
}
