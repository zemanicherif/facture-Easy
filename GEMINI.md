# GEMINI.md — Facture'Easy SaaS

> **Fichier de référence pour tout futur modèle IA assistant sur ce projet.**
> Mis à jour le : 08 Octobre 2026

---

## 1. Description de l'Application

**Facture'Easy** est un SaaS de gestion de facturation conçu pour les entrepreneurs et PME d'Afrique de l'Ouest (Sénégal, Burkina Faso, Côte d'Ivoire, Mali, etc.).

- Devise : **FCFA** (Franc CFA)
- TVA : **18% automatique** (norme SYSCOHADA)
- Langue : **Français**
- Contexte légal : **NINEA / RCCM** (numéros d'identification fiscale locaux)

---

## 2. Technologies Utilisées

| Technologie | Version | Rôle |
|---|---|---|
| **Next.js** | ^15.1.7 | Framework React (App Router) |
| **React** | ^19.0.0 | UI library |
| **TypeScript** | ^5.7.3 | Typage statique |
| **Tailwind CSS** | ^3.4.17 | Styling (classes utilitaires) |
| **lucide-react** | ^0.475.0 | Icônes vectorielles |
| **jsPDF** | ^4.2.1 | Génération de PDF côté client |
| **html2canvas** | ^1.4.1 | Capture du DOM en image (pour PDF) |
| **clsx + tailwind-merge** | latest | Utilitaire de fusion de classes CSS |

**Commande pour lancer en local :**
```bash
npm run dev
# Ouvre : http://localhost:3000/dashboard
```

---

## 3. Structure des Fichiers

```
SAAS FACTURE/
├── index.html                        # Landing page marketing (HTML pur, séparé de Next.js)
├── package.json
├── tailwind.config.ts                # Thème personnalisé (couleurs brand emerald, shadows)
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Layout racine (font Jakarta, meta SEO)
│   │   ├── page.tsx                  # Dashboard principal (landing/accueil Next.js)
│   │   ├── globals.css               # CSS global (animations float, fadeIn)
│   │   ├── not-found.tsx             # Page 404 personnalisée
│   │   ├── dashboard/
│   │   │   ├── layout.tsx            # Layout du dashboard (Sidebar + Topbar)
│   │   │   └── page.tsx              # Vue d'ensemble : KPIs, tableau factures récentes
│   │   ├── invoices/
│   │   │   ├── page.tsx              # Liste complète de toutes les factures
│   │   │   ├── new/
│   │   │   │   └── page.tsx          # Création d'une nouvelle facture
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # Détail d'une facture (lecture + actions)
│   │   │       └── edit/
│   │   │           └── page.tsx      # Édition d'une facture existante
│   │   ├── clients/
│   │   │   └── page.tsx              # Gestion des clients
│   │   ├── settings/
│   │   │   └── page.tsx              # Paramètres utilisateur
│   │   └── api/                      # Routes API (Next.js API routes)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx           # Navigation latérale (fixe, responsive)
│   │   │   └── Topbar.tsx            # Barre du haut (recherche, MonthPicker, profil)
│   │   └── ui/
│   │       ├── Badge.tsx             # Badge de statut (Payée / En attente / Impayée)
│   │       ├── Button.tsx            # Bouton réutilisable (variantes: primary, outline, ghost)
│   │       ├── Card.tsx              # Conteneur carte avec shadow
│   │       ├── DatePicker.tsx        # Calendrier jour/mois (compact, émeraude)
│   │       ├── MonthPicker.tsx       # Sélecteur mois uniquement (grille 3x4)
│   │       ├── Dropdown.tsx          # Menu déroulant réutilisable
│   │       └── Input.tsx             # Champ de saisie stylisé avec label
│   └── lib/
│       ├── types.ts                  # Interfaces TypeScript (Invoice, InvoiceItem, Client)
│       ├── mockData.ts               # Données de démonstration (initialInvoices, initialClients)
│       └── utils.ts                  # Helpers (formatFCFA, cn)
```

---

## 4. Fonctionnalités Implémentées

### 🏠 Dashboard (`/dashboard`)
- **4 KPI Cards** : Total Encaissé, Total TVA collectée, Total en Attente, Nombre de Clients
- **Tableau des factures récentes** : N° facture, client, montant HT, TVA 18%, Total TTC, statut, actions
- **Filtres par statut** : Toutes / Payée / En attente / Impayée
- **Recherche** : par n° facture, client, email
- **Filtre par date** (DatePicker) : sélection d'une date précise sur le tableau
- **Filtre par catégorie** : Dropdown (Services, Produits, Consulting, Entreprises)
- **Marquer comme payée** directement depuis le tableau (bouton ✅)
- **Supprimer une facture** avec confirmation
- **Bouton "Nouvelle Facture"** en accès rapide
- **Export CSV / Excel** (bouton, logique extensible)

### 📄 Liste des Factures (`/invoices`)
- Tableau complet avec toutes les colonnes (N°, client, dates, HT, TVA, TTC, statut)
- Filtres par statut (pills) + barre de recherche
- **Colonne Actions** :
  - 👁️ Voir le détail (lien vers `/invoices/[id]`)
  - ✏️ **Modifier** (lien vers `/invoices/[id]/edit`)
  - ✅ Marquer comme payée (conditionnel si non payée)
  - 🗑️ Supprimer avec confirmation
- Bouton "Nouvelle Facture" et "Exporter CSV / Excel"

### ✏️ Création de Facture (`/invoices/new`)
- **Formulaire en 2 colonnes** : Gauche = formulaire, Droite = prévisualisation live en temps réel
- Sélection client depuis liste (auto-remplissage email, téléphone)
- Champs : nom client, email, téléphone, adresse, notes
- **DatePicker interactif** pour Date d'émission et Date d'échéance (fermeture au clic extérieur)
- **Lignes de prestations** : description, quantité, prix unitaire HT, total auto-calculé
- **Ajout / Suppression** de lignes dynamiquement
- **Calcul automatique** : Sous-total HT → TVA 18% → Total TTC
- **3 actions d'envoi** :
  - 💾 Enregistrer
  - 📤 **Envoyer sur WhatsApp** (génère PDF + navigator.share sur mobile / téléchargement + WhatsApp Web sur PC)
  - 📧 Envoyer par Email

### 🔍 Détail d'une Facture (`/invoices/[id]`)
- Affichage complet de la facture format "papier"
- Statut modifiable (select)
- **Actions disponibles** :
  - 📤 **Envoyer sur WhatsApp** (même logique : PDF généré côté client + navigator.share)
  - 🖨️ Imprimer (window.print)
  - 📥 Télécharger PDF
  - ✏️ Modifier (lien vers `/invoices/[id]/edit`)
  - 🗑️ Supprimer

### 🖊️ Édition de Facture (`/invoices/[id]/edit`)
- Formulaire **pré-rempli** avec toutes les données existantes de la facture
- Badge "Mode Édition — N° INV-XXXX" visible en haut
- Modification de : client, email, téléphone, adresse, dates, statut, lignes, notes
- Totaux recalculés en temps réel
- Bouton "Enregistrer les modifications"

### 👥 Gestion Clients (`/clients`)
- Tableau de tous les clients
- Informations : nom, email, téléphone, ville, pays, NINEA/RCCM, total facturé, total payé, nb factures
- Recherche et filtres

### ⚙️ Paramètres (`/settings`)
- Configuration du profil utilisateur

### 🌐 Landing Page (`index.html`)
- Page de présentation marketing (HTML pur, hors Next.js)
- Formulaire d'inscription avec sélection de pays incluant : **Sénégal, Côte d'Ivoire, Mali, Guinée, Togo, Bénin, Niger, Burkina Faso**
- Footer avec mentions des mêmes pays

---

## 5. Design System

### Couleurs
- **Primaire / Brand** : `emerald-500` (#10b981) — couleur dominante
- **Arrière-plan clair** : `#F6F8FA` (surface-light)
- **Cartes** : `#FFFFFF` avec shadow subtile
- **Textes** : `slate-900` (titre), `slate-600` (corps), `slate-400` (secondaire)
- **Danger / Suppression** : `rose-500`
- **Succès / Payée** : `emerald-600`
- **Attention / En attente** : `amber-500`
- **Mode sombre** : Support complet (`dark:`)

### Typographie
- **Font** : `Plus Jakarta Sans` (Google Fonts, variable CSS `--font-jakarta`)
- Poids utilisés : 400, 500, 600, 700, 800, 900 (font-black)

### Composants UI
- **Button** : variantes `primary` (emerald), `outline`, `ghost`, avec tailles `sm`, `md`
- **Card** : `rounded-2xl`, `shadow-card`, fond blanc/sombre
- **Badge** : couleurs selon statut (vert/jaune/rouge)
- **DatePicker** : grille de jours, couleurs émeraude, animations hover/scale
- **MonthPicker** : grille 3×4 de mois (Jan–Déc), même style émeraude
- **Dropdown** : menu déroulant avec icônes et sélection

### Animations
- `animate-float` : flottaison douce (landing page)
- `fadeIn 0.22s ease-out` : apparition des pickers
- Hover sur boutons : `-translate-y-0.5 scale-105`
- Transitions : `duration-200 ease-out`

---

## 6. Logique Métier Importante

### Calcul TVA
```typescript
const subtotalHT = items.reduce((acc, curr) => acc + curr.total, 0);
const vatRate = 0.18; // 18% fixe (SYSCOHADA)
const vatAmount = subtotalHT * vatRate;
const totalTTC = subtotalHT + vatAmount;
```

### Génération et Partage PDF (WhatsApp)
```typescript
// 1. Capture le DOM de la facture
const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
// 2. Génère le PDF
const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, pdfWidth, pdfHeight);
// 3. Mobile : navigator.share() avec le fichier PDF directement joint
// 4. PC : télécharge le PDF + ouvre WhatsApp Web avec instructions
```

### Fermeture automatique des Pickers (Click Outside)
```typescript
const pickerRef = useRef<HTMLDivElement>(null);
useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
      setShowPicker(false);
    }
  }
  if (showPicker) document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [showPicker]);
```

---

## 7. Données (MockData)

Toutes les données sont actuellement **statiques** dans `src/lib/mockData.ts` :
- `initialInvoices` : tableau de factures avec items, statuts, dates, montants
- `initialClients` : tableau de clients avec coordonnées et statistiques

> **⚠️ Il n'y a pas encore de base de données réelle ni d'API backend.**
> Les modifications (suppression, marquage payé) sont dans le state React local et se réinitialisent au rechargement.

---

## 8. Instructions pour un Futur Modèle IA

### ✅ À FAIRE / Respecter impérativement
1. **Toujours utiliser les couleurs émeraude** (`brand-500`, `emerald-*`) pour les éléments primaires. Ne pas changer la palette.
2. **TVA = 18% fixe** — Ne jamais rendre ce taux configurable dans les calculs sans demande explicite.
3. **Devise = FCFA** — Utiliser `formatFCFA()` de `src/lib/utils.ts` pour tout affichage de montant.
4. **Composants existants** — Toujours réutiliser `Button`, `Card`, `Input`, `Badge`, `DatePicker`, `MonthPicker`, `Dropdown` avant d'en créer de nouveaux.
5. **Click-outside** sur tout nouveau picker/dropdown — Appliquer le pattern `useRef + useEffect + mousedown`.
6. **WhatsApp** — Sur mobile, utiliser `navigator.share({ files: [pdfFile] })`. Sur PC, télécharger le PDF + ouvrir `https://web.whatsapp.com/`.
7. **Fermer l'AbortError silencieusement** — Dans tous les blocs `navigator.share()`, capturer `error.name === 'AbortError'` et ne pas afficher d'alerte.
8. **IDs uniques** pour tous les éléments DOM capturés par html2canvas (ex: `id="invoice-pdf-content"`, `id="invoice-detail-content"`).

### ❌ À NE PAS FAIRE
- Ne pas remplacer Tailwind CSS par un autre framework CSS.
- Ne pas modifier `src/lib/types.ts` sans mettre à jour `mockData.ts` en conséquence.
- Ne pas supprimer les commentaires existants dans le code.
- Ne pas utiliser `DatePicker` (grille de jours) là où `MonthPicker` est approprié (sélection mois/année uniquement).
- Ne pas casser la prévisualisation live de la page `/invoices/new` — elle dépend du `id="invoice-pdf-content"` sur le div de prévisualisation.

### 🔜 Fonctionnalités à implémenter (non encore faites)
- [ ] Base de données réelle (Supabase / PostgreSQL)
- [ ] Authentification utilisateur (NextAuth ou Clerk)
- [ ] Persistance des données (remplacement de mockData.ts)
- [ ] Envoi d'email réel (Resend / Nodemailer)
- [ ] Export Excel fonctionnel (xlsx)
- [ ] Tableau de bord avec graphiques (Recharts / Chart.js)
- [ ] Mode multi-entreprises / multi-utilisateurs
- [ ] Numérotation automatique des factures
- [ ] Rappels automatiques pour factures impayées

---

## 9. Commandes Utiles

```bash
# Lancer en développement
npm run dev

# Accéder au dashboard
http://localhost:3000/dashboard

# Build de production
npm run build

# Lancer la production
npm run start

# Linter
npm run lint
```

---

*Ce fichier doit être mis à jour à chaque ajout de fonctionnalité majeure.*