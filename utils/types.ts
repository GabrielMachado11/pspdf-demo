export interface AnnotationsJSON {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  annotations: any[];
  format: string;
}

export interface PSPDFAnnotation {
  uuid: string;
  name: string;
  type: string;
  pageIndex: string;
  text?:
    | {
        format: string;
        value: string;
      }
    | string;
}

export interface PSPDFOnAnnotationsChangedPayload {
  change: 'added' | 'changed' | 'removed';
  annotations: PSPDFAnnotation[];
  target: number;
}
