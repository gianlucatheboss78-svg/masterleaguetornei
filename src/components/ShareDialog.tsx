import { useState } from "react";
import { Check, Copy, Link2, Send } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function ShareDialog({
  open,
  onOpenChange,
  name,
  url,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  name: string;
  url: string;
}) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (!value) setCopied(false);
      }}
    >
      <DialogContent className="card-night w-[calc(100%-2rem)] max-w-sm p-5">
        <DialogHeader className="pr-7 text-left">
          <DialogTitle className="gold-text text-xl">{t("share.title")}</DialogTitle>
          <DialogDescription className="truncate text-sm text-muted-foreground">{name}</DialogDescription>
        </DialogHeader>

        <div className="mx-auto rounded-lg bg-qr p-3 text-qr-foreground">
          {url && <QRCodeSVG value={url} size={176} level="H" fgColor="currentColor" bgColor="transparent" />}
        </div>

        <div className="flex min-w-0 items-center gap-2 rounded-md border border-border bg-secondary/60 p-2">
          <Link2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{url}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button asChild className="h-11 bg-success text-success-foreground hover:bg-success/90">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${name} ${url}`)}`}
              target="_blank"
              rel="noreferrer"
            >
              <Send aria-hidden="true" />
              WhatsApp
            </a>
          </Button>
          <Button type="button" variant="outline" className="h-11" onClick={copy}>
            {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
            {copied ? t("share.copied") : t("share.copy")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
