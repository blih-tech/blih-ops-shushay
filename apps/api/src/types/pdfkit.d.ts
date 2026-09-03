declare module "pdfkit" {
  class PDFDocument {
    constructor(options?: any);
    pipe(destination: any): any;
    rect(x: number, y: number, w: number, h: number): this;
    lineWidth(w: number): this;
    strokeColor(color: string): this;
    fillColor(color: string): this;
    stroke(): this;
    fill(): this;
    fillAndStroke(fillColor?: string, strokeColor?: string): this;
    font(src: string, size?: number): this;
    fontSize(size: number): this;
    text(text: string, x?: number, y?: number, options?: any): this;
    moveTo(x: number, y: number): this;
    lineTo(x: number, y: number): this;
    end(): void;
  }
  export default PDFDocument;
}
