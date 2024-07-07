export class Designer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  defaultRectSize = 30;
  #selectedAsset!: HTMLElement | null;
  selectedAssetType = {
    Rubber: 1,
    Asset: 2,
  };
  constructor(_canvas: HTMLCanvasElement) {
    this.canvas = _canvas;
    this.ctx = this.canvas.getContext("2d")!;
    //this.addMouseMoveListener();
    this.addMouseClickLister();
  }
  clearCanvas() {
    this.clearRectangle(0, 0, this.canvas.width, this.canvas.height);
  }

  setAsset(ele: HTMLElement | null) {
    this.#selectedAsset = ele;
  }
  createBlankCanvas(row: number, col: number) {
    this.canvas.width = this.defaultRectSize * row;
    this.canvas.height = this.defaultRectSize * col;
    for (let r = 0; r < row; r++) {
      for (let c = 0; c < col; c++) {
        this.drawRectangle(r * this.defaultRectSize, c * this.defaultRectSize);
      }
    }
  }
  canvasListener(event: MouseEvent) {
    //console.log(event);
    const { xPos, yPos } = this.getRectPostion(event);
    console.log(xPos, yPos);

    this.clearRectangle(
      xPos * this.defaultRectSize,
      yPos * this.defaultRectSize
    );
    const assetType = this.checkSelectedElementType();
    switch (true) {
      case assetType === this.selectedAssetType.Asset:
        this.placeAsset(
          xPos * this.defaultRectSize,
          yPos * this.defaultRectSize,
          this.#selectedAsset as HTMLImageElement
        );
        break;
      case assetType === this.selectedAssetType.Rubber:
        break;
    }
  }
  checkSelectedElementType() {
    switch (true) {
      case this.#selectedAsset?.classList.contains("rubber"):
        return this.selectedAssetType.Rubber;
        break;
      case this.#selectedAsset?.classList.contains("assets"):
        return this.selectedAssetType.Asset;
    }
  }
  placeAsset(xpos: number, yPos: number, imgSrc: HTMLImageElement) {
    this.ctx.drawImage(
      imgSrc,
      xpos,
      yPos,
      this.defaultRectSize,
      this.defaultRectSize
    );
    this.ctx.strokeRect(xpos, yPos, this.defaultRectSize, this.defaultRectSize);
  }
  getRectPostion(event: MouseEvent): { xPos: number; yPos: number } {
    const xPos = Math.ceil(event.offsetX / this.defaultRectSize) - 1;
    const yPos = Math.ceil(event.offsetY / this.defaultRectSize) - 1;
    return { xPos, yPos };
  }
  addMouseMoveListener() {
    this.canvas.addEventListener("mousemove", (event) => {
      this.canvasListener(event);
    });
  }
  addMouseClickLister() {
    this.canvas.addEventListener("click", (event) => {
      this.canvasListener(event);
    });
  }
  clearRectangle(
    x: number,
    y: number,
    width = this.defaultRectSize,
    height = this.defaultRectSize
  ) {
    this.ctx.clearRect(x, y, width, height);
  }
  drawRectangle(
    x: number,
    y: number,
    color = "white",
    width = this.defaultRectSize,
    height = this.defaultRectSize
  ) {
    this.ctx.fillStyle = color; // Set the fill color
    this.ctx.fillRect(x, y, width, height); // Draw the filled rectangle
    this.ctx.strokeStyle = "#e3e2e3"; // Set the stroke color
    this.ctx.lineWidth = 1; // Set the line width for the stroke
    this.ctx.strokeRect(x, y, width, height);
    this.ctx.strokeRect(x, y, width, height); // Draw the rectangle border
  }
}
