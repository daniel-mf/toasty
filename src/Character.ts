import {ElementPosition} from "./Positioning";

abstract class Character {

    protected readonly abstract pictureData: string;
    private _element: HTMLImageElement;

    private loadFinished = false;

    private loadCallbacks: Function[][] = [];

    constructor() {
    }

    get element(): HTMLImageElement {
        this.createElement();
        return this._element;
    }

    private createElement() {
        if (!this._element) {
            this._element = this.buildElement();
            this.styleElement();
        }
        if (!this._element.parentElement) {
            this.appendToDocument();
        }
    }

    protected async loaded() {

        if (this.loadFinished) {
            return;
        }

        const promise = new Promise((release, reject) => {
            this.loadCallbacks.push([release, reject]);
        });

        this.createElement();

        return promise;
    }

    protected buildElement<T extends HTMLElement>(): T {
        const img = document.createElement('img');

        img.src = this.pictureData;

        img.addEventListener('load', () => {
            this.loadFinished = true;
            for (const [release] of this.loadCallbacks) {
                release();
            }
        });

        img.addEventListener('error', () => {
            this.loadFinished = true;
            for (const [, reject] of this.loadCallbacks) {
                reject();
            }
        });

        return img as unknown as T;
    }

    protected styleElement() {
        this.element.style.position = 'fixed';
        this.element.style.width = '25vmin';
        this.element.style.visibility = 'hidden';
    }

    protected appendToDocument() {
        document.body.appendChild(this._element);
    }

    protected removeFromDocument() {
        this._element.remove();
    }

    protected teleportTo(position: ElementPosition) {
        this.applyPosition(position);
    }

    private applyPosition({left, right, top, bottom}: ElementPosition) {
        this.element.style.left = !isNaN(left) ? left + 'px' : '';
        this.element.style.right = !isNaN(right) ? right + 'px' : '';
        this.element.style.top = !isNaN(top) ? top + 'px' : '';
        this.element.style.bottom = !isNaN(bottom) ? bottom + 'px' : '';
    }

    protected get pictureWidth(): number {
        return this.element.width;
    }

    protected async speak(audio: string) {
        const speaker = document.createElement('audio');

        const future = new Promise<void>((release) => {
            speaker.addEventListener('canplaythrough', async () => {
                speaker.play().catch(err => {
                    console.warn(`could not play "${audio}"`, err.message);
                });
                release();
            }, false);
        });

        speaker.src = audio;
        speaker.load();

        return future;
    }

}

export {Character};