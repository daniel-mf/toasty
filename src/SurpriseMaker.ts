import {Direction, XPosition, YPosition} from "./Positioning";

interface SurpriseMaker {
    surprise: (direction: Direction, xPosition: XPosition, yPosition: YPosition) => Promise<void>;
}

export {SurpriseMaker};