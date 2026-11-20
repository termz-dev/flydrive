"use client";

import type { ReactNode } from "react";
import type { ActionState } from "@/platform/action";
import { ActionForm, SubmitButton } from "./form";

type Action = (state: ActionState, fd: FormData) => Promise<ActionState>;

/** One-click action with hidden fields and optional extra inputs (e.g. a reason). */
export function ActionButton({
  action,
  fields,
  label,
  pendingText,
  children,
  variant = "primary",
}: {
  action: Action;
  fields: Record<string, string>;
  label: string;
  pendingText?: string;
  children?: (errors: Record<string, string>) => ReactNode;
  variant?: "primary" | "danger";
}) {
  return (
    <ActionForm action={action} className={variant === "danger" ? "form-danger" : undefined}>
      {(e) => (
        <>
          {Object.entries(fields).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
          {children?.(e)}
          <div>
            <SubmitButton pendingText={pendingText ?? "Working…"}>{label}</SubmitButton>
          </div>
        </>
      )}
    </ActionForm>
  );
}
