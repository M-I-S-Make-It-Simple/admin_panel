'use client';

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";

type Props = {
  onUploadComplete: (url: string) => void;
};

// Тип відповіді UploadThing
type UploadThingResponse = {
  name: string;
  size: number;
  url: string;
}[];

export function ImageUploader({ onUploadComplete }: Props) {
  return (
    <UploadButton<OurFileRouter, any>
      endpoint="imageUploader"
      onClientUploadComplete={(res: UploadThingResponse) => {
        if (res && res[0]) {
          onUploadComplete(res[0].url);
        }
      }}
      onUploadError={(error: Error) => {
        alert(`Помилка завантаження: ${error.message}`);
      }}
    />
  );
}
