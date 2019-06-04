import {Character} from "./Character";
import {SurpriseMaker} from "./SurpriseMaker";
import {Direction, ElementPosition, XPosition, YPosition} from "./Positioning";

async function holdFor(ms: number): Promise<void> {
    return new Promise<void>(release => setTimeout(release, ms));
}

abstract class SurprisingBuddy extends Character implements SurpriseMaker {

    protected surprising = false;

    private stayingTime = 300;

    private movementDuration = 200;

    async surprise(direction: Direction, xPosition: XPosition, yPosition: YPosition): Promise<void> {
        if (this.surprising)
            return;

        this.surprising = true;

        const position: ElementPosition = {
            [xPosition]: 0,
            [yPosition]: 0,
        };

        this.teleportTo(position);

        const movement = 100 * (direction == "X" ? (xPosition == "left" ? -1 : 1) : (yPosition == "top" ? -1 : 1));

        await this.hide(0, direction, movement);
        await this.show(this.movementDuration, direction);
        await holdFor(this.stayingTime);
        await this.hide(this.movementDuration, direction, movement);

        this.surprising = false;

        this.removeFromDocument();
    }

    private async hide(ms: number, direction: Direction, movement: number) {
        return this.transform(movement, ms, direction);
    }

    private async show(ms: number, direction: Direction,) {
        return this.transform(0, ms, direction);
    }

    private async transform(value: number, ms: number, direction: Direction) {
        if (ms > 0) {
            await holdFor(50);
            this.element.style.visibility = 'visible';
        }
        this.element.style.transition = `transform ${ms}ms ease`;
        this.element.style.transform = `translate${direction}(${value}%)`;

        if (ms > 0) {

            return await new Promise(release => {

                const transitionHandler = () => {
                    this.element.removeEventListener('transitionend', transitionHandler);
                    release();
                };

                this.element.addEventListener('transitionend', transitionHandler);
            });

        }

    }

}

export default SurprisingBuddy;