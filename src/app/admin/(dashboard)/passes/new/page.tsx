import { PassForm } from "@/components/admin/pass-form"

const ALLOWED_CATEGORIES = ["EVENEMENT", "FORMATION", "DUO", "ETUDIANT", "AUTRE"]

export default async function NewPassPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const initialCategory = category && ALLOWED_CATEGORIES.includes(category.toUpperCase())
    ? category.toUpperCase()
    : undefined

  return <PassForm initialCategory={initialCategory} />
}
