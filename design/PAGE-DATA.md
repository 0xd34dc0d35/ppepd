# PAGE DATA - KATALOG DATA PPEPD

## USER STORY
- Memberikan akses terpusat ke semua dataset ekosistem perairan darat
- Tab switching: **RAW Data** dan **Statistic** untuk kategori dataset berbeda
- Dummy data disimpan di `/public/static/data-catalog.json`
- Skeleton preloader saat loading data (1 detik delay)
- Dual view mode: **Card** (grid) dan **Table** untuk fleksibilitas
- Pagination support untuk dataset besar
- Search/filter capabilities

## PAGE STRUCTURE

### 1. HEADER SECTION
**Size:** 30vh (min-height: 240px)
**Background:** Semi-transparent white dengan ambient gradient blobs
**Components:**
- **Navigation Spacer** (50px height)
- **Tab Switcher** (center-top)
  - RAW Data (default)
  - Statistic
  - Active state: `bg-brand-green`, text-white, shadow
  - Inactive state: text muted, hover effects
- **Search Input** (below tabs)
  - Placeholder: "Cari dataset, penulis, atau tag..."
  - Icon: Search SVG
  - Focus effects: shadow, border highlight

### 2. ITEMS SECTION
**Size:** Flex-grow (fills remaining space minus header)
**Layout:** Centered container with max-width constraint

#### 2a. Title Bar
**Height:** 56px
**Components:**
- Center: View mode toggle (Card/Table icons)
- Centered alignment, clean minimal design

#### 2b. Content Area (Scrollable)
**Constraint:** max-width: 75vw (centered)
**Responsive Grid:**
- 1 column (mobile)
- 2 columns (tablet)
- 3 columns (desktop)

**States:**

##### Loading State (Skeleton)
- Shows 6 animated skeleton cards
- Gradient pulse animation on each element
- Maintains card layout structure

##### Card View (Default)
- Rounded md corners
- Aspect ratio: 2:1 (16:8) for images - compact and efficient
- Grid layout: **3 items per row** (desktop), 2 (tablet), 1 (mobile)
- Card Properties:
  1. **Image** (with hover overlay)
     - Hover: Dark gradient overlay + "Lihat Detail" button
     - Badge: Format label (top-right)
  2. **Category** (top-left text)
  3. **Year Published** (top-right muted text)
  4. **Title** (prominent, line-clamp: 2)
  5. **Author** (secondary text)
  6. **Tags** (up to 3 visible + "+N" badge)
- Spacing: p-4
- Gaps: 6 between cards
- Border: subtle green, enhanced on hover
- Shadow: enhanced on hover
- Compact design without download button or file size info

##### Table View
- Full-width table with header
- Columns: #, Image, Title, Year, Author, Category, Format, Size, Action
- Row height: py-4
- Hover: bg-green/5
- Header: bg-cream/60
- Border: subtle green

##### Empty State
- Center-aligned
- Large circular icon background
- Title: "Data Tidak Ditemukan"
- Message: Shows search term and selected tab context
- CTA: Reset button (border-brand-green, hover fill)

#### 2c. Pagination Footer
**Height:** 56px
**Components:**
- Left: "Hal X / Y" indicator
- Center: Page number buttons (1-N)
- Navigation: Prev/Next arrows
- Active page: `bg-brand-green`, white text
- Disabled state: opacity-30

### 3. FOOTER SECTION
**Size:** Auto height (compact version)
**Background:** bg-cream/80 with backdrop blur
**Border:** Top border (brand-green/10)
**Content:**
- **Left:** Copyright text
- **Right:** Policy links (Privacy Policy, Terms of Use)
- **Spacing:** Flexbox, responsive (single row on desktop, stacked on mobile)
- **Modal Dialog:** Opens policy/terms content on click

## DATA STRUCTURE

### Catalog Item Schema
```typescript
{
  id: number
  type: 'raw' | 'statistic'
  title: string
  year: number
  image: string (image path)
  author: string
  metadata: {
    format: string ('SHP', 'GeoJSON', 'CSV', 'TIFF', etc.)
    category: string ('Spasial', 'Real-time', 'Tabular')
    size: string ('45 MB', '120 MB', '2.3 GB')
    tags: string[]
  }
}
```

## INTERACTIONS

### Search/Filter
- Real-time filtering across title, author, tags, category
- Case-insensitive matching
- Resets pagination to page 1

### Tab Switching
- Filters data by `type` field
- Resets search and pagination
- Smooth visual transition

### View Mode
- Card: Default grid view with rich metadata
- Table: Compact tabular view with essential info
- Fade-in transition (300ms)

### Pagination
- 6 items per page (configurable)
- Smart prev/next buttons (disabled at boundaries)
- Direct page selection

### Download/Action
- No download button on card view (compact design)
- Download functionality available in table view and detail modal
- Hover effects maintain visual feedback

## RESPONSIVE BEHAVIOR

| Device | Header | Grid | Pagination |
|--------|--------|------|------------|
| Mobile | 30vh | 1 col | Stacked |
| Tablet | 30vh | 2 col | Inline |
| Desktop | 30vh | 3 col | Inline |

## ANIMATIONS & TRANSITIONS
- Tab switch: 300ms ease
- View toggle: 200ms ease
- Card hover: 500ms (shadow, border, image scale)
- Skeleton: Continuous gradient pulse
- Content transition: 300ms fade-in

## COLORS
- **Primary:** brand-green (#1E5C4B)
- **Dark:** brand-green-dark (#0D3D30)
- **Accent:** brand-orange (#D97B3A) - CTA buttons
- **Background:** brand-cream (#F5F2EC)
- **Text:** brand-charcoal (#1A2A24)