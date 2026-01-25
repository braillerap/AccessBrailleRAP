class GeomToGCode
{
    constructor ()
    {
        this.speed = 6000;
		this.accel = 1500;
		this.fastspeed = 10000;
		this.fastaccel = 8000;
		this.normspeed = 6000;
		this.normaccel = 1500;
        this.gcode = [];
    	
    }

	setPrintSpeed (fast)
	{
		if (fast)
		{
			this.speed = this.fastspeed;
			this.accel = this.fastaccel;
		}
		else
		{
			this.speed = this.normspeed;
			this.accel = this.normaccel;
		}

	}
    MotorOff ()
	{
		return 'M84;\r\n';
	}

	Home ()
	{
		let str = 'G28 X;\r\n';
		str += 'G28 Y;\r\n';

		return str;
	}
    gcodePosition (X, Y) {
		let code = ''
		if(X == null && Y == null) {
			throw new Error("Null position when moving")
		}
		if(X != null) {
			code += ' X' + X.toFixed(2)
		}
		if(Y != null) {
			code += ' Y' + Y.toFixed(2)
		}
		
		code += ';\r\n'
		return code
	}

	gcodeResetPosition (X, Y) {
		return 'G92' + this.gcodePosition(X, Y);
	}

	SetSpeed = function(speed) {
		return 'G1 F' + speed + ';\r\n'
	}
    SetAccel = function (accel)
	{
		return 'M204 T' + accel + ';\r\n'
	}
    MoveTo (X, Y) {
		return 'G1' + this.gcodePosition(X, Y)
	}
    PrintDot = function () {
		let s = 'M3 S1;\r\n';
		s += 'M3 S0;\r\n';

		return (s);
	}

    GeomToGCode (pts)
    {
        this.gcode = [];
        this.gcode += this.Home ();
        
		// go to 0,0 at low speed
		this.gcode += this.SetSpeed (1500);
		this.gcode += this.SetAccel (1000);
        this.gcode += this.MoveTo(0,0);
		
		// set standard accel
		this.gcode += this.SetSpeed (this.speed);
		this.gcode += this.SetAccel (this.accel);

		// add all dots
        for (let p = 0; p < pts.length; p++)
        {
            this.gcode += this.MoveTo(pts[p].x, pts[p].y)
            this.gcode += this.PrintDot ();
        }

		// eject the page and power down motors	
        this.gcode += this.MoveTo (0,450);
        this.gcode += this.MotorOff ();
    }

    GetGcode ()
    {
        return this.gcode;
    }
}

export default GeomToGCode;