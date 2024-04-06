class ZapTail extends WorldObject {
    private parentBall: Balls.Currenter;

    private startPoint: Vector2;
    private segments: YarnSegment[]; // Use yarn segment because of it similarity
    private startDistance: number;
    
    private random: RandomNumberGenerator;
    private randomOffset: number;

    constructor(parentBall: Balls.Currenter, startPoint: Vector2) {
        super();
        this.parentBall = parentBall;
        this.reset(startPoint);

        this.random = new RandomNumberGenerator();
        this.randomOffset = Random.float(0, 1);
    }

    update(): void {
        super.update();

        for (let segment of this.segments) {
            segment.life -= this.delta;
        }

        while (this.segments.length > 0 && this.segments[0].life <= 0) { 
            let length = G.distance(this.startPoint, this.segments[0].endpoint);
            let k = Math.ceil((length - this.startDistance)/4);
            this.startDistance += 4*k - length;

            this.startPoint = this.segments[0].endpoint;
            this.segments.shift();
        }
    }

    render(texture: Texture, x: number, y: number): void {
        for (let segment of this.segments) {
            let _ = this.segments.indexOf(segment);
        }
        //let me = Random.inDisc(2, 4);
    }

    addSegment(endpoint: Vector2, life: number): void {
        this.segments.push({
            endpoint: vec2(endpoint),
            life: life,
            maxLife: life,
        });
    }

    reset(startPoint: Vector2): void {
        this.startPoint = vec2(startPoint);
        this.segments = [];
        this.startDistance = 0;
    }
}