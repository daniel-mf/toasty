import Toastable from "./Toastable";

function init(chance: number) {
    new Toastable(document.body, chance);
}

/**
 * Random toasty! on document.body click!
 * @param chance Defaults to 6% change per click
 */
function toastDocument(chance = .06) {
    if (document.body) {
        init(chance);
    } else {
        window.addEventListener('DOMContentLoaded', () => init(chance));
    }
}

export default toastDocument;