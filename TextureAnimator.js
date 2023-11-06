export class TextureAnimator {
    constructor(inProps) {
        this.texture = inProps.texture;
        this.tilesX = inProps.tilesX;
        this.tilesY = inProps.tilesY;
        this.tileDisplayDuration = inProps.tileDispDuration;

        this.freezeAtTheEnd = inProps.freezeAtTheEnd;
        this.playReverse = inProps.playReverse;
        this.playRange = inProps.playRange;

        // default startTile is 0, unless specified by play range
        this.startTile = 0;

        // how many images does this spritesheet contain?
        // usually equals tilesHoriz * tilesVert, but not necessarily,
        // if there are blank tiles at the bottom of the spritesheet.
        this.tileCount = inProps.tileCount;

        // if 0, then use tilesX * tilesY
        if (this.tileCount == 0) {
            this.tileCount = this.tilesX * this.tilesY;
        }

        this.endTile = this.tileCount - 1;

        if (this.playRange != null && this.playRange.length == 2) {
            // if play range is specified and in the wrong order
            // means we need to play backwards, need to swap elements first
            if (this.playRange[1] < this.playRange[0]) {
                let temp = this.playRange[1];
                this.playRange[1] = this.playRange[0];
                this.playRange[0] = temp;
                this.playReverse = true;
            }

            this.startTile = this.playRange[0];
            this.tileCount = this.playRange[1] - this.startTile + 1;
            this.endTile = this.startTile + this.tileCount - 1;
        }

        // just in case someone passes a real number fro stepping
        this.playStep = Math.floor(inProps.playEveryNthFrame);

        if (this.playStep == 0) {
            this.playStep = 1;
        }

        if (inProps.compensateDelayForNthFrame) {
            this.tileDisplayDuration *= this.playStep;
        }

        if (this.playReverse) {
            // swap end and start tiles
            let temp = this.endTile;
            this.endTile = this.startTile;
            this.startTile = temp;
            this.playStep = -this.playStep;
        }

        // debug
        if (!PRODUCTION) {
            console.log('tileCount', this.tileCount);
            console.log('startTile', this.startTile);
            console.log('endTile', this.endTile);
        }

        this.loop = inProps.loop;

        this.texture.repeat.set(1 / this.tilesX, 1 / this.tilesY);

        // how long has the current image been displayed?
        this.currentDisplayTime = 0;

        // which image is currently being displayed?
        this.currentTile = this.startTile;
    }

    tick(milliSec) {
        this.currentDisplayTime += milliSec;
        while (this.currentDisplayTime > this.tileDisplayDuration) {
            this.currentDisplayTime -= this.tileDisplayDuration;
            if (
                (!this.playReverse && this.currentTile > this.endTile) ||
                (this.playReverse && this.currentTile < this.endTile)
            ) {
                if (this.freezeAtTheEnd) {
                    this.pause();
                    if (!PRODUCTION) {
                        console.log('currentTile', this.currentTile);
                    }
                    break;
                }
                this.currentTile = this.startTile;
            }
            this.refresh();
            this.currentTile += this.playStep;
        }
    }

    play() {
        this.loop.updatables.push(this);
    }

    pause() {
        this.loop.removeFromUpdatables(this);
    }

    reset() {
        this.currentTile = this.startTile;
        this.refresh();
    }

    showSpecificTile(tileNum) {
        this.currentTile = tileNum;
        this.refresh();
    }

    refresh() {
        let currentColumn = this.currentTile % this.tilesX;
        this.texture.offset.x = currentColumn / this.tilesX;
        // spritesheet is from top to bottom, but three start from bottom, need to reverse
        // and offset tilesVertical by 1, compensating 0-based count
        let currentRow = this.tilesY - 1 - Math.floor(this.currentTile / this.tilesX);
        this.texture.offset.y = currentRow / this.tilesY;
    }
}
