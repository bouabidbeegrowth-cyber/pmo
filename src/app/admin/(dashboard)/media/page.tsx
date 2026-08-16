import { db } from "@/lib/db"
import { PageHeader } from "@/components/admin/page-header"
import { FormCard } from "@/components/admin/form-card"
import { format } from "date-fns"
import { Image as ImageIcon, Trash2 } from "lucide-react"
import { DeleteMediaButton } from "./delete-media-button"

export const dynamic = "force-dynamic"

export default async function MediaPage() {
  const media = await db.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Médiathèque"
        description={`${media.length} fichier${media.length > 1 ? "s" : ""} téléversé${media.length > 1 ? "s" : ""}.`}
      />

      {media.length === 0 ? (
        <FormCard>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ImageIcon className="w-12 h-12 text-muted-foreground/50 mb-3" />
            <h3 className="font-display text-lg font-semibold">Aucun média</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Les images téléversées depuis les formulaires apparaîtront ici.
            </p>
          </div>
        </FormCard>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {media.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-xl shadow-premium overflow-hidden group relative"
            >
              <div className="aspect-square bg-muted overflow-hidden">
                { }
                <img
                  src={m.url}
                  alt={m.alt ?? m.originalName ?? ""}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2">
                <div className="text-xs font-medium truncate" title={m.originalName ?? m.filename}>
                  {m.originalName ?? m.filename}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {format(m.createdAt, "dd MMM yyyy")}
                </div>
              </div>
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <DeleteMediaButton id={m.id} filename={m.filename} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
