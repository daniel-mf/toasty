import DanForden from "./DanForden";

function objectIsToastable(obj: any): obj is HTMLElement {
    return obj instanceof HTMLElement && !obj.hasAttribute('data-is-toasted');
}

class Toastable {

    private _element: HTMLElement;
    private forden: DanForden = null;
    private enabled = true;
    private busy = false;
    private readonly toaster: (event: MouseEvent) => void;

    readonly chance: number;

    constructor(element: HTMLElement, chance = 1) {
        this.toaster = event => this.clicked(event);
        this.element = element;
        this.chance = chance;
    }

    public set element(element: HTMLElement) {

        if (this._element) {
            this._element.removeEventListener('click', this.toaster);
        }

        this._element = element;

        if (element) {
            this._element.addEventListener('click', this.toaster, true);
        }
    }

    private clicked(event: MouseEvent) {
        if (!this.enabled) {
            this.enabled = true;
            return true;
        } else {

            if (objectIsToastable(event.target) && Math.random() <= this.chance) {

                const element = event.target;

                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                if (!this.busy) {
                    this.busy = true;
                    const finish = () => {
                        this.busy = false;
                        this.enabled = false;
                        element.click();
                    };
                    this.dan.toast()
                        .then(finish)
                        .catch(finish);
                }

                return false;
            }
        }
    }

    private get dan(): DanForden {
        if (!this.forden) {
            this.forden = new DanForden();
        }
        return this.forden;
    }

    dispose() {
        this.element = null;
        this.forden = null;
    }

}

export default Toastable;