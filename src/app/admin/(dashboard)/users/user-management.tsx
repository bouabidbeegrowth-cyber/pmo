"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { FormCard } from "@/components/admin/form-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, Plus, Save, Pencil, Trash2, ShieldCheck, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { passwordStrength, MIN_PASSWORD_SCORE } from "@/lib/password"

interface AdminUserLite {
  id: string
  email: string
  name: string
  role: string
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
}

type NewUser = { name: string; email: string; password: string; role: "ADMIN" | "SUPER_ADMIN" }

const EMPTY_NEW: NewUser = { name: "", email: "", password: "", role: "ADMIN" }

export function UserManagement({ currentUserId }: { currentUserId: string }) {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<AdminUserLite[]>([])
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newUser, setNewUser] = useState<NewUser>(EMPTY_NEW)
  const [editing, setEditing] = useState<AdminUserLite | null>(null)
  const [editPassword, setEditPassword] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/users")
      if (!res.ok) throw new Error("Failed")
      setUsers(await res.json())
    } catch {
      toast.error("Échec du chargement des utilisateurs.")
    } finally {
      setLoading(false)
    }
  }

  const newStrength = passwordStrength(newUser.password)
  const canCreate = newUser.name.trim() && newUser.email.trim() && newStrength.score >= MIN_PASSWORD_SCORE

  async function createUser() {
    if (!canCreate) return
    setCreating(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed")
      toast.success("Utilisateur créé.")
      setCreateOpen(false)
      setNewUser(EMPTY_NEW)
      await load()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec de la création.")
    } finally {
      setCreating(false)
    }
  }

  const editStrength = passwordStrength(editPassword)
  const editPasswordValid = editPassword.length === 0 || editStrength.score >= MIN_PASSWORD_SCORE

  async function saveEdit() {
    if (!editing || !editPasswordValid) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/users/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editing.name,
          email: editing.email,
          role: editing.role,
          isActive: editing.isActive,
          ...(editPassword ? { newPassword: editPassword } : {}),
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed")
      toast.success("Utilisateur mis à jour.")
      setEditing(null)
      setEditPassword("")
      await load()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec de la mise à jour.")
    } finally {
      setSaving(false)
    }
  }

  async function removeUser(id: string) {
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed")
      toast.success("Utilisateur supprimé.")
      await load()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec de la suppression.")
    }
  }

  return (
    <FormCard
      title="Gestion des utilisateurs"
      description="Créez, modifiez ou supprimez des comptes administrateurs."
    >
      <div className="flex justify-end mb-4">
        <Button onClick={() => setCreateOpen(true)} className="bg-pmo-violet-gradient text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nouvel utilisateur
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Dernière connexion</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">
                  {u.name}
                  {u.id === currentUserId && (
                    <span className="text-xs text-muted-foreground ml-1.5">(vous)</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      u.role === "SUPER_ADMIN"
                        ? "bg-pmo-violet/10 text-pmo-violet"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {u.role === "SUPER_ADMIN" && <ShieldCheck className="w-3 h-3 mr-1" />}
                    {u.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={u.isActive ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"}>
                    {u.isActive ? "Actif" : "Inactif"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {u.lastLoginAt
                    ? format(new Date(u.lastLoginAt), "dd MMM yyyy HH:mm", { locale: fr })
                    : "Jamais"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => {
                        setEditing(u)
                        setEditPassword("")
                      }}
                      className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-primary"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          disabled={u.id === currentUserId}
                          className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer cet utilisateur ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. Le compte <strong>{u.email}</strong> perdra
                            immédiatement l&apos;accès à l&apos;administration.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => removeUser(u.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvel utilisateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm">Nom</Label>
              <Input
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Email</Label>
              <Input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Mot de passe</Label>
              <Input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
              {newUser.password.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        newStrength.score <= 1
                          ? "bg-red-500 w-1/4"
                          : newStrength.score === 2
                            ? "bg-amber-500 w-1/2"
                            : newStrength.score === 3
                              ? "bg-blue-500 w-3/4"
                              : "bg-emerald-500 w-full"
                      }`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-20">{newStrength.label}</span>
                </div>
              )}
              {newUser.password.length > 0 && newStrength.score < MIN_PASSWORD_SCORE && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Trop faible — au moins 8 caractères, mélangez majuscules, minuscules, chiffres ou symboles.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Rôle</Label>
              <Select
                value={newUser.role}
                onValueChange={(v) => setNewUser({ ...newUser, role: v as "ADMIN" | "SUPER_ADMIN" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={createUser}
              disabled={!canCreate || creating}
              className="bg-pmo-violet-gradient text-white"
            >
              {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l&apos;utilisateur</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Nom</Label>
                <Input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Email</Label>
                <Input
                  type="email"
                  value={editing.email}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Nouveau mot de passe (optionnel)</Label>
                <Input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Laisser vide pour ne pas changer"
                />
                {editPassword.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          editStrength.score <= 1
                            ? "bg-red-500 w-1/4"
                            : editStrength.score === 2
                              ? "bg-amber-500 w-1/2"
                              : editStrength.score === 3
                                ? "bg-blue-500 w-3/4"
                                : "bg-emerald-500 w-full"
                        }`}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-20">{editStrength.label}</span>
                  </div>
                )}
                {editPassword.length > 0 && !editPasswordValid && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Trop faible — au moins 8 caractères, mélangez majuscules, minuscules, chiffres ou symboles.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Rôle</Label>
                <Select
                  value={editing.role}
                  onValueChange={(v) => setEditing({ ...editing, role: v })}
                  disabled={editing.id === currentUserId}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <Label className="text-sm">Compte actif</Label>
                <Switch
                  checked={editing.isActive}
                  onCheckedChange={(v) => setEditing({ ...editing, isActive: v })}
                  disabled={editing.id === currentUserId}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Annuler
            </Button>
            <Button
              onClick={saveEdit}
              disabled={!editPasswordValid || saving}
              className="bg-pmo-violet-gradient text-white"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormCard>
  )
}
