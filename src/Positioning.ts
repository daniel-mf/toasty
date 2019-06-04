interface ElementPosition {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
}

type Direction = 'X' | 'Y';

type XPosition = 'left' | 'right';
type YPosition = 'top' | 'bottom';

export {ElementPosition, Direction, XPosition, YPosition};