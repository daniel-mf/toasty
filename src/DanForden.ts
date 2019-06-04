import SurprisingBuddy from "./SurprisingBuddy";

class DanForden extends SurprisingBuddy {
    protected readonly picturePath = 'mk/dan.png';

    /**
     * Toasy!
     */
    public async toast() {
        await this.loaded();
        if (!this.surprising) {
            await this.speak('toasty');
            await this.surprise('X', 'right', 'bottom');
        }
    }

}

export default DanForden;