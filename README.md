# What?
A simple JS class to implement animation on spritesheets in ThreeJS rendering engine. 
This class actually is agnostic of three, it doesn't know what ThreeJS is, so you can adjust it to any other engine, but you'd have to adjust the offset functions in `tick()`, of course.

# Note
This class expects sprite sheet starting from upper-left corner (three wants it from lower-left corner).
Just in case, line 124 is where it happens:
```let currentRow = this.tilesY - 1 - Math.floor(this.currentTile / this.tilesX);```

# Features:
1. Play/Pause
2. Reset, resets to start tile
3. Freeze animation at the end (play once)
4. Show specific tile
5. Play specific range
6. Play reverse
7. Play every nth frame (plus optionally compensate for nth delay, if you want to keep animation speed)
   
# How to use:
1. import TextureAnimator class into your module and instanciate like so:
```
tex = ImageUtils.loadTexture("images/textures/tst/tst.png");

let sheetAnimation = new TextureAnimator({
            texture: tex, // texture sheet, passed by ref
            tilesX: 14, // tile count in x
            tilesY: 14, // tile count in y
            tileCount: 0, // total number of tiles, overriden by playRange, or if zero, tilesX * tilesY
            tileDispDuration: 0.04, // how long should each image be displayed?
            freezeAtTheEnd: false, // should the animation freeze at the last image?
            playReverse: false, // should the animation play backwards?
            playRange: [], // optional play range, if empty - animation will play from 0 to tileCount - 1
            playEveryNthFrame: 1, // play every nth frame, integer please. Will be truncated if real is passed
            compensateDelayForNthFrame: false, // in case we want to play every nth frame, but keep animation speed
            loop: this.loop, // Loop instance, for proper stopping animation
        });
```

2. You can create a test plane to test it out:

```
let planeGeo = new PlaneGeometry();
const sheetMaterial = new MeshBasicMaterial({ map: tex });
let planeMesh = new Mesh(planeGeo, sheetMaterial);

plane.material = sheetMaterial;
scene.add(planeMesh);
sheetAnimation.reset();
sheetAnimation.play();
```

3. You would probably have to adjust the `play()` and `pause()` functions to your implementation. The loop parameter is an object, which calls `tick()` on every object... well, every `tick`!

If you find any bugs, or have any suggestions on how to optimize this, welcome to create a pull request!
