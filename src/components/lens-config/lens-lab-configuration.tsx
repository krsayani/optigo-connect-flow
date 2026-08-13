import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { createId, nowIso } from "@/lib/lens-config/ids";
import {
  applyOfferingImport,
  bulkDeactivateOfferings,
  deactivateProduct,
  duplicateOffering,
  duplicateProduct,
  errorReportCsv,
  exportOfferingsCsv,
  previewOfferingImport,
  upsertOffering,
  upsertProduct,
  type CsvImportPreview,
  type LabLensOffering,
  type LensProduct,
  type RoutingRule,
} from "@/lib/lens-config";
import { configurationSummary } from "@/lib/lens-config/summary";
import { offeringWarnings } from "@/lib/lens-config/summary";
import { useLensConfig } from "./provider";
import { Field, NativeSelect, StatusBadge, nameOf, offeringLabel } from "./shared";

export function LensLabConfiguration() {
  return (
    <div className="lf-module">
      <div className="lf-page-head">
        <div className="lf-page-kicker">Practice administration</div>
        <div className="lf-page-title">Lens & Lab Configuration</div>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Define which lens products this practice offers, which labs can produce each
          configuration, and the preferred / backup lab order used when an optical order is
          submitted.
        </p>
      </div>
      <div className="p-5">
        <Tabs defaultValue="catalog">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
            <TabsTrigger value="catalog">Lens Catalog</TabsTrigger>
            <TabsTrigger value="coatings">Coatings</TabsTrigger>
            <TabsTrigger value="photo">Photochromics</TabsTrigger>
            <TabsTrigger value="treatments">Treatments</TabsTrigger>
            <TabsTrigger value="offerings">Lab Offerings</TabsTrigger>
            <TabsTrigger value="routing">Routing Rules</TabsTrigger>
            <TabsTrigger value="matrix">Configuration Matrix</TabsTrigger>
            <TabsTrigger value="io">Import/Export</TabsTrigger>
          </TabsList>
          <TabsContent value="catalog">
            <CatalogTab />
          </TabsContent>
          <TabsContent value="coatings">
            <SimpleList
              title="Coatings"
              rows={(db) => db.coatings}
              extra={(row) => row.code ?? ""}
            />
          </TabsContent>
          <TabsContent value="photo">
            <PhotoTab />
          </TabsContent>
          <TabsContent value="treatments">
            <TreatmentsTab />
          </TabsContent>
          <TabsContent value="offerings">
            <OfferingsTab />
          </TabsContent>
          <TabsContent value="routing">
            <RoutingTab />
          </TabsContent>
          <TabsContent value="matrix">
            <MatrixTab />
          </TabsContent>
          <TabsContent value="io">
            <ImportTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function CatalogTab() {
  const { db, actor, commit } = useLensConfig();
  const [q, setQ] = useState("");
  const [vision, setVision] = useState<string | null>(null);
  const [mfr, setMfr] = useState<string | null>(null);
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [editing, setEditing] = useState<LensProduct | null>(null);

  const rows = db.products.filter((product) => {
    if (vision && product.visionTypeId !== vision) return false;
    if (mfr && product.manufacturerId !== mfr) return false;
    if (status === "active" && !product.active) return false;
    if (status === "inactive" && product.active) return false;
    const hay = `${product.productName} ${product.productCode ?? ""}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <section className="space-y-4 pt-4">
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search name or code"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <NativeSelect
          id="cat-mfr"
          label="Manufacturer"
          value={mfr}
          onChange={setMfr}
          allowEmpty
          emptyLabel="All"
          options={db.manufacturers.map((row) => ({ value: row.id, label: row.name }))}
        />
        <NativeSelect
          id="cat-vt"
          label="Vision type"
          value={vision}
          onChange={setVision}
          allowEmpty
          emptyLabel="All"
          options={db.visionTypes.map((row) => ({ value: row.id, label: row.name }))}
        />
        <NativeSelect
          id="cat-status"
          label="Status"
          value={status}
          onChange={(v) => setStatus((v as "all" | "active" | "inactive") || "all")}
          options={[
            { value: "all", label: "All" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
        <div className="flex items-end">
          <Button
            onClick={() =>
              setEditing({
                id: createId("prod"),
                organizationId: actor.organizationId,
                manufacturerId: db.manufacturers[0]?.id ?? "",
                visionTypeId: db.visionTypes[0]?.id ?? "",
                lensDesignId: db.lensDesigns[0]?.id ?? "",
                productName: "",
                productCode: null,
                description: "",
                active: true,
                positionOfWearSupported: false,
                notes: "",
                createdAt: nowIso(),
                updatedAt: nowIso(),
                createdBy: actor.userId,
              })
            }
          >
            New product
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Manufacturer</TableHead>
            <TableHead>Vision / design</TableHead>
            <TableHead>Materials</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="font-medium">{product.productName}</div>
                <div className="text-xs text-muted-foreground">{product.productCode}</div>
              </TableCell>
              <TableCell>{nameOf(db.manufacturers, product.manufacturerId)}</TableCell>
              <TableCell>
                {nameOf(db.visionTypes, product.visionTypeId)} ·{" "}
                {nameOf(db.lensDesigns, product.lensDesignId)}
              </TableCell>
              <TableCell className="text-xs">
                {db.productMaterials
                  .filter((row) => row.lensProductId === product.id && row.active)
                  .map((row) => nameOf(db.materials, row.lensMaterialId))
                  .join(", ") || "—"}
              </TableCell>
              <TableCell>
                <StatusBadge active={product.active} />
              </TableCell>
              <TableCell className="space-x-2 text-right">
                <Button size="sm" variant="outline" onClick={() => setEditing(product)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    commit((draft) => {
                      duplicateProduct(draft, actor, product.id);
                    })
                  }
                >
                  Duplicate
                </Button>
                {product.active ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (
                        !confirm(
                          `Deactivate ${product.productName}? Historical orders are preserved.`,
                        )
                      )
                        return;
                      commit((draft) => deactivateProduct(draft, actor, product.id));
                    }}
                  >
                    Deactivate
                  </Button>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editing ? <ProductDialog product={editing} onClose={() => setEditing(null)} /> : null}
    </section>
  );
}

function ProductDialog({ product, onClose }: { product: LensProduct; onClose: () => void }) {
  const { db, actor, commit } = useLensConfig();
  const [draft, setDraft] = useState(product);
  const [materials, setMaterials] = useState(
    db.productMaterials
      .filter((row) => row.lensProductId === product.id && row.active)
      .map((row) => row.lensMaterialId),
  );
  const designs = db.lensDesigns.filter((row) => row.visionTypeId === draft.visionTypeId);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product.productName ? "Edit lens product" : "New lens product"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Product name" htmlFor="pn">
            <Input
              id="pn"
              value={draft.productName}
              onChange={(e) => setDraft({ ...draft, productName: e.target.value })}
            />
          </Field>
          <Field label="Product code" htmlFor="pc">
            <Input
              id="pc"
              value={draft.productCode ?? ""}
              onChange={(e) => setDraft({ ...draft, productCode: e.target.value || null })}
            />
          </Field>
          <NativeSelect
            id="pm"
            label="Manufacturer"
            value={draft.manufacturerId}
            onChange={(v) => setDraft({ ...draft, manufacturerId: v ?? draft.manufacturerId })}
            options={db.manufacturers.map((row) => ({ value: row.id, label: row.name }))}
          />
          <NativeSelect
            id="pvt"
            label="Vision type"
            value={draft.visionTypeId}
            onChange={(v) => {
              const visionTypeId = v ?? draft.visionTypeId;
              const nextDesign =
                db.lensDesigns.find((row) => row.visionTypeId === visionTypeId)?.id ??
                draft.lensDesignId;
              setDraft({ ...draft, visionTypeId, lensDesignId: nextDesign });
            }}
            options={db.visionTypes.map((row) => ({ value: row.id, label: row.name }))}
          />
          <NativeSelect
            id="pd"
            label="Lens design"
            value={draft.lensDesignId}
            onChange={(v) => setDraft({ ...draft, lensDesignId: v ?? draft.lensDesignId })}
            options={designs.map((row) => ({ value: row.id, label: row.name }))}
          />
          <Field label="Description" htmlFor="pdesc">
            <Textarea
              id="pdesc"
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </Field>
        </div>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Compatible materials</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {db.materials.map((material) => (
              <label key={material.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={materials.includes(material.id)}
                  onCheckedChange={(checked) =>
                    setMaterials((current) =>
                      checked === true
                        ? [...current, material.id]
                        : current.filter((id) => id !== material.id),
                    )
                  }
                />
                {material.name}
              </label>
            ))}
          </div>
        </fieldset>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!draft.productName.trim()) {
                toast.error("Product name is required.");
                return;
              }
              commit((next) => upsertProduct(next, actor, draft, materials));
              toast.success("Product saved.");
              onClose();
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SimpleList({
  title,
  rows,
  extra,
}: {
  title: string;
  rows: (
    db: ReturnType<typeof useLensConfig>["db"],
  ) => Array<{ id: string; name: string; active: boolean; code?: string }>;
  extra?: (row: { id: string; name: string; code?: string }) => string;
}) {
  const { db } = useLensConfig();
  return (
    <section className="space-y-3 pt-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows(db).map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell className="text-muted-foreground">{extra?.(row) ?? row.code}</TableCell>
              <TableCell>
                <StatusBadge active={row.active} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

function PhotoTab() {
  const { db } = useLensConfig();
  return (
    <section className="grid gap-6 pt-4 lg:grid-cols-2">
      <SimpleList
        title="Photochromic products"
        rows={(d) => d.photochromicProducts}
        extra={(row) => row.code ?? ""}
      />
      <div>
        <h3 className="mb-3 text-sm font-semibold">Product colors</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Colors</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {db.photochromicProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell className="text-xs">
                  {db.photochromicProductColors
                    .filter((row) => row.photochromicProductId === product.id && row.active)
                    .map((row) => nameOf(db.photochromicColors, row.photochromicColorId))
                    .join(", ")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

function TreatmentsTab() {
  const { db } = useLensConfig();
  return (
    <section className="grid gap-6 pt-4 lg:grid-cols-3">
      <SimpleList title="Polarization" rows={() => db.polarizationOptions} />
      <SimpleList title="Tints" rows={() => db.tintOptions} extra={(row) => row.code ?? ""} />
      <SimpleList title="Mirrors" rows={() => db.mirrorOptions} extra={(row) => row.code ?? ""} />
    </section>
  );
}

function emptyOffering(
  organizationId: string,
  userId: string,
  db: ReturnType<typeof useLensConfig>["db"],
): LabLensOffering {
  const product = db.products[0]!;
  return {
    id: createId("off"),
    organizationId,
    locationId: null,
    labId: db.labs[0]?.id ?? "",
    lensProductId: product.id,
    lensMaterialId:
      db.productMaterials.find((row) => row.lensProductId === product.id)?.lensMaterialId ??
      db.materials[0]!.id,
    coatingId: db.coatings.find((row) => row.code === "PREMIUM_AR")?.id ?? null,
    photochromicProductId: null,
    photochromicColorId: null,
    polarizationOptionId: db.polarizationOptions.find((row) => row.code === "NONE")?.id ?? null,
    tintOptionId: db.tintOptions.find((row) => row.code === "NONE")?.id ?? null,
    mirrorOptionId: db.mirrorOptions.find((row) => row.code === "NONE")?.id ?? null,
    labProductName: "",
    labProductCode: null,
    labCoatingCode: null,
    labPhotochromicCode: null,
    labMaterialCode: null,
    cost: null,
    retailPrice: null,
    estimatedTurnaroundBusinessDays: 5,
    rushAvailable: false,
    rushCost: null,
    active: true,
    effectiveStartDate: null,
    effectiveEndDate: null,
    warrantyMonths: 12,
    remakePolicy: null,
    notes: "",
    sphereMin: -8,
    sphereMax: 8,
    cylinderMin: -4,
    cylinderMax: 0,
    addMin: null,
    addMax: null,
    prismHorizontalMax: 4,
    prismVerticalMax: 3,
    totalPrismMax: 5,
    minimumFittingHeight: null,
    minimumBlankSize: null,
    maximumBlankSize: null,
    minimumCenterThickness: null,
    maximumDecentration: null,
    drillMountAllowed: true,
    grooveAllowed: true,
    rimlessAllowed: true,
    wrapAllowed: false,
    safetyFrameAllowed: true,
    edgePolishAvailable: true,
    rollAndPolishAvailable: true,
    specialBaseCurveRequired: false,
    supportedBaseCurves: null,
    restrictionsJson: null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    createdBy: userId,
  };
}

function OfferingsTab() {
  const { db, actor, commit } = useLensConfig();
  const [q, setQ] = useState("");
  const [labId, setLabId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<LabLensOffering | null>(null);

  const rows = db.offerings.filter((row) => {
    if (row.organizationId !== actor.organizationId) return false;
    if (labId && row.labId !== labId) return false;
    const hay =
      `${row.labProductName} ${row.labProductCode ?? ""} ${nameOf(db.products, row.lensProductId)}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <section className="space-y-4 pt-4">
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search offerings"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <NativeSelect
          id="off-lab"
          label="Lab"
          value={labId}
          onChange={setLabId}
          allowEmpty
          emptyLabel="All labs"
          options={db.labs.map((row) => ({ value: row.id, label: row.name }))}
        />
        <div className="flex items-end gap-2">
          <Button onClick={() => setEditing(emptyOffering(actor.organizationId, actor.userId, db))}>
            Add offering
          </Button>
          <Button
            variant="outline"
            disabled={!selected.length}
            onClick={() => {
              if (!confirm(`Deactivate ${selected.length} offerings?`)) return;
              commit((draft) => bulkDeactivateOfferings(draft, actor, selected));
              setSelected([]);
            }}
          >
            Bulk deactivate
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>Lab</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Material</TableHead>
            <TableHead>Coating</TableHead>
            <TableHead>Photo / polar / tint / mirror</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Days</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <Checkbox
                  checked={selected.includes(row.id)}
                  onCheckedChange={(checked) =>
                    setSelected((current) =>
                      checked === true
                        ? [...current, row.id]
                        : current.filter((id) => id !== row.id),
                    )
                  }
                  aria-label={`Select ${row.labProductName}`}
                />
              </TableCell>
              <TableCell>{nameOf(db.labs, row.labId)}</TableCell>
              <TableCell>
                <div>{nameOf(db.products, row.lensProductId)}</div>
                <div className="text-xs text-muted-foreground">
                  {nameOf(
                    db.visionTypes,
                    db.products.find((p) => p.id === row.lensProductId)?.visionTypeId ?? null,
                  )}{" "}
                  ·{" "}
                  {nameOf(
                    db.lensDesigns,
                    db.products.find((p) => p.id === row.lensProductId)?.lensDesignId ?? null,
                  )}
                </div>
              </TableCell>
              <TableCell>{nameOf(db.materials, row.lensMaterialId)}</TableCell>
              <TableCell>{nameOf(db.coatings, row.coatingId)}</TableCell>
              <TableCell className="text-xs">
                {nameOf(db.photochromicProducts, row.photochromicProductId)}{" "}
                {nameOf(db.photochromicColors, row.photochromicColorId, "")} /{" "}
                {nameOf(db.polarizationOptions, row.polarizationOptionId)} /{" "}
                {nameOf(db.tintOptions, row.tintOptionId)} /{" "}
                {nameOf(db.mirrorOptions, row.mirrorOptionId)}
              </TableCell>
              <TableCell>{row.labProductCode ?? "—"}</TableCell>
              <TableCell>
                {actor.canViewCost && row.cost != null ? `$${row.cost.toFixed(2)}` : "—"}
              </TableCell>
              <TableCell>{row.estimatedTurnaroundBusinessDays ?? "—"}</TableCell>
              <TableCell>
                <StatusBadge active={row.active} />
              </TableCell>
              <TableCell className="space-x-2 text-right">
                <Button size="sm" variant="outline" onClick={() => setEditing(row)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    commit((draft) => {
                      duplicateOffering(draft, actor, row.id);
                    })
                  }
                >
                  Duplicate
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editing ? <OfferingDialog offering={editing} onClose={() => setEditing(null)} /> : null}
    </section>
  );
}

function OfferingDialog({ offering, onClose }: { offering: LabLensOffering; onClose: () => void }) {
  const { db, actor, commit } = useLensConfig();
  const [draft, setDraft] = useState(offering);
  const product = db.products.find((row) => row.id === draft.lensProductId);
  const materials = db.productMaterials.filter(
    (row) => row.lensProductId === draft.lensProductId && row.active,
  );
  const colors = db.photochromicProductColors.filter(
    (row) => row.active && row.photochromicProductId === draft.photochromicProductId,
  );

  function num(value: string): number | null {
    if (value === "") return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Lab offering</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <NativeSelect
            id="olab"
            label="Lab"
            value={draft.labId}
            onChange={(v) => setDraft({ ...draft, labId: v ?? draft.labId })}
            options={db.labs.map((row) => ({ value: row.id, label: row.name }))}
          />
          <NativeSelect
            id="oloc"
            label="Location"
            value={draft.locationId}
            allowEmpty
            emptyLabel="All locations"
            onChange={(v) => setDraft({ ...draft, locationId: v })}
            options={db.locations.map((row) => ({ value: row.id, label: row.name }))}
          />
          <NativeSelect
            id="oprod"
            label="Lens product"
            value={draft.lensProductId}
            onChange={(v) => {
              const lensProductId = v ?? draft.lensProductId;
              const material =
                db.productMaterials.find((row) => row.lensProductId === lensProductId)
                  ?.lensMaterialId ?? draft.lensMaterialId;
              setDraft({ ...draft, lensProductId, lensMaterialId: material });
            }}
            options={db.products.map((row) => ({ value: row.id, label: row.productName }))}
          />
          <NativeSelect
            id="omat"
            label="Material"
            value={draft.lensMaterialId}
            onChange={(v) => setDraft({ ...draft, lensMaterialId: v ?? draft.lensMaterialId })}
            options={materials.map((row) => ({
              value: row.lensMaterialId,
              label: nameOf(db.materials, row.lensMaterialId),
            }))}
          />
          <NativeSelect
            id="ocoat"
            label="Coating"
            value={draft.coatingId}
            allowEmpty
            onChange={(v) => setDraft({ ...draft, coatingId: v })}
            options={db.coatings.map((row) => ({ value: row.id, label: row.name }))}
          />
          <NativeSelect
            id="ophoto"
            label="Photochromic"
            value={draft.photochromicProductId}
            allowEmpty
            onChange={(v) =>
              setDraft({ ...draft, photochromicProductId: v, photochromicColorId: null })
            }
            options={db.photochromicProducts.map((row) => ({ value: row.id, label: row.name }))}
          />
          <NativeSelect
            id="ocolor"
            label="Photochromic color"
            value={draft.photochromicColorId}
            allowEmpty
            disabled={!draft.photochromicProductId}
            onChange={(v) => setDraft({ ...draft, photochromicColorId: v })}
            options={colors.map((row) => ({
              value: row.photochromicColorId,
              label: nameOf(db.photochromicColors, row.photochromicColorId),
            }))}
          />
          <NativeSelect
            id="opol"
            label="Polarization"
            value={draft.polarizationOptionId}
            allowEmpty
            onChange={(v) => setDraft({ ...draft, polarizationOptionId: v })}
            options={db.polarizationOptions.map((row) => ({ value: row.id, label: row.name }))}
          />
          <NativeSelect
            id="otint"
            label="Tint"
            value={draft.tintOptionId}
            allowEmpty
            onChange={(v) => setDraft({ ...draft, tintOptionId: v })}
            options={db.tintOptions.map((row) => ({ value: row.id, label: row.name }))}
          />
          <NativeSelect
            id="omir"
            label="Mirror"
            value={draft.mirrorOptionId}
            allowEmpty
            onChange={(v) => setDraft({ ...draft, mirrorOptionId: v })}
            options={db.mirrorOptions.map((row) => ({ value: row.id, label: row.name }))}
          />
          <Field label="Lab product name" htmlFor="oname">
            <Input
              id="oname"
              value={draft.labProductName}
              onChange={(e) => setDraft({ ...draft, labProductName: e.target.value })}
            />
          </Field>
          <Field label="Lab SKU" htmlFor="osku">
            <Input
              id="osku"
              value={draft.labProductCode ?? ""}
              onChange={(e) => setDraft({ ...draft, labProductCode: e.target.value || null })}
            />
          </Field>
          <Field label="Cost" htmlFor="ocost">
            <Input
              id="ocost"
              type="number"
              value={draft.cost ?? ""}
              onChange={(e) => setDraft({ ...draft, cost: num(e.target.value) })}
            />
          </Field>
          <Field label="Turnaround (business days)" htmlFor="odays">
            <Input
              id="odays"
              type="number"
              value={draft.estimatedTurnaroundBusinessDays ?? ""}
              onChange={(e) =>
                setDraft({ ...draft, estimatedTurnaroundBusinessDays: num(e.target.value) })
              }
            />
          </Field>
          <Field label="Sphere min" htmlFor="smin">
            <Input
              id="smin"
              type="number"
              value={draft.sphereMin ?? ""}
              onChange={(e) => setDraft({ ...draft, sphereMin: num(e.target.value) })}
            />
          </Field>
          <Field label="Sphere max" htmlFor="smax">
            <Input
              id="smax"
              type="number"
              value={draft.sphereMax ?? ""}
              onChange={(e) => setDraft({ ...draft, sphereMax: num(e.target.value) })}
            />
          </Field>
          <Field label="Effective start" htmlFor="estart">
            <Input
              id="estart"
              type="date"
              value={draft.effectiveStartDate ?? ""}
              onChange={(e) => setDraft({ ...draft, effectiveStartDate: e.target.value || null })}
            />
          </Field>
          <Field label="Effective end" htmlFor="eend">
            <Input
              id="eend"
              type="date"
              value={draft.effectiveEndDate ?? ""}
              onChange={(e) => setDraft({ ...draft, effectiveEndDate: e.target.value || null })}
            />
          </Field>
        </div>
        <p className="text-xs text-muted-foreground">
          {product
            ? `${nameOf(db.visionTypes, product.visionTypeId)} · ${nameOf(db.lensDesigns, product.lensDesignId)}`
            : ""}
        </p>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={draft.active}
            onCheckedChange={(checked) => setDraft({ ...draft, active: checked === true })}
          />
          Active
        </label>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              try {
                commit((next) => upsertOffering(next, actor, draft));
                toast.success("Offering saved.");
                onClose();
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Could not save offering.");
              }
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RoutingTab() {
  const { db, actor, commit } = useLensConfig();
  const groups = useMemo(() => {
    const map = new Map<string, RoutingRule[]>();
    for (const rule of db.routingRules.filter(
      (row) => row.organizationId === actor.organizationId,
    )) {
      const key = [
        rule.locationId ?? "org",
        rule.lensProductId,
        rule.lensMaterialId,
        rule.coatingId,
        rule.photochromicProductId,
        rule.photochromicColorId,
        rule.polarizationOptionId,
        rule.tintOptionId,
        rule.mirrorOptionId,
      ].join("|");
      const list = map.get(key) ?? [];
      list.push(rule);
      map.set(key, list);
    }
    return [...map.values()].map((list) => list.sort((a, b) => a.priority - b.priority));
  }, [actor.organizationId, db.routingRules]);

  return (
    <section className="space-y-4 pt-4">
      <p className="text-sm text-muted-foreground">
        Priority 1 is the preferred lab. Use move up/down to change backup order. Location-specific
        groups override organization-wide rules.
      </p>
      {groups.map((group) => {
        const first = group[0]!;
        const warnings = group.flatMap((rule) => {
          const offering = db.offerings.find((row) => row.id === rule.labLensOfferingId);
          if (!offering) return ["Missing offering"];
          return offeringWarnings(offering);
        });
        return (
          <div key={first.id} className="rounded-xl border bg-background p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-medium">{first.name.replace(/ — .+$/, "")}</div>
                <div className="text-xs text-muted-foreground">
                  {first.locationId ? nameOf(db.locations, first.locationId) : "All locations"} ·{" "}
                  {nameOf(db.products, first.lensProductId)}
                </div>
              </div>
              {warnings.length ? (
                <Badge variant="outline" className="text-amber-700">
                  {warnings[0]}
                </Badge>
              ) : null}
            </div>
            <ol className="space-y-2">
              {group.map((rule, index) => (
                <li
                  key={rule.id}
                  className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
                >
                  <div>
                    <div className="text-sm font-medium">
                      {rule.priority}. {offeringLabel(db, rule.labLensOfferingId)}
                    </div>
                    <div className="text-xs text-muted-foreground">{rule.name}</div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={index === 0}
                      onClick={() => move(group, index, -1)}
                    >
                      Up
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={index === group.length - 1}
                      onClick={() => move(group, index, 1)}
                    >
                      Down
                    </Button>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        );

        function move(list: RoutingRule[], index: number, delta: number) {
          const next = [...list];
          const swap = next[index + delta];
          const current = next[index];
          if (!swap || !current) return;
          commit((draft) => {
            const a = draft.routingRules.find((row) => row.id === current.id);
            const b = draft.routingRules.find((row) => row.id === swap.id);
            if (!a || !b) return;
            const pa = a.priority;
            a.priority = b.priority;
            b.priority = pa;
          });
        }
      })}
    </section>
  );
}

function MatrixTab() {
  const { db, actor } = useLensConfig();
  const [q, setQ] = useState("");
  const groups = db.routingRules
    .filter((row) => row.organizationId === actor.organizationId)
    .reduce<Record<string, RoutingRule[]>>((acc, rule) => {
      const key = [
        rule.locationId,
        rule.lensProductId,
        rule.lensMaterialId,
        rule.coatingId,
        rule.photochromicProductId,
        rule.photochromicColorId,
        rule.polarizationOptionId,
        rule.tintOptionId,
        rule.mirrorOptionId,
      ].join("|");
      acc[key] = [...(acc[key] ?? []), rule];
      return acc;
    }, {});

  return (
    <section className="space-y-4 pt-4">
      <Input
        placeholder="Filter configurations"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="max-w-sm"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Configuration</TableHead>
            <TableHead>Preferred lab</TableHead>
            <TableHead>Backups</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Turnaround</TableHead>
            <TableHead>Rx range</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.values(groups).map((rules) => {
            const sorted = [...rules].sort((a, b) => a.priority - b.priority);
            const preferred = sorted[0];
            if (!preferred) return null;
            const offering = db.offerings.find((row) => row.id === preferred.labLensOfferingId);
            const product = db.products.find((row) => row.id === preferred.lensProductId);
            const summary = configurationSummary(db, {
              visionTypeId: product?.visionTypeId ?? preferred.visionTypeId ?? "",
              lensDesignId: product?.lensDesignId ?? preferred.lensDesignId ?? "",
              lensProductId: preferred.lensProductId ?? "",
              lensMaterialId: preferred.lensMaterialId ?? "",
              coatingId: preferred.coatingId,
              photochromicProductId: preferred.photochromicProductId,
              photochromicColorId: preferred.photochromicColorId,
              polarizationOptionId: preferred.polarizationOptionId,
              tintOptionId: preferred.tintOptionId,
              tintStartDensityPercent: null,
              tintEndDensityPercent: null,
              requestedTransmissionPercent: null,
              customColorDescription: null,
              mirrorOptionId: preferred.mirrorOptionId,
            });
            if (q && !summary.toLowerCase().includes(q.toLowerCase())) return null;
            return (
              <TableRow key={preferred.id}>
                <TableCell className="max-w-sm text-sm">{summary}</TableCell>
                <TableCell>{offering ? nameOf(db.labs, offering.labId) : "—"}</TableCell>
                <TableCell className="text-xs">
                  {sorted
                    .slice(1)
                    .map((rule) => offeringLabel(db, rule.labLensOfferingId))
                    .join(" → ") || "—"}
                </TableCell>
                <TableCell>
                  {actor.canViewCost && offering?.cost != null
                    ? `$${offering.cost.toFixed(2)}`
                    : "—"}
                </TableCell>
                <TableCell>{offering?.estimatedTurnaroundBusinessDays ?? "—"}</TableCell>
                <TableCell className="text-xs">
                  {offering ? `${offering.sphereMin ?? "?"} to ${offering.sphereMax ?? "?"}` : "—"}
                </TableCell>
                <TableCell>
                  {preferred.locationId ? nameOf(db.locations, preferred.locationId) : "All"}
                </TableCell>
                <TableCell>
                  <StatusBadge active={Boolean(preferred.active && offering?.active)} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
}

function ImportTab() {
  const { db, actor, commit } = useLensConfig();
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<CsvImportPreview | null>(null);

  return (
    <section className="space-y-4 pt-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => {
            const csv = exportOfferingsCsv(db, actor.organizationId);
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "lab-offerings.csv";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Download CSV
        </Button>
      </div>
      <Field label="Paste CSV" htmlFor="csv">
        <Textarea id="csv" rows={10} value={text} onChange={(e) => setText(e.target.value)} />
      </Field>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            const next = previewOfferingImport(db, actor.organizationId, text);
            setPreview(next);
            if (next.errors.length) toast.error(`${next.errors.length} row(s) have errors.`);
            else toast.success(`${next.rows.length} valid row(s).`);
          }}
        >
          Preview
        </Button>
        <Button
          onClick={() => {
            if (!preview) return;
            try {
              commit((draft) => {
                applyOfferingImport(draft, actor, preview, false);
              });
              toast.success("Imported all rows.");
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Import failed.");
            }
          }}
        >
          Import all
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            if (!preview) return;
            commit((draft) => {
              applyOfferingImport(draft, actor, preview, true);
            });
            toast.success("Imported valid rows only.");
          }}
        >
          Import valid rows only
        </Button>
        {preview?.errors.length ? (
          <Button
            variant="ghost"
            onClick={() => {
              const csv = errorReportCsv(preview.errors);
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "import-errors.csv";
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Download error report
          </Button>
        ) : null}
      </div>
      {preview ? (
        <p className="text-sm text-muted-foreground">
          {preview.rows.length} valid · {preview.errors.length} errors · {preview.duplicates.length}{" "}
          possible duplicates
        </p>
      ) : null}
    </section>
  );
}
