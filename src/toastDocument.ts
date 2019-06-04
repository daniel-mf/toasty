import DanForden from "./DanForden";

/**
 * Random toasty! on document.body click!
 * @param percent Defaults to 60% change per click
 */
function toastDocument(percent = .06) {

    let dan: DanForden = null,
        enabled = true,
        busy = false;

    const observe = () => {
        document.body.addEventListener('click', e => {
            if (!enabled) {
                enabled = true;
            } else {
                const element = e.target;

                if (element instanceof HTMLElement
                    && Math.random() <= percent) {

                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    if (!dan) {
                        dan = new DanForden();
                    }

                    if (!busy) {
                        busy = true;
                        const finish = () => {
                            busy = false;
                            enabled = false;
                            element.click();
                        };
                        dan.toast()
                            .then(finish)
                            .catch(finish);
                    }
                }
            }
        }, true);

    };

    if (document.body) {
        observe();
    } else {
        window.addEventListener('DOMContentLoaded', observe);
    }

}

export default toastDocument;