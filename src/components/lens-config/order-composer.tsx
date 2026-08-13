import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { LOC_MAIN } from "@/lib/lens-config/ids";
import {
  matchingOfferings,
  resolveLabForLensConfiguration,
  submitOpticalOrder,
  validateRxAndFrame,
  validateSelection,
  type FrameInput,
  type FrameType,
  type LensConfigurationSelection,
  type ResolveLabResult,
  type RxEye,
} from "@/lib/lens-config";
import { configurationSummary } from "@/lib/lens-config/summary";
import { useLensConfig } from "./provider";
import { Field, NativeSelect, nameOf } from "./shared";

const noneEye = (): RxEye => ({
  sphere: -1,
  cylinder: -0.5,
  add: null,
  prismHorizontal: null,
  prismVertical: null,
});

export function OrderComposer() {
  const { db, actor, commit } = useLensConfig();
  const [locationId, setLocationId] = useState<string | null>(LOC_MAIN);
  const [visionTypeId, setVisionTypeId] = useState<string | null>(null);
  const [lensDesignId, setLensDesignId] = useState<string | null>(null);
  const [lensProductId, setLensProductId] = useState<string | null>(null);
  const [lensMaterialId, setLensMaterialId] = useState<string | null>(null);
  const [coatingId, setCoatingId] = useState<string | null>(null);
  const [photochromicProductId, setPhotochromicProductId] = useState<string | null>(null);
  const [photochromicColorId, setPhotochromicColorId] = useState<string | null>(null);
  const [polarizationOptionId, setPolarizationOptionId] = useState<string | null>(null);
  const [tintOptionId, setTintOptionId] = useState<string | null>(null);
  const [tintStart, setTintStart] = useState("");
  const [tintEnd, setTintEnd] = useState("");
  const [mirrorOptionId, setMirrorOptionId] = useState<string | null>(null);
  const [rightEye, setRightEye] = useState<RxEye>(noneEye());
  const [leftEye, setLeftEye] = useState<RxEye>(noneEye());
  const [frame, setFrame] = useState<FrameInput>({
    type: "full_rim",
    a: 52,
    b: 34,
    dbl: 18,
    ed: 55,
    wrappingAngle: 0,
    fittingHeight: 18,
    segmentHeight: null,
    blankSize: 70,
    decentration: 2,
  });
  const [rush, setRush] = useState(false);
  const [result, setResult] = useState<ResolveLabResult | null>(null);

  const activeOfferings = db.offerings.filter(
    (row) => row.organizationId === actor.organizationId && row.active,
  );

  const productsFor = (vision?: string | null, design?: string | null) =>
    db.products.filter((product) => {
      if (!product.active) return false;
      if (vision && product.visionTypeId !== vision) return false;
      if (design && product.lensDesignId !== design) return false;
      return activeOfferings.some((offering) => offering.lensProductId === product.id);
    });

  const visionTypes = db.visionTypes.filter((row) => productsFor(row.id).length > 0);
  const designs = db.lensDesigns.filter(
    (row) =>
      (!visionTypeId || row.visionTypeId === visionTypeId) &&
      productsFor(visionTypeId, row.id).length > 0,
  );
  const products = productsFor(visionTypeId, lensDesignId);

  const partial = {
    lensProductId: lensProductId ?? undefined,
    lensMaterialId: lensMaterialId ?? undefined,
    coatingId,
    photochromicProductId,
    photochromicColorId,
    polarizationOptionId,
    tintOptionId,
    mirrorOptionId,
  };
  const narrowed = matchingOfferings(db, actor.organizationId, partial, locationId).filter(
    (row) => row.active,
  );

  const materials = db.materials
    .filter(
      (material) =>
        narrowed.some((row) => row.lensMaterialId === material.id) ||
        (!lensProductId
          ? false
          : db.productMaterials.some(
              (link) =>
                link.active &&
                link.lensProductId === lensProductId &&
                link.lensMaterialId === material.id,
            ) && narrowed.length === 0),
    )
    .filter((material) =>
      !lensProductId
        ? true
        : db.productMaterials.some(
            (link) =>
              link.active &&
              link.lensProductId === lensProductId &&
              link.lensMaterialId === material.id,
          ),
    );

  const coatingIds = new Set(narrowed.map((row) => row.coatingId));
  const photoIds = new Set(narrowed.map((row) => row.photochromicProductId));
  const colorIds = new Set(narrowed.map((row) => row.photochromicColorId));
  const polIds = new Set(narrowed.map((row) => row.polarizationOptionId));
  const tintIds = new Set(narrowed.map((row) => row.tintOptionId));
  const mirrorIds = new Set(narrowed.map((row) => row.mirrorOptionId));

  const selection = useMemo<LensConfigurationSelection | null>(() => {
    if (!visionTypeId || !lensDesignId || !lensProductId || !lensMaterialId) return null;
    return {
      visionTypeId,
      lensDesignId,
      lensProductId,
      lensMaterialId,
      coatingId,
      photochromicProductId,
      photochromicColorId,
      polarizationOptionId,
      tintOptionId,
      tintStartDensityPercent: tintStart === "" ? null : Number(tintStart),
      tintEndDensityPercent: tintEnd === "" ? null : Number(tintEnd),
      requestedTransmissionPercent: null,
      customColorDescription: null,
      mirrorOptionId,
    };
  }, [
    coatingId,
    lensDesignId,
    lensMaterialId,
    lensProductId,
    mirrorOptionId,
    photochromicColorId,
    photochromicProductId,
    polarizationOptionId,
    tintEnd,
    tintOptionId,
    tintStart,
    visionTypeId,
  ]);

  const issues = useMemo(() => {
    if (!selection) return [];
    return [
      ...validateSelection(selection, db),
      ...validateRxAndFrame(selection, db, rightEye, leftEye, frame),
    ];
  }, [db, frame, leftEye, rightEye, selection]);

  const compatible = selection
    ? narrowed.filter((offering) => {
        const rejection = offering.active ? null : "inactive";
        return !rejection;
      })
    : [];

  function preview() {
    if (!selection) {
      toast.error("Complete the lens configuration first.");
      return;
    }
    if (issues.length) {
      toast.error(issues[0]?.message ?? "Fix validation errors.");
      return;
    }
    const resolved = resolveLabForLensConfiguration(
      {
        ...selection,
        organizationId: actor.organizationId,
        locationId,
        insurancePlanId: null,
        rightEye,
        leftEye,
        frame,
        rush,
        orderDate: new Date().toISOString(),
      },
      db,
    );
    setResult(resolved);
    if (!resolved.ok) toast.error(resolved.reason);
  }

  function submit() {
    if (!selection) return;
    try {
      commit((draft) => {
        const order = submitOpticalOrder(draft, actor, {
          ...selection,
          organizationId: actor.organizationId,
          locationId,
          insurancePlanId: null,
          rightEye,
          leftEye,
          frame,
          rush,
          orderDate: new Date().toISOString(),
        });
        if (order.status === "manual_review") {
          toast.message("Order held for manual review.", {
            description: order.failureReason ?? order.snapshot.routingExplanation,
          });
        } else {
          toast.success(`Routed to ${order.snapshot.labName}.`);
        }
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit order.");
    }
  }

  return (
    <div className="lf-module">
      <div className="lf-page-head">
        <div className="lf-page-kicker">New optical order</div>
        <div className="lf-page-title">Configure lens and route to a lab</div>
      </div>
      <div className="grid gap-6 p-4 sm:p-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <NativeSelect
              id="loc"
              label="Location"
              value={locationId}
              onChange={setLocationId}
              options={db.locations.map((row) => ({ value: row.id, label: row.name }))}
            />
            <NativeSelect
              id="vt"
              label="Vision type"
              value={visionTypeId}
              onChange={(v) => {
                setVisionTypeId(v);
                setLensDesignId(null);
                setLensProductId(null);
                setResult(null);
              }}
              options={visionTypes.map((row) => ({ value: row.id, label: row.name }))}
            />
            <NativeSelect
              id="des"
              label="Lens design"
              value={lensDesignId}
              onChange={(v) => {
                setLensDesignId(v);
                setLensProductId(null);
              }}
              options={designs.map((row) => ({ value: row.id, label: row.name }))}
            />
            <NativeSelect
              id="prod"
              label="Lens product"
              value={lensProductId}
              onChange={(v) => {
                setLensProductId(v);
                setLensMaterialId(null);
              }}
              options={products.map((row) => ({ value: row.id, label: row.productName }))}
            />
            <NativeSelect
              id="mat"
              label="Material / index"
              value={lensMaterialId}
              onChange={setLensMaterialId}
              options={materials.map((row) => ({ value: row.id, label: row.name }))}
            />
            <NativeSelect
              id="coat"
              label="Coating"
              value={coatingId}
              allowEmpty
              onChange={setCoatingId}
              options={db.coatings
                .filter((row) => coatingIds.has(row.id) || coatingIds.has(null))
                .map((row) => ({ value: row.id, label: row.name }))}
            />
            <NativeSelect
              id="photo"
              label="Photochromic"
              value={photochromicProductId}
              allowEmpty
              onChange={(v) => {
                setPhotochromicProductId(v);
                setPhotochromicColorId(null);
              }}
              options={db.photochromicProducts
                .filter((row) => photoIds.has(row.id) || photoIds.has(null))
                .map((row) => ({ value: row.id, label: row.name }))}
            />
            {photochromicProductId ? (
              <NativeSelect
                id="pcol"
                label="Photochromic color"
                value={photochromicColorId}
                allowEmpty
                onChange={setPhotochromicColorId}
                options={db.photochromicColors
                  .filter((row) =>
                    db.photochromicProductColors.some(
                      (link) =>
                        link.active &&
                        link.photochromicProductId === photochromicProductId &&
                        link.photochromicColorId === row.id &&
                        (colorIds.has(row.id) || colorIds.size === 0),
                    ),
                  )
                  .map((row) => ({ value: row.id, label: row.name }))}
              />
            ) : null}
            <NativeSelect
              id="pol"
              label="Polarization"
              value={polarizationOptionId}
              allowEmpty
              onChange={setPolarizationOptionId}
              options={db.polarizationOptions
                .filter((row) => polIds.has(row.id) || polIds.has(null))
                .map((row) => ({ value: row.id, label: row.name }))}
            />
            <NativeSelect
              id="tint"
              label="Tint"
              value={tintOptionId}
              allowEmpty
              onChange={setTintOptionId}
              options={db.tintOptions
                .filter((row) => tintIds.has(row.id) || tintIds.has(null))
                .map((row) => ({ value: row.id, label: row.name }))}
            />
            {tintOptionId &&
            db.tintOptions.find((row) => row.id === tintOptionId)?.tintType !== "NONE" ? (
              <>
                <Field label="Tint start density %" htmlFor="ts">
                  <Input
                    id="ts"
                    type="number"
                    value={tintStart}
                    onChange={(e) => setTintStart(e.target.value)}
                  />
                </Field>
                <Field label="Tint end density %" htmlFor="te">
                  <Input
                    id="te"
                    type="number"
                    value={tintEnd}
                    onChange={(e) => setTintEnd(e.target.value)}
                  />
                </Field>
              </>
            ) : null}
            <NativeSelect
              id="mir"
              label="Mirror"
              value={mirrorOptionId}
              allowEmpty
              onChange={setMirrorOptionId}
              options={db.mirrorOptions
                .filter((row) => mirrorIds.has(row.id) || mirrorIds.has(null))
                .map((row) => ({ value: row.id, label: row.name }))}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <EyeFields label="Right eye" value={rightEye} onChange={setRightEye} />
            <EyeFields label="Left eye" value={leftEye} onChange={setLeftEye} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <NativeSelect
              id="frame"
              label="Frame type"
              value={frame.type}
              onChange={(v) => setFrame({ ...frame, type: (v as FrameType) || "full_rim" })}
              options={[
                { value: "full_rim", label: "Full rim" },
                { value: "rimless", label: "Rimless" },
                { value: "drill_mount", label: "Drill mount" },
                { value: "groove", label: "Groove" },
                { value: "wrap", label: "Wrap" },
                { value: "safety", label: "Safety" },
              ]}
            />
            <Field label="Fitting height" htmlFor="fh">
              <Input
                id="fh"
                type="number"
                value={frame.fittingHeight ?? ""}
                onChange={(e) =>
                  setFrame({
                    ...frame,
                    fittingHeight: e.target.value === "" ? null : Number(e.target.value),
                  })
                }
              />
            </Field>
            <Field label="Segment height" htmlFor="sh">
              <Input
                id="sh"
                type="number"
                value={frame.segmentHeight ?? ""}
                onChange={(e) =>
                  setFrame({
                    ...frame,
                    segmentHeight: e.target.value === "" ? null : Number(e.target.value),
                  })
                }
              />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={rush} onCheckedChange={(checked) => setRush(checked === true)} />
            Rush
          </label>
          {issues.map((issue) => (
            <p key={issue.field} className="text-sm text-destructive">
              {issue.message}
            </p>
          ))}
          <div className="flex gap-2">
            <Button variant="outline" onClick={preview}>
              Check lab routing
            </Button>
            <Button onClick={submit} disabled={!selection || issues.length > 0}>
              Submit order
            </Button>
          </div>
        </div>

        <aside className="space-y-4 rounded-2xl border bg-background p-4">
          <h3 className="font-semibold">Summary</h3>
          <p className="text-sm text-muted-foreground">
            {selection
              ? configurationSummary(db, selection)
              : "Select a configuration to see a readable summary."}
          </p>
          <p className="text-xs text-muted-foreground">
            {compatible.length} active lab offering(s) match so far.
          </p>
          {result ? (
            result.ok ? (
              <div className="space-y-2 text-sm">
                <p>
                  <strong>{result.selectedLab.name}</strong>
                </p>
                <p>{result.selectedOffering.labProductName}</p>
                <p>SKU {result.labProductCodes.product ?? "—"}</p>
                {actor.canViewCost ? <p>Cost ${result.cost ?? "—"}</p> : null}
                <p>Turnaround {result.turnaround ?? "—"} business days</p>
                <p className="text-muted-foreground">{result.explanation}</p>
                {result.warnings.map((warning) => (
                  <p key={warning} className="text-amber-700">
                    {warning}
                  </p>
                ))}
                {result.alternatives.length ? (
                  <div>
                    <p className="font-medium">Alternatives</p>
                    {result.alternatives.map((alt) => (
                      <p key={alt.offering.id} className="text-xs text-muted-foreground">
                        {alt.lab.name} · {alt.offering.labProductName}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="text-sm text-destructive">
                <p>{result.reason}</p>
                <p className="mt-2">
                  Automatic submission is blocked until a compatible lab is configured.
                </p>
              </div>
            )
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function EyeFields({
  label,
  value,
  onChange,
}: {
  label: string;
  value: RxEye;
  onChange: (value: RxEye) => void;
}) {
  return (
    <fieldset className="grid gap-2 rounded-xl border p-3">
      <legend className="px-1 text-sm font-medium">{label}</legend>
      <Field label="Sphere" htmlFor={`${label}-sph`}>
        <Input
          id={`${label}-sph`}
          type="number"
          step="0.25"
          value={value.sphere}
          onChange={(e) => onChange({ ...value, sphere: Number(e.target.value) })}
        />
      </Field>
      <Field label="Cylinder" htmlFor={`${label}-cyl`}>
        <Input
          id={`${label}-cyl`}
          type="number"
          step="0.25"
          value={value.cylinder}
          onChange={(e) => onChange({ ...value, cylinder: Number(e.target.value) })}
        />
      </Field>
      <Field label="Add" htmlFor={`${label}-add`}>
        <Input
          id={`${label}-add`}
          type="number"
          step="0.25"
          value={value.add ?? ""}
          onChange={(e) =>
            onChange({ ...value, add: e.target.value === "" ? null : Number(e.target.value) })
          }
        />
      </Field>
    </fieldset>
  );
}
