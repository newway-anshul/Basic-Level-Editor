import { Designer } from "./levelDesinger";
export class LayOut {
  assetsContainer: HTMLDivElement;
  topBar: HTMLDivElement;
  mainArea: HTMLDivElement;
  bottomBar: HTMLDivElement;
  currentlySelectedAsset!: HTMLElement | null;
  customCursor: HTMLDivElement;
  activeDimensions = {
    row: 15,
    col: 15,
  };
  designer: Designer;
  constructor() {
    this.assetsContainer = this.readElement<HTMLDivElement>(
      "div.items.assetItems"
    ) as HTMLDivElement;
    this.topBar = this.readElement<HTMLDivElement>(
      "div.items.topBar"
    ) as HTMLDivElement;
    this.mainArea = this.readElement(".mainArea") as HTMLDivElement;
    this.bottomBar = this.readElement(".bottomBar") as HTMLDivElement;
    this.customCursor = this.mainArea.querySelector(
      "div.customeCursor"
    ) as HTMLDivElement;
    this.designer = new Designer(this.mainArea.querySelector("canvas")!);
  }

  dimensionBtnListener(dimensionBox: HTMLDivElement) {
    const width = (
      dimensionBox.querySelector('input[name="width"]') as HTMLInputElement
    ).value;
    const height = (
      dimensionBox.querySelector('input[name="height"]') as HTMLInputElement
    ).value;
    this.updateActiveDimensions(+width, +height);
    dimensionBox.classList.add("hidden");
  }

  setDimensions() {
    this.bottomBar
      .querySelector("div.mapdimensions")
      ?.addEventListener("click", () => {
        const dimensionBox = this.readElement<HTMLDivElement>(
          "div.setDimensionsBox"
        ) as HTMLDivElement;
        if (dimensionBox.classList.contains("hidden")) {
          dimensionBox.classList.remove("hidden");
          dimensionBox
            .querySelector(".footer button")
            ?.addEventListener("click", () => {
              this.dimensionBtnListener(dimensionBox);
            });
        } else {
          dimensionBox.classList.add("hidden");
          dimensionBox
            .querySelector("footer button")
            ?.removeEventListener("click", () => {
              this.dimensionBtnListener(dimensionBox);
            });
        }
      });
  }
  updateActiveDimensions(w: number, h: number) {
    this.activeDimensions.row = +w;
    this.activeDimensions.col = +h;
    (
      this.bottomBar.querySelector("div.mapdimensions") as HTMLDivElement
    ).textContent = `${w}x${h}`;
    this.designer.createBlankCanvas(
      this.activeDimensions.row,
      this.activeDimensions.col
    );
  }
  addActiveTileClick() {
    this.topBar
      .querySelector("div.activetile img")
      ?.addEventListener("click", (e) => {
        let src = (e.target as HTMLImageElement).getAttribute("src");
        src = src?.replaceAll("svg", "png")!;
        this.assetsContainer.querySelectorAll("img")?.forEach((img) => {
          if (img.getAttribute("src") === src) {
            this.assetClicked(img);
          }
        });
      });
  }
  addDropAsset() {
    this.mainArea.addEventListener("contextmenu", (event) => {
      // Prevent the default context menu from appearing
      //event.preventDefault();
      if (event.button === 2) {
        this.removeAllActiveClass();
        this.removeImageasCursor();
      }
    });
  }
  removeAllActiveClass() {
    const allActiveEles = this.readElement<HTMLElement>(
      "div.assetItems img.active",
      true
    ) as NodeListOf<HTMLElement>;
    allActiveEles.forEach((ele) => ele.classList.remove("active"));
  }
  readElement<T extends Element>(
    selector: string,
    isMulti = false
  ): T | NodeListOf<T> {
    if (isMulti) {
      return document.querySelectorAll<T>(selector);
    } else {
      const element = document.querySelector<T>(selector);
      if (!element) {
        throw new Error(`Element with selector "${selector}" not found`);
      }
      return element;
    }
  }
  assetClicked(element: HTMLElement) {
    if (element.classList.contains("active")) {
      element.classList.remove("active");
      this.currentlySelectedAsset = null;
      this.designer.setAsset(null);
      //this.removeImageasCursor();
    } else {
      this.removeAllActiveClass();
      element.classList.add("active");
      //this.addImageasCursor(element.getAttribute("src")!);
      this.topBar
        .querySelector("div.activetile img")
        ?.setAttribute("src", element.getAttribute("src")!);
      this.currentlySelectedAsset = element;
      this.designer.setAsset(element);
    }
  }
  addAssets() {
    for (let index = 1; index <= 30; index++) {
      const element = document.createElement("img");
      element.classList.add("assets");
      element.classList.add(`asset${index}`);
      element.src = `../src/assets/tiles/png/tile-${index}.png`;
      element.addEventListener("click", () => {
        this.assetClicked(element);
      });
      this.assetsContainer.append(element);
    }
  }
  addImageasCursor(imgSrc: string) {
    this.mainArea.style.cursor = `url("${imgSrc}"), auto`;
  }
  removeImageasCursor() {
    this.mainArea.style.cursor = "initial";
  }
  addRubber() {
    this.topBar
      .querySelector("div.rubber")
      ?.addEventListener("click", (event) => {
        if ((event.currentTarget as HTMLElement).classList.contains("active")) {
          this.removeImageasCursor();
          (event.currentTarget as HTMLElement).classList.remove("active");
        } else {
          const cursorURL = "./src/assets/icons/rubber-icon-black.svg";
          (event.currentTarget as HTMLElement).classList.add("active");
          this.addImageasCursor(cursorURL);
          this.currentlySelectedAsset = event.currentTarget as HTMLDivElement;
          this.designer.setAsset(event.currentTarget as HTMLDivElement);
        }
      });
  }
  clearCanvas() {
    this.topBar.querySelector("div.clear")?.addEventListener("click", () => {
      this.designer.clearCanvas();
      this.designer.createBlankCanvas(
        this.activeDimensions.row,
        this.activeDimensions.col
      );
    });
  }
  startApp() {
    this.addAssets();
    this.addDropAsset();
    this.addActiveTileClick();
    this.addRubber();
    this.clearCanvas();
    this.setDimensions();
    //canvas related functions
    this.designer.createBlankCanvas(
      this.activeDimensions.row,
      this.activeDimensions.col
    );
  }
}
