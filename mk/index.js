(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.MK = {}));
}(this, function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    class Character {
        constructor() {
            this.loadFinished = false;
            this.loadCallbacks = [];
        }
        get element() {
            this.createElement();
            return this._element;
        }
        createElement() {
            if (!this._element) {
                this._element = this.buildElement();
                this.styleElement();
            }
            if (!this._element.parentElement) {
                this.appendToDocument();
            }
        }
        loaded() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.loadFinished) {
                    return;
                }
                const promise = new Promise((release, reject) => {
                    this.loadCallbacks.push([release, reject]);
                });
                this.createElement();
                return promise;
            });
        }
        buildElement() {
            const img = document.createElement('img');
            img.src = this.picturePath;
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
            return img;
        }
        styleElement() {
            this.element.style.position = 'fixed';
            this.element.style.width = '25vmin';
            this.element.style.visibility = 'hidden';
        }
        appendToDocument() {
            document.body.appendChild(this._element);
        }
        removeFromDocument() {
            this._element.remove();
        }
        teleportTo(position) {
            this.applyPosition(position);
        }
        applyPosition({ left, right, top, bottom }) {
            this.element.style.left = !isNaN(left) ? left + 'px' : '';
            this.element.style.right = !isNaN(right) ? right + 'px' : '';
            this.element.style.top = !isNaN(top) ? top + 'px' : '';
            this.element.style.bottom = !isNaN(bottom) ? bottom + 'px' : '';
        }
        get pictureWidth() {
            return this.element.width;
        }
        speak(audio) {
            return __awaiter(this, void 0, void 0, function* () {
                const speaker = document.createElement('audio');
                const future = new Promise((release) => {
                    speaker.addEventListener('canplaythrough', () => __awaiter(this, void 0, void 0, function* () {
                        speaker.play().catch(err => {
                            console.warn(`could not play "${audio}"`, err.message);
                        });
                        release();
                    }), false);
                });
                speaker.src = `mk/${audio}.mp3`;
                speaker.load();
                return future;
            });
        }
    }

    function holdFor(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(release => setTimeout(release, ms));
        });
    }
    class SurprisingBuddy extends Character {
        constructor() {
            super(...arguments);
            this.surprising = false;
            this.stayingTime = 300;
            this.movementDuration = 200;
        }
        surprise(direction, xPosition, yPosition) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.surprising)
                    return;
                this.surprising = true;
                const position = {
                    [xPosition]: 0,
                    [yPosition]: 0,
                };
                this.teleportTo(position);
                const movement = 100 * (direction == "X" ? (xPosition == "left" ? -1 : 1) : (yPosition == "top" ? -1 : 1));
                yield this.hide(0, direction, movement);
                yield this.show(this.movementDuration, direction);
                yield holdFor(this.stayingTime);
                yield this.hide(this.movementDuration, direction, movement);
                this.surprising = false;
                this.removeFromDocument();
            });
        }
        hide(ms, direction, movement) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.transform(movement, ms, direction);
            });
        }
        show(ms, direction) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.transform(0, ms, direction);
            });
        }
        transform(value, ms, direction) {
            return __awaiter(this, void 0, void 0, function* () {
                if (ms > 0) {
                    yield holdFor(50);
                    this.element.style.visibility = 'visible';
                }
                this.element.style.transition = `transform ${ms}ms ease`;
                this.element.style.transform = `translate${direction}(${value}%)`;
                if (ms > 0) {
                    return yield new Promise(release => {
                        const transitionHandler = () => {
                            this.element.removeEventListener('transitionend', transitionHandler);
                            release();
                        };
                        this.element.addEventListener('transitionend', transitionHandler);
                    });
                }
            });
        }
    }

    class DanForden extends SurprisingBuddy {
        constructor() {
            super(...arguments);
            this.picturePath = 'mk/dan.png';
        }
        toast() {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.loaded();
                if (!this.surprising) {
                    yield this.speak('toasty');
                    yield this.surprise('X', 'right', 'bottom');
                }
            });
        }
    }

    function objectIsToastable(obj) {
        return obj instanceof HTMLElement && !obj.hasAttribute('data-is-toasted');
    }
    class Toastable {
        constructor(element, chance = 1) {
            this.forden = null;
            this.enabled = true;
            this.busy = false;
            this.toaster = event => this.clicked(event);
            this.element = element;
            this.chance = chance;
        }
        set element(element) {
            if (this._element) {
                this._element.removeEventListener('click', this.toaster);
            }
            this._element = element;
            if (element) {
                this._element.addEventListener('click', this.toaster, true);
            }
        }
        clicked(event) {
            if (!this.enabled) {
                this.enabled = true;
                return true;
            }
            else {
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
        get dan() {
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

    function init(chance) {
        new Toastable(document.body, chance);
    }
    function toastDocument(chance = .06) {
        if (document.body) {
            init(chance);
        }
        else {
            window.addEventListener('DOMContentLoaded', () => init(chance));
        }
    }

    exports.DanForden = DanForden;
    exports.Toastable = Toastable;
    exports.toastDocument = toastDocument;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
