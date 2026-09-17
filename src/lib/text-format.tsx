// Lightweight **bold** markdown support for CMS text fields (plain Textarea inputs
// can't do rich text, but admins can still highlight a phrase with **like this**).
export function renderBoldText(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold text-foreground">{part}</strong> : part,
  )
}

// Splits a comma-separated tagline into the brand's white / blue / orange sequence
// (matches the "Build. Lead. Sustain." treatment in the hero).
export function renderTriColorTagline(text: string) {
  const colors = ["text-white", "text-pmo-blue", "text-pmo-bright-orange"]
  const segments = text.split(",")
  return segments.map((seg, i) => (
    <span key={i} className={colors[i % colors.length]}>
      {seg.trim()}
      {i < segments.length - 1 ? ", " : ""}
    </span>
  ))
}
