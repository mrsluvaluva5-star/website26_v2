var APP = {

	Player: function () {

		var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
		renderer.setPixelRatio( window.devicePixelRatio ); // TODO: Use player.setPixelRatio()

		var loader = new THREE.ObjectLoader();
		var camera, scene;
		var events = {};
		var FBHeadMesh = null;
		var FBHeadRestPosition = null;
		var FBHeadRestRotation = null;
		var headGroup = null;
		var headGroupRestRotation = null;
		var headPoseBaseline = null;
		var headPoseYaw = 0;
		var headPosePitch = 0;
		var headPoseRoll = 0;
		var headRestPitchOffsetDeg = 5;
		var faceLandmarker = null;
		var faceVideo = null;
		var faceDetected = false;
		var eyeLeftObj = null;
		var eyeRightObj = null;
		var eyeLeftRotX = null;
		var eyeLeftRotY = null;
		var eyeRightRotX = null;
		var eyeRightRotY = null;
		var eyeLeftBaseRotX = null;
		var eyeLeftBaseRotY = null;
		var eyeLeftBaseRotZ = null;
		var eyeRightBaseRotX = null;
		var eyeRightBaseRotY = null;
		var eyeRightBaseRotZ = null;
		var eyeBlinkValue = 0;
		var eyeBlinkRightValue = 0;
		var eyeWideLeftValue = 0;
		var eyeWideRightValue = 0;
		var eyeLookUpLeftValue = 0;
		var eyeLookDownLeftValue = 0;
		var eyeLookInLeftValue = 0;
		var eyeLookOutLeftValue = 0;
		var eyeLookUpRightValue = 0;
		var eyeLookDownRightValue = 0;
		var eyeLookInRightValue = 0;
		var eyeLookOutRightValue = 0;
		var eyeWideStrength = 10.0;
		var eyeRotationSmoothing = 0.2;
		var eyeRotationRangeDeg = 36;
		var eyeLeftPitchOffsetDeg = -12;
		var eyeRightPitchOffsetDeg = eyeLeftPitchOffsetDeg;
		var headRotationSmoothing = 0.08;
		var headRotationRangeDeg = 35;
		var headYawScale = 2.5;
		var headPitchScale = 6;
		var headRollScale = 1.0;
		var jawOpenValue = 0;
		var smileLeftValue = 0;
		var smileRightValue = 0;
		var mouthPressLeftValue = 0;
		var mouthPressRightValue = 0;
		var mouthPuckerValue = 0;
		var mouthPuckerRawValue = 0;
		var mouthFunnelRawValue = 0;
		var mouthFunnelValue = 0;
		var mouthRollLowerValue = 0;
		var mouthRollUpperValue = 0;
		var mouthLowerDownLeftValue = 0;
		var mouthLowerDownRightValue = 0;
		var jawLeftValue = 0;
		var jawRightValue = 0;
		var poutRawValue = 0;
		var poutFinalValue = 0;
		var rollRawValue = 0;
		var rollFinalValue = 0;
		var lowerDownRawValue = 0;
		var lowerDownFinalValue = 0;
		var cheekPuffRawValue = 0;
		var cheekPuffFinalValue = 0;
		var cheekPuffLogCounter = 0;
		var cheekPuffProxyValue = 0;
		var cheekPuffBaselineLeft = null;
		var cheekPuffBaselineRight = null;
		var cheekPuffProxyBlend = 0.02;
		var cheekPuffProxyBlendUp = 0.01;
		var cheekPuffProxyScale = 45.0;
		var cheekPuffProxyMinThreshold = 0.12;
		var cheekPuffDeadzone = 0.14;
		var cheekSquintLeftValue = 0;
		var cheekSquintRightValue = 0;
		var cheekSquintStrength = 1.0;
		var eyeSquintLeftValue = 0;
		var eyeSquintRightValue = 0;
		var mouthCloseValue = 0;
		var jawForwardValue = 0;
		var mouthDimpleLeftValue = 0;
		var mouthDimpleRightValue = 0;
		var mouthFrownLeftValue = 0;
		var mouthFrownRightValue = 0;
		var mouthLeftValue = 0;
		var mouthRightValue = 0;
		var mouthShrugLowerValue = 0;
		var mouthShrugUpperValue = 0;
		var noseSneerLeftValue = 0;
		var noseSneerRightValue = 0;
		var mouthStretchLeftValue = 0;
		var mouthStretchRightValue = 0;
		var mouthUpperUpLeftValue = 0;
		var mouthUpperUpRightValue = 0;
		var browInnerUpValue = 0;
		var browOuterUpLeftValue = 0;
		var browOuterUpRightValue = 0;
		var browDownLeftValue = 0;
		var browDownRightValue = 0;
		var faceInitPromise = null;
		var morphStates = {};
		var smoothingFactor = 0.35;
		var mouthSmoothingFactor = 0.6;
		var mouthDeadzone = 0.12;
		var jawDeadzone = 0.03;
		var jawSmoothingOpen = 0.75;
		var jawSmoothingClose = 0.95;
		var puckerSmoothingFactor = 0.35;
		var mouthPuckerRelease = 0.55;
		var puckerClearThreshold = 0.1;
		var puckerActive = false;
		var mouthPuckerActivate = 0.9;
		var jawOpenPuckerBlock = 0.0;
		var puckerInputSmoothing = 0.12;
		var mouthPuckerFiltered = 0;
		var jawLipOffset = 0.15;
		var jawOpenPuckerHardBlock = 0.1;
		var puckerMinHoldMs = 1000;
		var puckerCandidateSince = 0;
		var puckerSmoothingIn = 0.2;
		var puckerSmoothingOut = 0.35;
		var puckerJawSuppression = 0.0;
		var mouthPuckerDeadzone = 0.35;
		var jawOpenStrength = 0.935;
		var jawOpenMorphName = 'jawOpen';
		var jawOpenMorphIndex = null;
		var jawOpenMorphLogged = false;
		var smileStrength = 1.326;
		var smileLeftMorphName = 'mouthSmileLeft';
		var smileRightMorphName = 'mouthSmileRight';
		var smileLeftMorphIndex = null;
		var smileRightMorphIndex = null;
		var smileMorphLogged = false;
		var mouthPressStrength = 1.0;
		var mouthPressLeftMorphName = 'mouthPressLeft';
		var mouthPressRightMorphName = 'mouthPressRight';
		var mouthPressLeftMorphIndex = null;
		var mouthPressRightMorphIndex = null;
		var mouthPressMorphLogged = false;
		var mouthStretchStrength = 1.0;
		var mouthStretchLeftMorphName = 'mouthStretchLeft';
		var mouthStretchRightMorphName = 'mouthStretchRight';
		var mouthStretchLeftMorphIndex = null;
		var mouthStretchRightMorphIndex = null;
		var mouthStretchMorphLogged = false;
		var mouthUpperUpLeftStrength = 1.6;
		var mouthUpperUpRightStrength = 0.7;
		var mouthUpperUpStrength = ( mouthUpperUpLeftStrength + mouthUpperUpRightStrength ) * 0.5;
		var mouthUpperUpLeftMorphName = 'mouthUpperUpLeft';
		var mouthUpperUpRightMorphName = 'mouthUpperUpRight';
		var mouthUpperUpMorphName = 'mouthUpperUp';
		var mouthUpperUpLeftMorphIndex = null;
		var mouthUpperUpRightMorphIndex = null;
		var mouthUpperUpMorphIndex = null;
		var mouthUpperUpMorphLogged = false;
		var browStrength = 0.5;
		var browSmoothingFactor = 0.25;
		var browFrownStrength = 1.5;
		var browInnerUpMorphName = 'browInnerUp';
		var browOuterUpLeftMorphName = 'browOuterUpLeft';
		var browOuterUpRightMorphName = 'browOuterUpRight';
		var browDownLeftMorphName = 'browDownLeft';
		var browDownRightMorphName = 'browDownRight';
		var browInnerUpMorphIndex = null;
		var browOuterUpLeftMorphIndex = null;
		var browOuterUpRightMorphIndex = null;
		var browDownLeftMorphIndex = null;
		var browDownRightMorphIndex = null;
		var browInnerUpMorphIndexOverride = 16;
		var browOuterUpLeftMorphIndexOverride = 17;
		var browOuterUpRightMorphIndexOverride = 18;
		var browDownLeftMorphIndexOverride = 14;
		var browDownRightMorphIndexOverride = 15;
		var browMorphLogged = false;
		var mouthPuckerStrength = 0.7;
		var mouthFunnelStrength = 1.6;
		var mouthFunnelDeadzone = 0.075;
		var lowerDownStrength = 1.5;
		var cheekPuffStrength = 0.7;
		var jawLeftStrength = 5.0;
		var jawRightStrength = 100.0;
		var jawLeftDeadzone = 0.03;
		var jawRightMinValue = 0.05;
		var jawRightMinThreshold = 0.005;
		var mouthPuckerMorphName = 'mouthPucker';
		var mouthFunnelMorphName = 'mouthFunnel';
		var mouthRollLowerMorphName = 'mouthRollLower';
		var mouthRollUpperMorphName = 'mouthRollUpper';
		var mouthLowerDownLeftMorphName = 'mouthLowerDownLeft';
		var mouthLowerDownRightMorphName = 'mouthLowerDownRight';
		var cheekPuffMorphName = null;
		var jawLeftMorphIndex = 21;
		var jawRightMorphIndex = 22;
		var cheekSquintLeftMorphName = 'cheekSquintLeft';
		var cheekSquintRightMorphName = 'cheekSquintRight';
		var eyeWideLeftMorphIndex = 8;
		var eyeWideRightMorphIndex = 9;
		var mouthPuckerMorphIndex = null;
		var mouthFunnelMorphIndex = null;
		var mouthRollLowerMorphIndex = null;
		var mouthRollUpperMorphIndex = null;
		var mouthLowerDownLeftMorphIndex = null;
		var mouthLowerDownRightMorphIndex = null;
		var cheekPuffMorphIndex = null;
		var cheekSquintLeftMorphIndex = 49;
		var cheekSquintRightMorphIndex = 50;
		var mouthPuckerMorphLogged = false;
		var cheekPuffMorphLogged = false;
		var mouthPuckerCurve = 1.3;
		var debugMorphLogged = false;
		var debugPanel = null;
		var debugPanelList = null;
		var debugPanelWeights = null;
		var debugPanelEnabled = false;
		var overlayEnabled = false;
		var isMobileUI = false;
		var debugDrawer = null;
		var debugDrawerToggle = null;
		var debugDrawerOpen = false;
		var debugLoopId = 0;
		var lastBlendshapes = null;
		var lastFaceLandmarks = null;
		var overlayCanvas = null;
		var overlayCtx = null;
		var cheekLeftIndices = [ 50, 101, 118, 119, 205, 206, 207, 187, 192, 213 ];
		var cheekRightIndices = [ 280, 330, 347, 348, 425, 426, 427, 411, 416, 433 ];

		// ── AUDIO ENGINE ──────────────────────────────────────────────────
		var audioCtx = null;
		var audioInitialised = false;
		var audioMasterGain = null;
		var instSensitivity = 3.5;
		var instDeadzone = 0.03;

		// ── Xylophone (yaw / left-right) ─────────────────────────────────
		var xyloNotes = [
			523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50
		]; // C5 D5 E5 F5 G5 A5 B5 C6
		var xyloNoteLabels = [ 'C5','D5','E5','F5','G5','A5','B5','C6' ];
		var xyloActiveIndex = -1;
		var xyloPrevIndex = -1;
		var xyloFadeTime = 0.015;
		var xyloMaxVol = 0.22;

		// ── Piano (pitch / nod up-down) ───────────────────────────────────
		var pianoNotes = [
			130.81, 146.83, 164.81, 174.61, 196.00, 220.00, 246.94, 261.63
		]; // C3 D3 E3 F3 G3 A3 B3 C4
		var pianoNoteLabels = [ 'C3','D3','E3','F3','G3','A3','B3','C4' ];
		var pianoActiveIndex = -1;
		var pianoPrevIndex = -1;
		var pianoFadeTime = 0.02;
		var pianoMaxVol = 0.20;

		// ── Pan pipes (roll / head tilt) ──────────────────────────────────
		var panPipeOscillators = [];
		var panPipeGains = [];
		var panPipeNoiseNodes = [];
		var panPipeNoiseGains = [];
		var panPipeFilterNodes = [];
		var panPipeNotes = [
			87.31, 98.00, 110.00, 130.81, 146.83,  // F2 G2 A2 C3 D3
			174.61, 196.00, 220.00                  // F3 G3 A3
		];
		var panPipeNoteLabels = [ 'F2','G2','A2','C3','D3','F3','G3','A3' ];
		var panPipeActiveIndex = -1;
		var panPipeFadeTime = 0.08;
		var panPipeMaxVolume = 0.45;
		var panPipeBreathVolume = 0.15;
		var panPipeHoldStart = 0;
		var panPipeHoldMaxMs = 3000;

		// Blink audio state
		var blinkWasActive = false;
		var blinkRightWasActive = false;
		var blinkThreshold = 0.55;
		var blinkCooldown = 0;
		var blinkCooldownMs = 180;

		// Smile audio state (80s sax)
		var saxOsc1 = null;
		var saxOsc2 = null;
		var saxOsc3 = null;
		var saxVibLFO = null;
		var saxVibGain = null;
		var saxFilter1 = null;
		var saxFilter2 = null;
		var smileGain = null;
		var smileActive = false;
		var smileThreshold = 0.3;
		var smileMaxVol = 0.18;

		// Frown audio state
		var frownOsc = null;
		var frownGain = null;
		var frownActive = false;
		var frownThreshold = 0.35;
		var frownMaxVol = 0.5;

		// Hurdy gurdy audio state (eyebrows raised)
		var hurdyOsc = null;
		var hurdyOsc2 = null;
		var hurdyGain = null;
		var hurdyActive = false;
		var hurdyThreshold = 0.25;
		var hurdyMaxVol = 0.85;

		// Acoustic guitar audio state (wide eyes)
		var guitarOscs = [];
		var guitarGain = null;
		var guitarActive = false;
		var guitarThreshold = 0.25;
		var guitarMaxVol = 0.5;

		// Banjo audio state (cheek puff)
		var banjoOscs = [];
		var banjoGain = null;
		var banjoActive = false;
		var banjoThreshold = 0.2;
		var banjoMaxVol = 0.5;

		// Concertina audio state (mouth pucker)
		var concertinaOscs = [];
		var concertinaMasterGain = null;
		var concertinaActive = false;
		var concertinaThreshold = 0.75;
		var concertinaMaxVol = 0.5;

		// Glockenspiel audio state (nose sneer)
		var glockOscs = [];
		var glockGain = null;
		var glockActive = false;
		var glockThreshold = 0.15;
		var glockMaxVol = 0.5;

		// Choir audio state (jaw open)
		var choirOscs = [];
		var choirGains = [];
		var choirMasterGain = null;
		var choirFilterNode = null;
		var choirActive = false;
		var choirThreshold = 0.12;
		var choirMaxVol = 0.45;

		// ── INSTRUMENT VIZ STATE ─────────────────────────────────────────
		var vizContainer = null;
		var vizXyloEls = [];
		var vizPianoEls = [];
		var vizPipeEls = [];
		var vizBlinkEl = null;
		var vizSmileEl = null;
		var vizFrownEl = null;
		var vizChoirEl = null;
		var vizHurdyEl = null;
		var vizGuitarEl = null;
		var vizBanjoEl = null;
		var vizConcertinaEl = null;
		var vizGlockEl = null;
		var vizBlinkFlash = 0;
		var vizLastFrameTime = 0;

		// ── Drop shadow behind head ───────────────────────────────────────
		var headShadowMesh = null;

		// ── Preview animation (plays before camera is enabled) ──────────
		var previewActive = true;
		var previewTime = 0;

		// ── Background animation state ────────────────────────────────────
		var bgCanvas = null;
		var bgCtx = null;
		var bgParticles = [];
		var bgMaxParticles = 400;
		// Hyper-saturated neon palette — acid green, hot magenta, electric blue,
		// cyan, warm yellow, orange, fuchsia. Pink/lavender as quiet tones.
		var bgPalette = [
			[ 0, 255, 40 ],    // acid green
			[ 255, 0, 160 ],   // hot magenta
			[ 0, 80, 255 ],    // electric blue
			[ 0, 240, 255 ],   // cyan
			[ 255, 220, 0 ],   // warm yellow
			[ 255, 130, 0 ],   // orange
			[ 255, 0, 255 ],   // fuchsia
			[ 130, 255, 0 ],   // lime
			[ 255, 60, 200 ],  // hot pink
			[ 0, 200, 100 ],   // emerald
			[ 255, 100, 50 ],  // coral orange
			[ 80, 0, 255 ],    // violet
			[ 0, 255, 180 ],   // aqua green
			[ 255, 180, 220 ], // pink
			[ 200, 170, 255 ], // lavender
			[ 255, 255, 100 ]  // pale yellow
		];
		// Deep magenta/purple sub-palette for frown
		var bgFrownPalette = [
			[ 180, 0, 140 ], [ 140, 0, 200 ], [ 100, 0, 180 ],
			[ 200, 0, 180 ], [ 160, 0, 255 ], [ 120, 0, 160 ],
			[ 220, 0, 200 ], [ 80, 0, 140 ],  [ 180, 40, 220 ]
		];
		// Base background colours (rotating hot fills)
		var bgBaseFills = [
			[ 255, 140, 200 ], // pink
			[ 200, 170, 255 ], // lavender
			[ 255, 200, 240 ], // light pink
			[ 180, 220, 255 ], // light blue
			[ 200, 255, 200 ], // light green
			[ 255, 230, 160 ]  // light yellow
		];
		var bgBaseFillIdx = 0;
		var bgBaseFillTimer = 0;

		function randPal() {
			return bgPalette[ Math.floor( Math.random() * bgPalette.length ) ];
		}
		function randFrownPal() {
			return bgFrownPalette[ Math.floor( Math.random() * bgFrownPalette.length ) ];
		}

		function initBgAnim() {

			if ( bgCanvas ) return; // already initialised
			bgCanvas = document.createElement( 'canvas' );
			bgCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
			dom.insertBefore( bgCanvas, renderer.domElement );
			bgCtx = bgCanvas.getContext( '2d' );
			resizeBgCanvas();
			window.addEventListener( 'resize', resizeBgCanvas );

		}

		function resizeBgCanvas() {

			if ( ! bgCanvas ) return;
			bgCanvas.width = dom.clientWidth || window.innerWidth;
			bgCanvas.height = dom.clientHeight || window.innerHeight;

		}

		function spawnBgParticle( type, intensity ) {

			if ( bgParticles.length >= bgMaxParticles ) return;
			var w = bgCanvas ? bgCanvas.width : 800;
			var h = bgCanvas ? bgCanvas.height : 600;
			var p;

			switch ( type ) {

				case 'xylophone': { // WIDE horizontal rainbow stripe band (VHS test card)
					var rows = [];
					var n = 6 + Math.floor( intensity * 10 );
					var baseY = Math.random() * h;
					for ( var ri = 0; ri < n; ri ++ ) {
						var rh = 8 + Math.random() * 18;
						rows.push( {
							oy: ri * rh,
							w: w * ( 0.3 + Math.random() * 0.7 ),
							h: rh,
							xOff: ( Math.random() - 0.5 ) * 80,
							color: randPal()
						} );
					}
					p = {
						type: 'hstripes',
						x: Math.random() * w * 0.4,
						y: baseY - ( n * 12 ) * 0.5,
						rows: rows,
						alpha: 1, life: 1, decay: 0.5
					};
					break;
				}

				case 'piano': { // TALL vertical colour bars (test card columns)
					var cols = [];
					var nc = 5 + Math.floor( intensity * 8 );
					var baseX = Math.random() * w;
					for ( var ci = 0; ci < nc; ci ++ ) {
						var cw = 10 + Math.random() * 25;
						cols.push( {
							ox: ci * cw,
							w: cw,
							h: h * ( 0.25 + Math.random() * 0.6 ),
							yOff: ( Math.random() - 0.5 ) * 60,
							color: randPal()
						} );
					}
					p = {
						type: 'vstripes',
						x: baseX - ( nc * 15 ) * 0.5,
						y: Math.random() * h * 0.3,
						cols: cols,
						alpha: 1, life: 1, decay: 0.45
					};
					break;
				}

				case 'panPipes': { // flowing horizontal rainbow gradient band
					var bandH = 30 + intensity * 60;
					var nSegs = 10 + Math.floor( intensity * 15 );
					var segs = [];
					var segW = w / nSegs;
					for ( var si = 0; si < nSegs; si ++ ) {
						segs.push( {
							x: si * segW,
							w: segW + 1,
							color: randPal()
						} );
					}
					p = {
						type: 'rainbowband',
						y: Math.random() * h,
						h: bandH,
						segs: segs,
						phase: Math.random() * Math.PI * 2,
						phaseSpeed: 1.5 + Math.random() * 2,
						alpha: 1, life: 1, decay: 0.25
					};
					break;
				}

				case 'smile': { // thick undulating horizontal stripe bands — like test-card colour bars
					var bandCount = 5 + Math.floor( intensity * 4 );
					var bandH = 18 + intensity * 30;
					var totalH = bandCount * bandH;
					var baseY = Math.random() * ( h - totalH * 0.5 );
					var bands = [];
					for ( var sbi = 0; sbi < bandCount; sbi ++ ) {
						bands.push( {
							oy: sbi * bandH,
							h: bandH,
							color: randPal(),
							phaseOff: sbi * 0.6
						} );
					}
					p = {
						type: 'smilestripes',
						y: baseY,
						bands: bands,
						phase: Math.random() * Math.PI * 2,
						phaseSpeed: 2.0 + Math.random() * 2.5,
						waveAmp: 12 + intensity * 25,
						alpha: 1, life: 1, decay: 0.22
					};
					break;
				}

				case 'frown': { // dense deep magenta/purple glitch block cascade
					var rects = [];
					var nr = 10 + Math.floor( intensity * 20 );
					var fx = Math.random() * w;
					var fy = Math.random() * h;
					for ( var fri = 0; fri < nr; fri ++ ) {
						rects.push( {
							ox: ( Math.random() - 0.5 ) * 350,
							oy: ( Math.random() - 0.5 ) * 300,
							w: 15 + Math.random() * 80,
							h: 8 + Math.random() * 35,
							color: Math.random() < 0.7 ? randFrownPal() : randPal()
						} );
					}
					p = {
						type: 'glitchcascade',
						x: fx, y: fy,
						rects: rects,
						alpha: 1, life: 1, decay: 0.4
					};
					break;
				}

				case 'blink': { // MASSIVE glitch block flash — big rects flicker across entire screen
					var blocks = [];
					var nb = 15 + Math.floor( Math.random() * 20 );
					for ( var bi = 0; bi < nb; bi ++ ) {
						var isWide = Math.random() < 0.6;
						blocks.push( {
							x: Math.random() * w,
							y: Math.random() * h,
							w: isWide ? ( 80 + Math.random() * ( w * 0.5 ) ) : ( 15 + Math.random() * 60 ),
							h: isWide ? ( 10 + Math.random() * 30 ) : ( 30 + Math.random() * 120 ),
							color: randPal()
						} );
					}
					p = {
						type: 'glitchflash',
						blocks: blocks,
						alpha: 1, life: 1, decay: 2.0
					};
					break;
				}

				case 'choir': { // wide stacked colour bar wall
					var bars = [];
					var nba = 10 + Math.floor( intensity * 14 );
					var cx = Math.random() * w;
					var cy = Math.random() * h;
					for ( var cbi = 0; cbi < nba; cbi ++ ) {
						var bw = 60 + Math.random() * 200;
						var bh = 8 + Math.random() * 20;
						bars.push( {
							w: bw, h: bh,
							oxOff: ( Math.random() - 0.5 ) * 60,
							color: randPal()
						} );
					}
					p = {
						type: 'colwall',
						x: cx, y: cy,
						bars: bars,
						alpha: 1, life: 1, decay: 0.3
					};
					break;
				}

				default: return;

			}

			bgParticles.push( p );

		}

		function updateBgAnim( dt ) {

			if ( ! bgCtx || ! bgCanvas ) return;
			var w = bgCanvas.width;
			var h = bgCanvas.height;
			if ( w === 0 || h === 0 ) return;

			// Fill with a hot base colour — no black backgrounds
			bgBaseFillTimer += dt;
			if ( bgBaseFillTimer > 8 ) { bgBaseFillTimer = 0; bgBaseFillIdx = ( bgBaseFillIdx + 1 ) % bgBaseFills.length; }
			var bf = bgBaseFills[ bgBaseFillIdx ];
			var bf2 = bgBaseFills[ ( bgBaseFillIdx + 1 ) % bgBaseFills.length ];
			var bft = bgBaseFillTimer / 8;
			var bgR = Math.round( bf[ 0 ] + ( bf2[ 0 ] - bf[ 0 ] ) * bft );
			var bgG = Math.round( bf[ 1 ] + ( bf2[ 1 ] - bf[ 1 ] ) * bft );
			var bgB = Math.round( bf[ 2 ] + ( bf2[ 2 ] - bf[ 2 ] ) * bft );
			bgCtx.fillStyle = 'rgb(' + bgR + ',' + bgG + ',' + bgB + ')';
			bgCtx.fillRect( 0, 0, w, h );

			for ( var i = bgParticles.length - 1; i >= 0; i -- ) {

				var p = bgParticles[ i ];
				p.life -= p.decay * dt;
				if ( p.life <= 0 ) { bgParticles.splice( i, 1 ); continue; }

				// Build/de-build: elements snap on one-by-one then off one-by-one. No alpha fade.
				var pos = 1 - p.life; // 0 at spawn, 1 at death
				var buildEnd = 0.30;
				var deStart  = 0.38;
				var buildProgress = clamp( pos / buildEnd, 0, 1 );
				var deProgress    = clamp( ( pos - deStart ) / ( 1 - deStart ), 0, 1 );
				var showT = Math.min( buildProgress, 1 - deProgress );

				bgCtx.save();
				bgCtx.globalAlpha = 1;

				switch ( p.type ) {

					case 'hstripes': {
						var hsCount = Math.ceil( showT * p.rows.length );
						for ( var hi = 0; hi < hsCount; hi ++ ) {
							var r = p.rows[ hi ];
							var rc = r.color;
							bgCtx.fillStyle = 'rgb(' + rc[ 0 ] + ',' + rc[ 1 ] + ',' + rc[ 2 ] + ')';
							bgCtx.fillRect( p.x + r.xOff, p.y + r.oy, r.w, r.h );
						}
						break;
					}

					case 'vstripes': {
						var vsCount = Math.ceil( showT * p.cols.length );
						for ( var vi = 0; vi < vsCount; vi ++ ) {
							var col = p.cols[ vi ];
							var vc = col.color;
							bgCtx.fillStyle = 'rgb(' + vc[ 0 ] + ',' + vc[ 1 ] + ',' + vc[ 2 ] + ')';
							bgCtx.fillRect( p.x + col.ox, p.y + col.yOff, col.w, col.h );
						}
						break;
					}

					case 'rainbowband': {
						p.phase += p.phaseSpeed * dt;
						var yOsc = Math.sin( p.phase ) * 15;
						var rbCount = Math.ceil( showT * p.segs.length );
						for ( var rbi = 0; rbi < rbCount; rbi ++ ) {
							var seg = p.segs[ rbi ];
							var segC = seg.color;
							bgCtx.fillStyle = 'rgb(' + segC[ 0 ] + ',' + segC[ 1 ] + ',' + segC[ 2 ] + ')';
							var segY = p.y + yOsc + Math.sin( p.phase + rbi * 0.3 ) * 8;
							bgCtx.fillRect( seg.x, segY, seg.w, p.h );
						}
						break;
					}

					case 'smilestripes': {
						var ssCount = Math.ceil( showT * p.bands.length );
						for ( var ssi = 0; ssi < ssCount; ssi ++ ) {
							var band = p.bands[ ssi ];
							var bc = band.color;
							var bandY = p.y + band.oy;
							var grad = bgCtx.createLinearGradient( 0, 0, w, 0 );
							grad.addColorStop( 0,    'rgba(' + bc[0] + ',' + bc[1] + ',' + bc[2] + ',0)' );
							grad.addColorStop( 0.15, 'rgba(' + bc[0] + ',' + bc[1] + ',' + bc[2] + ',1)' );
							grad.addColorStop( 0.85, 'rgba(' + bc[0] + ',' + bc[1] + ',' + bc[2] + ',1)' );
							grad.addColorStop( 1,    'rgba(' + bc[0] + ',' + bc[1] + ',' + bc[2] + ',0)' );
							bgCtx.fillStyle = grad;
							bgCtx.fillRect( 0, bandY, w, band.h );
						}
						break;
					}

					case 'glitchcascade': {
						var gcCount = Math.ceil( showT * p.rects.length );
						for ( var gci = 0; gci < gcCount; gci ++ ) {
							var gr = p.rects[ gci ];
							var grc = gr.color;
							bgCtx.fillStyle = 'rgb(' + grc[ 0 ] + ',' + grc[ 1 ] + ',' + grc[ 2 ] + ')';
							bgCtx.fillRect( p.x + gr.ox, p.y + gr.oy, gr.w, gr.h );
						}
						if ( gcCount > 0 ) {
							bgCtx.fillStyle = 'rgba(0,0,0,0.12)';
							for ( var scli = 0; scli < 40; scli ++ ) {
								bgCtx.fillRect( p.x - 180, p.y - 160 + scli * 8, 400, 2 );
							}
						}
						break;
					}

					case 'glitchflash': {
						var gfCount = Math.ceil( showT * p.blocks.length );
						for ( var gfi = 0; gfi < gfCount; gfi ++ ) {
							var blk = p.blocks[ gfi ];
							var blkc = blk.color;
							bgCtx.fillStyle = 'rgb(' + blkc[ 0 ] + ',' + blkc[ 1 ] + ',' + blkc[ 2 ] + ')';
							bgCtx.fillRect( blk.x, blk.y, blk.w, blk.h );
						}
						if ( gfCount > 0 ) {
							bgCtx.fillStyle = 'rgba(0,0,0,0.1)';
							for ( var sfi = 0; sfi < h; sfi += 6 ) {
								bgCtx.fillRect( 0, sfi, w, 2 );
							}
						}
						break;
					}

					case 'colwall': {
						var cwCount = Math.ceil( showT * p.bars.length );
						var stackY = p.y;
						for ( var cwi = 0; cwi < cwCount; cwi ++ ) {
							var bar = p.bars[ cwi ];
							var brc = bar.color;
							bgCtx.fillStyle = 'rgb(' + brc[ 0 ] + ',' + brc[ 1 ] + ',' + brc[ 2 ] + ')';
							bgCtx.fillRect( p.x + bar.oxOff - bar.w * 0.5, stackY, bar.w, bar.h );
							stackY += bar.h;
						}
						break;
					}

				}

				bgCtx.restore();

			}

		}


		function initAudio() {

			if ( audioInitialised ) return;
			audioInitialised = true;

			try {
				// Use a pre-created AudioContext if the tap-to-begin overlay made one
				// inside a user gesture — this keeps mobile audio unlocked.
				audioCtx = window.__preCreatedAudioCtx || new ( window.AudioContext || window.webkitAudioContext )();
				window.__preCreatedAudioCtx = null;
			} catch ( e ) {
				console.warn( 'Web Audio not available', e );
				return;
			}

			audioMasterGain = audioCtx.createGain();
			audioMasterGain.gain.value = 1.0;
			audioMasterGain.connect( audioCtx.destination );

			// ── Pan pipe oscillators (roll) — one continuous oscillator+noise per note
			for ( var i = 0; i < panPipeNotes.length; i ++ ) {

				var osc = audioCtx.createOscillator();
				osc.type = 'sine';
				osc.frequency.value = panPipeNotes[ i ];

				var gain = audioCtx.createGain();
				gain.gain.value = 0;

				var filter = audioCtx.createBiquadFilter();
				filter.type = 'bandpass';
				filter.frequency.value = panPipeNotes[ i ];
				filter.Q.value = 2.5;

				osc.connect( filter );
				filter.connect( gain );
				gain.connect( audioMasterGain );
				osc.start();

				panPipeOscillators.push( osc );
				panPipeGains.push( gain );
				panPipeFilterNodes.push( filter );

				// Breath noise
				var bufferSize = audioCtx.sampleRate * 2;
				var noiseBuffer = audioCtx.createBuffer( 1, bufferSize, audioCtx.sampleRate );
				var output = noiseBuffer.getChannelData( 0 );
				for ( var s = 0; s < bufferSize; s ++ ) {
					output[ s ] = ( Math.random() * 2 - 1 ) * 0.5;
				}
				var noiseSource = audioCtx.createBufferSource();
				noiseSource.buffer = noiseBuffer;
				noiseSource.loop = true;

				var noiseFilter = audioCtx.createBiquadFilter();
				noiseFilter.type = 'bandpass';
				noiseFilter.frequency.value = panPipeNotes[ i ] * 1.5;
				noiseFilter.Q.value = 1.2;

				var noiseGain = audioCtx.createGain();
				noiseGain.gain.value = 0;

				noiseSource.connect( noiseFilter );
				noiseFilter.connect( noiseGain );
				noiseGain.connect( audioMasterGain );
				noiseSource.start();

				panPipeNoiseNodes.push( noiseSource );
				panPipeNoiseGains.push( noiseGain );

			}

			// Xylophone & Piano are one-shot — created on demand in trigger functions.

			// Smile — sexy 80s saxophone riff
			saxOsc1 = audioCtx.createOscillator();
			saxOsc1.type = 'sawtooth';
			saxOsc1.frequency.value = 349.23; // F4

			saxOsc2 = audioCtx.createOscillator();
			saxOsc2.type = 'sawtooth';
			saxOsc2.frequency.value = 351.0; // slightly detuned

			saxOsc3 = audioCtx.createOscillator();
			saxOsc3.type = 'square';
			saxOsc3.frequency.value = 698.46; // F5 octave — reed bite

			var saxOsc3Pre = audioCtx.createGain();
			saxOsc3Pre.gain.value = 0.15; // mix in subtle square
			saxOsc3.connect( saxOsc3Pre );

			saxVibLFO = audioCtx.createOscillator();
			saxVibLFO.type = 'sine';
			saxVibLFO.frequency.value = 5.5;
			saxVibGain = audioCtx.createGain();
			saxVibGain.gain.value = 3; // vibrato depth Hz
			saxVibLFO.connect( saxVibGain );
			saxVibGain.connect( saxOsc1.frequency );
			saxVibGain.connect( saxOsc2.frequency );

			saxFilter1 = audioCtx.createBiquadFilter();
			saxFilter1.type = 'bandpass';
			saxFilter1.frequency.value = 1200;
			saxFilter1.Q.value = 1.8;

			saxFilter2 = audioCtx.createBiquadFilter();
			saxFilter2.type = 'peaking';
			saxFilter2.frequency.value = 2800;
			saxFilter2.gain.value = 6;
			saxFilter2.Q.value = 1.5;

			smileGain = audioCtx.createGain();
			smileGain.gain.value = 0;

			saxOsc1.connect( saxFilter1 );
			saxOsc2.connect( saxFilter1 );
			saxOsc3Pre.connect( saxFilter1 );
			saxFilter1.connect( saxFilter2 );
			saxFilter2.connect( smileGain );
			smileGain.connect( audioMasterGain );
			saxOsc1.start();
			saxOsc2.start();
			saxOsc3.start();
			saxVibLFO.start();

			// Frown — low-range swanee whistle, single clean sine, slides down as frown deepens
			frownOsc = audioCtx.createOscillator();
			frownOsc.type = 'sine';
			frownOsc.frequency.value = 150;

			frownGain = audioCtx.createGain();
			frownGain.gain.value = 0;

			frownOsc.connect( frownGain );
			frownGain.connect( audioMasterGain );
			frownOsc.start();

			// Swanee whistle — pure sine that slides pitch with eyebrow intensity
			// Low brow = low note, raised brow = pitch glides upward
			hurdyOsc = audioCtx.createOscillator();
			hurdyOsc.type = 'sine';
			hurdyOsc.frequency.value = 300; // starting pitch (will be modulated in update)

			// Slight breathiness via a second sine a few cents sharp
			hurdyOsc2 = audioCtx.createOscillator();
			hurdyOsc2.type = 'sine';
			hurdyOsc2.frequency.value = 300;
			hurdyOsc2.detune.value = 8;

			var swaneeOsc2Gain = audioCtx.createGain();
			swaneeOsc2Gain.gain.value = 0.25;

			hurdyGain = audioCtx.createGain();
			hurdyGain.gain.value = 0;

			hurdyOsc.connect( hurdyGain );
			hurdyOsc2.connect( swaneeOsc2Gain );
			swaneeOsc2Gain.connect( hurdyGain );
			hurdyGain.connect( audioMasterGain );
			hurdyOsc.start();
			hurdyOsc2.start();

			// Choir — angelic pad triggered by jaw open
			// Layer multiple detuned oscillators with vibrato for ethereal choir effect
			var choirFreqs = [ 261.63, 329.63, 392.00, 523.25 ]; // C4 E4 G4 C5 (C major)
			var choirDetunes = [ -6, 4, -3, 7 ];

			choirMasterGain = audioCtx.createGain();
			choirMasterGain.gain.value = 0;

			choirFilterNode = audioCtx.createBiquadFilter();
			choirFilterNode.type = 'lowpass';
			choirFilterNode.frequency.value = 2400;
			choirFilterNode.Q.value = 0.8;
			choirFilterNode.connect( choirMasterGain );
			choirMasterGain.connect( audioMasterGain );

			for ( var ci = 0; ci < choirFreqs.length; ci ++ ) {
				// Main voice oscillator
				var voice = audioCtx.createOscillator();
				voice.type = 'sine';
				voice.frequency.value = choirFreqs[ ci ];
				voice.detune.value = choirDetunes[ ci ];

				// Vibrato LFO for natural wavering
				var vibrato = audioCtx.createOscillator();
				vibrato.type = 'sine';
				vibrato.frequency.value = 4.5 + ci * 0.4; // slightly different rates
				var vibratoGain = audioCtx.createGain();
				vibratoGain.gain.value = 3; // cents of wobble
				vibrato.connect( vibratoGain );
				vibratoGain.connect( voice.detune );
				vibrato.start();

				var vGain = audioCtx.createGain();
				vGain.gain.value = 0.45;
				voice.connect( vGain );
				vGain.connect( choirFilterNode );
				voice.start();

				choirOscs.push( voice );
				choirGains.push( vGain );
			}

			// Acoustic guitar — warm shimmer on wide eyes
			// G major chord: G2 B2 D3 G3 B3, triangle waves through a body-resonance filter
			var guitarFreqs = [ 98.00, 123.47, 146.83, 196.00, 246.94 ];
			var guitarDetunes = [ 0, -5, 3, -3, 5 ];
			guitarGain = audioCtx.createGain();
			guitarGain.gain.value = 0;
			var guitarFilter = audioCtx.createBiquadFilter();
			guitarFilter.type = 'bandpass';
			guitarFilter.frequency.value = 220;
			guitarFilter.Q.value = 0.6;
			guitarFilter.connect( guitarGain );
			guitarGain.connect( audioMasterGain );
			for ( var gi = 0; gi < guitarFreqs.length; gi ++ ) {
				var go = audioCtx.createOscillator();
				go.type = 'triangle';
				go.frequency.value = guitarFreqs[ gi ];
				go.detune.value = guitarDetunes[ gi ];
				var gg = audioCtx.createGain();
				gg.gain.value = 0.3 + ( gi === 0 || gi === 3 ? 0.2 : 0 ); // root notes louder
				go.connect( gg );
				gg.connect( guitarFilter );
				go.start();
				guitarOscs.push( go );
			}

			// Banjo — bright twang on cheek puff (note: cheekPuffFinalValue currently disabled in detection)
			// Open G banjo tuning: D3 B2 G3 D4 G4, sawtooth through highpass for brightness
			var banjoFreqs = [ 146.83, 123.47, 196.00, 293.66, 392.00 ];
			var banjoDetunes = [ 0, 4, -4, 0, 3 ];
			banjoGain = audioCtx.createGain();
			banjoGain.gain.value = 0;
			var banjoFilter = audioCtx.createBiquadFilter();
			banjoFilter.type = 'highpass';
			banjoFilter.frequency.value = 200;
			banjoFilter.Q.value = 0.5;
			var banjoShelf = audioCtx.createBiquadFilter();
			banjoShelf.type = 'highshelf';
			banjoShelf.frequency.value = 1200;
			banjoShelf.gain.value = 6;
			banjoFilter.connect( banjoShelf );
			banjoShelf.connect( banjoGain );
			banjoGain.connect( audioMasterGain );
			for ( var bi = 0; bi < banjoFreqs.length; bi ++ ) {
				var bo = audioCtx.createOscillator();
				bo.type = 'sawtooth';
				bo.frequency.value = banjoFreqs[ bi ];
				bo.detune.value = banjoDetunes[ bi ];
				var bg = audioCtx.createGain();
				bg.gain.value = 0.22;
				bo.connect( bg );
				bg.connect( banjoFilter );
				bo.start();
				banjoOscs.push( bo );
			}

			// Shimmer — crystalline sine pad on mouth pucker
			// A major voicing: A4 C#5 E5 A5 E6, pure sines with chorus detune + slow tremolo LFO
			var shimmerFreqs = [ 440.00, 554.37, 659.25, 880.00, 1318.51 ];
			var shimmerDetunes = [ -9, 7, -5, 11, -6 ];
			concertinaMasterGain = audioCtx.createGain();
			concertinaMasterGain.gain.value = 0;
			concertinaMasterGain.connect( audioMasterGain );
			var shimmerHigh = audioCtx.createBiquadFilter();
			shimmerHigh.type = 'highpass';
			shimmerHigh.frequency.value = 380;
			shimmerHigh.Q.value = 0.5;
			var shimmerTremolo = audioCtx.createGain();
			shimmerTremolo.gain.value = 0.88;
			var shimmerLFO = audioCtx.createOscillator();
			shimmerLFO.type = 'sine';
			shimmerLFO.frequency.value = 3.8;
			var shimmerLFOGain = audioCtx.createGain();
			shimmerLFOGain.gain.value = 0.12;
			shimmerLFO.connect( shimmerLFOGain );
			shimmerLFOGain.connect( shimmerTremolo.gain );
			shimmerHigh.connect( shimmerTremolo );
			shimmerTremolo.connect( concertinaMasterGain );
			shimmerLFO.start();
			for ( var coni = 0; coni < shimmerFreqs.length; coni ++ ) {
				var coo = audioCtx.createOscillator();
				coo.type = 'sine';
				coo.frequency.value = shimmerFreqs[ coni ];
				coo.detune.value = shimmerDetunes[ coni ];
				var cog = audioCtx.createGain();
				cog.gain.value = 0.22;
				coo.connect( cog );
				cog.connect( shimmerHigh );
				coo.start();
				concertinaOscs.push( coo );
			}

			// Glockenspiel — bright bell tones on nose sneer
			// C major upper register: C5 E5 G5 C6, pure sines for bell clarity
			var glockFreqs = [ 523.25, 659.25, 784.00, 1046.50 ];
			var glockDetunes = [ 0, 3, -3, 0 ];
			glockGain = audioCtx.createGain();
			glockGain.gain.value = 0;
			var glockFilter = audioCtx.createBiquadFilter();
			glockFilter.type = 'highpass';
			glockFilter.frequency.value = 400;
			glockFilter.Q.value = 0.5;
			glockFilter.connect( glockGain );
			glockGain.connect( audioMasterGain );
			for ( var gli = 0; gli < glockFreqs.length; gli ++ ) {
				var glo = audioCtx.createOscillator();
				glo.type = 'sine';
				glo.frequency.value = glockFreqs[ gli ];
				glo.detune.value = glockDetunes[ gli ];
				var glg = audioCtx.createGain();
				glg.gain.value = gli === 0 ? 0.4 : 0.25;
				glo.connect( glg );
				glg.connect( glockFilter );
				glo.start();
				glockOscs.push( glo );
			}

			initViz();

		}

		function ensureAudioResumed() {

			if ( audioCtx && audioCtx.state === 'suspended' ) {
				audioCtx.resume();
			}

		}

		function updatePanPipes( roll, deltaMs ) {

			if ( ! audioCtx || ! panPipeGains.length ) return;

			var rangeRad = headRotationRangeDeg * Math.PI / 180;
			var normRoll = clamp( ( roll / rangeRad ) * instSensitivity, -1, 1 );
			var absRoll  = Math.abs( normRoll );
			var rawNormRoll = Math.abs( clamp( roll / rangeRad, -1, 1 ) );
			var isBlowing = rawNormRoll > instDeadzone;

			// 3-second hold timeout — silence pipe if held continuously
			if ( isBlowing ) {
				if ( panPipeHoldStart === 0 ) panPipeHoldStart = performance.now();
				if ( performance.now() - panPipeHoldStart > panPipeHoldMaxMs ) {
					isBlowing = false;
				}
			} else {
				panPipeHoldStart = 0;
			}

			var pipePos    = ( normRoll + 1 ) * 0.5;
			var targetIdx  = Math.round( pipePos * ( panPipeNotes.length - 1 ) );
			targetIdx = clamp( targetIdx, 0, panPipeNotes.length - 1 );

			// Reset hold timer when switching to a different pipe
			if ( isBlowing && targetIdx !== panPipeActiveIndex && panPipeActiveIndex !== -1 ) {
				panPipeHoldStart = performance.now();
			}

			var breath   = isBlowing ? clamp( rawNormRoll * 2.5, 0.15, 1.0 ) : 0;
			var toneVol  = breath * panPipeMaxVolume;
			var noiseVol = breath * panPipeBreathVolume;
			var now = audioCtx.currentTime;

			for ( var i = 0; i < panPipeGains.length; i ++ ) {
				if ( i === targetIdx && isBlowing ) {
					panPipeGains[ i ].gain.cancelScheduledValues( now );
					panPipeGains[ i ].gain.setTargetAtTime( toneVol, now, panPipeFadeTime );
					panPipeNoiseGains[ i ].gain.cancelScheduledValues( now );
					panPipeNoiseGains[ i ].gain.setTargetAtTime( noiseVol, now, panPipeFadeTime );
				} else {
					panPipeGains[ i ].gain.cancelScheduledValues( now );
					panPipeGains[ i ].gain.setTargetAtTime( 0, now, panPipeFadeTime * 1.5 );
					panPipeNoiseGains[ i ].gain.cancelScheduledValues( now );
					panPipeNoiseGains[ i ].gain.setTargetAtTime( 0, now, panPipeFadeTime * 1.5 );
				}
			}

			panPipeActiveIndex = isBlowing ? targetIdx : -1;

		}

		// ── Xylophone (yaw) — bright percussive one-shot per note change ─
		function triggerXyloNote( noteIndex, velocity ) {

			if ( ! audioCtx ) return;
			var freq = xyloNotes[ noteIndex ];
			var now  = audioCtx.currentTime;
			var vol  = clamp( velocity, 0.15, 1.0 ) * xyloMaxVol;

			// Fundamental — sine
			var osc1 = audioCtx.createOscillator();
			osc1.type = 'sine';
			osc1.frequency.value = freq;

			// 3rd partial — gives metallic shimmer
			var osc2 = audioCtx.createOscillator();
			osc2.type = 'sine';
			osc2.frequency.value = freq * 3.0;

			var g1 = audioCtx.createGain();
			g1.gain.setValueAtTime( vol, now );
			g1.gain.exponentialRampToValueAtTime( 0.001, now + 0.6 );

			var g2 = audioCtx.createGain();
			g2.gain.setValueAtTime( vol * 0.25, now );
			g2.gain.exponentialRampToValueAtTime( 0.001, now + 0.25 );

			var hp = audioCtx.createBiquadFilter();
			hp.type = 'highpass';
			hp.frequency.value = 400;

			osc1.connect( g1 );
			osc2.connect( g2 );
			g1.connect( hp );
			g2.connect( hp );
			hp.connect( audioMasterGain );
			osc1.start( now );
			osc1.stop( now + 0.65 );
			osc2.start( now );
			osc2.stop( now + 0.3 );

		}

		function updateXylophone( yaw ) {

			var rangeRad = headRotationRangeDeg * Math.PI / 180;
			var norm = clamp( ( yaw / rangeRad ) * instSensitivity, -1, 1 );
			var rawAbs = Math.abs( clamp( yaw / rangeRad, -1, 1 ) );
			var isPlaying = rawAbs > instDeadzone;

			var pos = ( norm + 1 ) * 0.5;
			var idx = Math.round( pos * ( xyloNotes.length - 1 ) );
			idx = clamp( idx, 0, xyloNotes.length - 1 );

			if ( isPlaying && idx !== xyloPrevIndex ) {
				triggerXyloNote( idx, rawAbs * 2.5 );
				spawnBgParticle( 'xylophone', clamp( rawAbs * 2, 0.4, 1 ) );
			}

			xyloActiveIndex = isPlaying ? idx : -1;
			xyloPrevIndex = isPlaying ? idx : xyloPrevIndex;

		}

		// ── Piano (pitch) — warm hammer one-shot per note change ─────────
		function triggerPianoNote( noteIndex, velocity ) {

			if ( ! audioCtx ) return;
			var freq = pianoNotes[ noteIndex ];
			var now  = audioCtx.currentTime;
			var vol  = clamp( velocity, 0.15, 1.0 ) * pianoMaxVol;

			// Fundamental — triangle for warmth
			var osc1 = audioCtx.createOscillator();
			osc1.type = 'triangle';
			osc1.frequency.value = freq;

			// 2nd harmonic
			var osc2 = audioCtx.createOscillator();
			osc2.type = 'sine';
			osc2.frequency.value = freq * 2.0;

			// Slight detune for body
			var osc3 = audioCtx.createOscillator();
			osc3.type = 'sine';
			osc3.frequency.value = freq * 1.001;

			var g1 = audioCtx.createGain();
			g1.gain.setValueAtTime( vol, now );
			g1.gain.exponentialRampToValueAtTime( vol * 0.3, now + 0.08 );
			g1.gain.exponentialRampToValueAtTime( 0.001, now + 1.4 );

			var g2 = audioCtx.createGain();
			g2.gain.setValueAtTime( vol * 0.15, now );
			g2.gain.exponentialRampToValueAtTime( 0.001, now + 0.5 );

			var g3 = audioCtx.createGain();
			g3.gain.setValueAtTime( vol * 0.5, now );
			g3.gain.exponentialRampToValueAtTime( 0.001, now + 1.2 );

			var lp = audioCtx.createBiquadFilter();
			lp.type = 'lowpass';
			lp.frequency.value = 1800;
			lp.Q.value = 0.7;

			osc1.connect( g1 );
			osc2.connect( g2 );
			osc3.connect( g3 );
			g1.connect( lp );
			g2.connect( lp );
			g3.connect( lp );
			lp.connect( audioMasterGain );
			osc1.start( now );
			osc1.stop( now + 1.5 );
			osc2.start( now );
			osc2.stop( now + 0.55 );
			osc3.start( now );
			osc3.stop( now + 1.3 );

		}

		function updatePiano( pitch ) {

			var rangeRad = headRotationRangeDeg * Math.PI / 180;
			var norm = clamp( ( pitch / rangeRad ) * instSensitivity, -1, 1 );
			var rawAbs = Math.abs( clamp( pitch / rangeRad, -1, 1 ) );
			var isPlaying = rawAbs > instDeadzone;

			var pos = ( norm + 1 ) * 0.5;
			var idx = Math.round( pos * ( pianoNotes.length - 1 ) );
			idx = clamp( idx, 0, pianoNotes.length - 1 );

			if ( isPlaying && idx !== pianoPrevIndex ) {
				triggerPianoNote( idx, rawAbs * 2.5 );
				spawnBgParticle( 'piano', clamp( rawAbs * 2, 0.4, 1 ) );
			}

			pianoActiveIndex = isPlaying ? idx : -1;
			pianoPrevIndex = isPlaying ? idx : pianoPrevIndex;

		}

		function triggerBlinkSound() {

			if ( ! audioCtx ) return;

			var now = audioCtx.currentTime;

			// Bass drum — sine pitch sweep + noise transient
			var kickOsc = audioCtx.createOscillator();
			kickOsc.type = 'sine';
			kickOsc.frequency.setValueAtTime( 150, now );
			kickOsc.frequency.exponentialRampToValueAtTime( 40, now + 0.12 );

			var kickGain = audioCtx.createGain();
			kickGain.gain.setValueAtTime( 0.45, now );
			kickGain.gain.exponentialRampToValueAtTime( 0.001, now + 0.35 );

			// Click transient for attack
			var clickOsc = audioCtx.createOscillator();
			clickOsc.type = 'triangle';
			clickOsc.frequency.setValueAtTime( 800, now );
			clickOsc.frequency.exponentialRampToValueAtTime( 100, now + 0.02 );

			var clickGain = audioCtx.createGain();
			clickGain.gain.setValueAtTime( 0.3, now );
			clickGain.gain.exponentialRampToValueAtTime( 0.001, now + 0.03 );

			var kickLP = audioCtx.createBiquadFilter();
			kickLP.type = 'lowpass';
			kickLP.frequency.value = 200;
			kickLP.Q.value = 1.2;

			kickOsc.connect( kickLP );
			kickLP.connect( kickGain );
			clickOsc.connect( clickGain );
			kickGain.connect( audioMasterGain );
			clickGain.connect( audioMasterGain );
			kickOsc.start( now );
			kickOsc.stop( now + 0.4 );
			clickOsc.start( now );
			clickOsc.stop( now + 0.04 );
			triggerVizBlink();

		}

		function updateSmileAudio( smileAmount ) {

			if ( ! audioCtx || ! smileGain ) return;

			var now = audioCtx.currentTime;
			var isSmiling = smileAmount > smileThreshold;

			if ( isSmiling ) {
				// 80s sax: pitch bends up with smile, filter opens, vibrato deepens
				var baseFreq = 349.23; // F4
				var bend = smileAmount * 80; // slight pitch rise
				saxOsc1.frequency.setTargetAtTime( baseFreq + bend, now, 0.12 );
				saxOsc2.frequency.setTargetAtTime( baseFreq + bend + 1.8, now, 0.12 );
				saxOsc3.frequency.setTargetAtTime( ( baseFreq + bend ) * 2, now, 0.12 );
				saxFilter1.frequency.setTargetAtTime( 1200 + smileAmount * 800, now, 0.1 );
				saxVibGain.gain.setTargetAtTime( 3 + smileAmount * 5, now, 0.15 );
				var vol = clamp( ( smileAmount - smileThreshold ) / ( 1 - smileThreshold ), 0, 1 ) * smileMaxVol;
				smileGain.gain.setTargetAtTime( vol, now, 0.08 );
				smileActive = true;
			} else if ( smileActive ) {
				smileGain.gain.setTargetAtTime( 0, now, 0.2 );
				smileActive = false;
			}

		}

		function updateFrownAudio( frownAmount ) {

			if ( ! audioCtx || ! frownGain ) return;

			var now = audioCtx.currentTime;
			var isFrowning = frownAmount > frownThreshold;

			if ( isFrowning ) {
				var t = clamp( ( frownAmount - frownThreshold ) / ( 1 - frownThreshold ), 0, 1 );
				var vol = t * frownMaxVol;
				// Low swanee whistle: slides downward as frown deepens (150 Hz → 55 Hz)
				var freq = 150 - t * 95;
				frownGain.gain.setTargetAtTime( vol, now, 0.08 );
				frownOsc.frequency.setTargetAtTime( freq, now, 0.1 );
				frownActive = true;
			} else if ( frownActive ) {
				frownGain.gain.setTargetAtTime( 0, now, 0.25 );
				frownActive = false;
			}

		}

		function updateHurdyGurdyAudio( browAmount ) {

			if ( ! audioCtx || ! hurdyGain ) return;

			var now = audioCtx.currentTime;
			var isRaised = browAmount > hurdyThreshold;

			if ( isRaised ) {
				var t = clamp( ( browAmount - hurdyThreshold ) / ( 1 - hurdyThreshold ), 0, 1 );
				var vol = t * hurdyMaxVol;
				// Swanee whistle: pitch slides from 300 Hz up to 900 Hz as brows raise
				var freq = 300 + t * 600;
				hurdyGain.gain.setTargetAtTime( vol, now, 0.08 );
				hurdyOsc.frequency.setTargetAtTime( freq, now, 0.1 );
				hurdyOsc2.frequency.setTargetAtTime( freq, now, 0.1 );
				hurdyActive = true;
			} else if ( hurdyActive ) {
				hurdyGain.gain.setTargetAtTime( 0, now, 0.2 );
				hurdyActive = false;
			}

		}

		function updateChoirAudio( jawAmount ) {

			if ( ! audioCtx || ! choirMasterGain ) return;

			var now = audioCtx.currentTime;
			var isSinging = jawAmount > choirThreshold;

			if ( isSinging ) {
				var intensity = clamp( ( jawAmount - choirThreshold ) / ( 1 - choirThreshold ), 0, 1 );
				var vol = intensity * choirMaxVol;
				choirMasterGain.gain.setTargetAtTime( vol, now, 0.1 );
				// Open the filter dramatically as mouth opens
				choirFilterNode.frequency.setTargetAtTime( 2400 + intensity * 3000, now, 0.08 );
				choirActive = true;
			} else if ( choirActive ) {
				choirMasterGain.gain.setTargetAtTime( 0, now, 0.25 );
				choirFilterNode.frequency.setTargetAtTime( 2400, now, 0.2 );
				choirActive = false;
			}

		}

		function updateGuitarAudio( wideAmount ) {

			if ( ! audioCtx || ! guitarGain ) return;
			var now = audioCtx.currentTime;
			var isWide = wideAmount > guitarThreshold;
			if ( isWide ) {
				var vol = clamp( ( wideAmount - guitarThreshold ) / ( 1 - guitarThreshold ), 0, 1 ) * guitarMaxVol;
				guitarGain.gain.setTargetAtTime( vol, now, 0.1 );
				guitarActive = true;
			} else if ( guitarActive ) {
				guitarGain.gain.setTargetAtTime( 0, now, 0.3 );
				guitarActive = false;
			}

		}

		function updateBanjoAudio( puffAmount ) {

			if ( ! audioCtx || ! banjoGain ) return;
			var now = audioCtx.currentTime;
			var isPuffing = puffAmount > banjoThreshold;
			if ( isPuffing ) {
				var vol = clamp( ( puffAmount - banjoThreshold ) / ( 1 - banjoThreshold ), 0, 1 ) * banjoMaxVol;
				banjoGain.gain.setTargetAtTime( vol, now, 0.08 );
				banjoActive = true;
			} else if ( banjoActive ) {
				banjoGain.gain.setTargetAtTime( 0, now, 0.2 );
				banjoActive = false;
			}

		}

		var shimmerCooldownUntil = 0;
		function updateConcertinaAudio( puckerAmount ) {

			if ( ! audioCtx || ! concertinaMasterGain ) return;
			var now = audioCtx.currentTime;
			var nowMs = performance.now();
			var isPuckering = puckerAmount > concertinaThreshold && nowMs > shimmerCooldownUntil;
			if ( isPuckering ) {
				var vol = clamp( ( puckerAmount - concertinaThreshold ) / ( 1 - concertinaThreshold ), 0, 1 ) * concertinaMaxVol;
				concertinaMasterGain.gain.setTargetAtTime( vol, now, 0.25 );
				concertinaActive = true;
			} else if ( concertinaActive ) {
				concertinaMasterGain.gain.setTargetAtTime( 0, now, 0.4 );
				concertinaActive = false;
				shimmerCooldownUntil = nowMs + 1500;
			}

		}

		function updateGlockAudio( sneerAmount ) {

			if ( ! audioCtx || ! glockGain ) return;
			var now = audioCtx.currentTime;
			var isSneering = sneerAmount > glockThreshold;
			if ( isSneering ) {
				var vol = clamp( ( sneerAmount - glockThreshold ) / ( 1 - glockThreshold ), 0, 1 ) * glockMaxVol;
				glockGain.gain.setTargetAtTime( vol, now, 0.06 );
				glockActive = true;
			} else if ( glockActive ) {
				glockGain.gain.setTargetAtTime( 0, now, 0.15 );
				glockActive = false;
			}

		}

		function initViz() {

			if ( vizContainer ) return;
			vizContainer = document.createElement( 'div' );
			vizContainer.style.cssText = 'position:fixed;bottom:24px;right:24px;display:flex;flex-direction:column;align-items:flex-end;gap:12px;pointer-events:none;z-index:20;font-family:"Times New Roman",Times,serif;background:rgba(0,0,0,0.55);padding:14px 16px;border-radius:6px;border:1px solid rgba(255,255,255,0.18);';

			var header = document.createElement( 'div' );
			header.textContent = 'instruments';
			header.style.cssText = 'font-size:13px;color:rgba(255,255,255,0.75);letter-spacing:3px;text-transform:uppercase;text-align:right;margin-bottom:2px;';
			vizContainer.appendChild( header );

			// Helper to build a row of note bars
			function buildNoteRow( label, noteLabels, barColor, elArray, barHeights ) {
				var wrap = document.createElement( 'div' );
				wrap.style.cssText = 'display:flex;flex-direction:column;align-items:flex-end;gap:4px;';

				var lbl = document.createElement( 'div' );
				lbl.textContent = label;
				lbl.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.65);letter-spacing:1px;text-transform:uppercase;';
				wrap.appendChild( lbl );

				var row = document.createElement( 'div' );
				row.style.cssText = 'display:flex;flex-direction:row;align-items:flex-end;gap:5px;';

				for ( var i = 0; i < noteLabels.length; i ++ ) {
					var h = barHeights ? barHeights( i, noteLabels.length ) : 48;
					var pw = document.createElement( 'div' );
					pw.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:2px;';

					var bar = document.createElement( 'div' );
					bar.style.cssText = 'width:18px;height:' + h + 'px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.35);border-radius:3px 3px 0 0;position:relative;overflow:hidden;';

					var fill = document.createElement( 'div' );
					fill.style.cssText = 'position:absolute;bottom:0;left:0;right:0;height:0%;background:' + barColor + ';';
					bar.appendChild( fill );

					var nLbl = document.createElement( 'div' );
					nLbl.textContent = noteLabels[ i ];
					nLbl.style.cssText = 'font-size:9px;color:rgba(255,255,255,0.6);white-space:nowrap;';

					pw.appendChild( bar );
					pw.appendChild( nLbl );
					row.appendChild( pw );
					elArray.push( { bar: bar, fill: fill } );
				}

				wrap.appendChild( row );
				return wrap;
			}

			// ── Xylophone (yaw – left / right)
			vizContainer.appendChild( buildNoteRow(
				'xylophone head turn \u2194', xyloNoteLabels, 'rgba(255,180,50,0.9)', vizXyloEls,
				function( i, n ) { return Math.round( 56 - ( 56 - 28 ) * ( i / ( n - 1 ) ) ); }
			) );

			// ── Piano (pitch – nod up / down)
			vizContainer.appendChild( buildNoteRow(
				'piano head nod \u2195', pianoNoteLabels, 'rgba(220,220,255,0.9)', vizPianoEls,
				function() { return 48; }
			) );

			// ── Pan pipes (roll – head tilt)
			vizContainer.appendChild( buildNoteRow(
				'pan pipes head tilt \u21bb', panPipeNoteLabels, 'rgba(100,220,180,0.9)', vizPipeEls,
				function( i, n ) { return Math.round( 72 - ( 72 - 30 ) * ( i / ( n - 1 ) ) ); }
			) );

			// ── Smile bar
			var smileSec = document.createElement( 'div' );
			smileSec.style.cssText = 'display:flex;flex-direction:row;align-items:center;gap:8px;';

			var smileLbl = document.createElement( 'div' );
			smileLbl.textContent = 'smile';
			smileLbl.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.7);letter-spacing:1px;text-transform:uppercase;width:44px;text-align:right;';

			var smileTrack = document.createElement( 'div' );
			smileTrack.style.cssText = 'width:120px;height:11px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.35);border-radius:6px;overflow:hidden;';

			vizSmileEl = document.createElement( 'div' );
			vizSmileEl.style.cssText = 'height:100%;width:0%;background:linear-gradient(90deg,rgba(255,220,80,0.65),rgba(255,150,30,1));border-radius:4px;';
			smileTrack.appendChild( vizSmileEl );

			smileSec.appendChild( smileLbl );
			smileSec.appendChild( smileTrack );
			vizContainer.appendChild( smileSec );

			// ── Frown bar
			var frownSec = document.createElement( 'div' );
			frownSec.style.cssText = 'display:flex;flex-direction:row;align-items:center;gap:8px;';

			var frownLbl = document.createElement( 'div' );
			frownLbl.textContent = 'frown';
			frownLbl.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.7);letter-spacing:1px;text-transform:uppercase;width:44px;text-align:right;';

			var frownTrack = document.createElement( 'div' );
			frownTrack.style.cssText = 'width:120px;height:11px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.35);border-radius:6px;overflow:hidden;';

			vizFrownEl = document.createElement( 'div' );
			vizFrownEl.style.cssText = 'height:100%;width:0%;background:linear-gradient(90deg,rgba(100,80,200,0.65),rgba(50,20,180,1));border-radius:4px;';
			frownTrack.appendChild( vizFrownEl );

			frownSec.appendChild( frownLbl );
			frownSec.appendChild( frownTrack );
			vizContainer.appendChild( frownSec );

			// ── Hurdy gurdy bar (eyebrows raised)
			var hurdySec = document.createElement( 'div' );
			hurdySec.style.cssText = 'display:flex;flex-direction:row;align-items:center;gap:8px;';

			var hurdyLbl = document.createElement( 'div' );
			hurdyLbl.textContent = 'eyebrows';
			hurdyLbl.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.7);letter-spacing:1px;text-transform:uppercase;width:72px;text-align:right;';

			var hurdyTrack = document.createElement( 'div' );
			hurdyTrack.style.cssText = 'width:120px;height:11px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.35);border-radius:6px;overflow:hidden;';

			vizHurdyEl = document.createElement( 'div' );
			vizHurdyEl.style.cssText = 'height:100%;width:0%;background:linear-gradient(90deg,rgba(180,255,180,0.65),rgba(80,220,80,1));border-radius:4px;';
			hurdyTrack.appendChild( vizHurdyEl );

			hurdySec.appendChild( hurdyLbl );
			hurdySec.appendChild( hurdyTrack );
			vizContainer.appendChild( hurdySec );

			// ── Choir bar (jaw open)
			var choirSec = document.createElement( 'div' );
			choirSec.style.cssText = 'display:flex;flex-direction:row;align-items:center;gap:8px;';

			var choirLbl = document.createElement( 'div' );
			choirLbl.textContent = 'mouth open';
			choirLbl.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.7);letter-spacing:1px;text-transform:uppercase;width:88px;text-align:right;';

			var choirTrack = document.createElement( 'div' );
			choirTrack.style.cssText = 'width:120px;height:11px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.35);border-radius:6px;overflow:hidden;';

			vizChoirEl = document.createElement( 'div' );
			vizChoirEl.style.cssText = 'height:100%;width:0%;background:linear-gradient(90deg,rgba(255,240,200,0.65),rgba(255,200,100,1));border-radius:4px;';
			choirTrack.appendChild( vizChoirEl );

			choirSec.appendChild( choirLbl );
			choirSec.appendChild( choirTrack );
			vizContainer.appendChild( choirSec );

			// ── Helper to build a simple label+bar row
			function buildSimpleBar( label, color, width ) {
				var sec = document.createElement( 'div' );
				sec.style.cssText = 'display:flex;flex-direction:row;align-items:center;gap:8px;';
				var lbl = document.createElement( 'div' );
				lbl.textContent = label;
				lbl.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.7);letter-spacing:1px;text-transform:uppercase;width:' + ( width || 72 ) + 'px;text-align:right;';
				var track = document.createElement( 'div' );
				track.style.cssText = 'width:120px;height:11px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.35);border-radius:6px;overflow:hidden;';
				var fill = document.createElement( 'div' );
				fill.style.cssText = 'height:100%;width:0%;background:' + color + ';border-radius:4px;';
				track.appendChild( fill );
				sec.appendChild( lbl );
				sec.appendChild( track );
				vizContainer.appendChild( sec );
				return fill;
			}

			vizGuitarEl     = buildSimpleBar( 'wide eyes',   'linear-gradient(90deg,rgba(120,220,255,0.65),rgba(60,180,255,1))', 80 );
			vizBanjoEl      = buildSimpleBar( 'cheek puff',  'linear-gradient(90deg,rgba(255,180,80,0.65),rgba(220,120,20,1))',  88 );
			vizConcertinaEl = buildSimpleBar( 'pucker',      'linear-gradient(90deg,rgba(255,120,200,0.65),rgba(200,40,140,1))', 56 );
			vizGlockEl      = buildSimpleBar( 'nose sneer',  'linear-gradient(90deg,rgba(200,255,120,0.65),rgba(140,220,40,1))', 88 );

			// ── Blink dot
			var blinkSec = document.createElement( 'div' );
			blinkSec.style.cssText = 'display:flex;flex-direction:row;align-items:center;gap:8px;';

			var blinkLbl = document.createElement( 'div' );
			blinkLbl.textContent = 'blink';
			blinkLbl.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.7);letter-spacing:1px;text-transform:uppercase;width:44px;text-align:right;';

			vizBlinkEl = document.createElement( 'div' );
			vizBlinkEl.style.cssText = 'width:20px;height:20px;border-radius:50%;background:rgba(200,240,255,0.12);border:2px solid rgba(200,240,255,0.55);';

			blinkSec.appendChild( blinkLbl );
			blinkSec.appendChild( vizBlinkEl );
			vizContainer.appendChild( blinkSec );

		dom.appendChild( vizContainer );
		refreshVizVisibility();

		// --- Mobile bottom-drawer (redesign) ----------------------------------------
		( function () {
			var mq = window.matchMedia( '(max-width: 768px)' );
			if ( ! mq.matches ) return;

			var kids = Array.prototype.slice.call( vizContainer.children );
			// [0]=header [1]=xylo [2]=piano [3]=pipes
			// [4]=smile  [5]=frown [6]=hurdy [7]=choir
			// [8]=guitar [9]=banjo [10]=concertina [11]=glock [12]=blink

			// Full-width glass drawer — lighter, edge-to-edge, pink top accent
			vizContainer.id = 'nh-viz';
			vizContainer.style.cssText = [
				'position:fixed', 'bottom:0', 'left:0', 'right:0',
				'max-height:0', 'overflow:hidden',
				'z-index:20', 'display:flex', 'flex-direction:column',
				'align-items:stretch', 'gap:0',
				'background:transparent',
				'pointer-events:auto', 'touch-action:pan-y',
				'transition:max-height 0.3s ease',
				'padding-bottom:env(safe-area-inset-bottom,0px)',
				'font-family:"Times New Roman",Times,serif',
				'box-sizing:border-box',
			].join( ';' );

			// Restyle each item to use full width properly
			function mobilizeItem( item, noteColors ) {
				var c0 = item.children[ 0 ];
				var c1 = item.children[ 1 ];
				if ( ! c1 ) return;

				var isNoteRow = c1.children && c1.children.length > 2;
				var isCircle  = c1.style.borderRadius && c1.style.borderRadius.indexOf( '50%' ) !== -1;

				if ( isNoteRow ) {
					// Note row: bars spread full width
					item.style.cssText = 'width:100%;display:flex;flex-direction:column;gap:3px;';
					if ( c0 ) c0.style.cssText = 'font-size:9px;font-weight:700;color:#000;letter-spacing:1px;text-transform:uppercase;text-align:left;';
					c1.style.cssText = 'display:flex;flex-direction:row;align-items:flex-end;gap:2px;width:100%;';
					for ( var i = 0; i < c1.children.length; i++ ) {
						var pw = c1.children[ i ];
						pw.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:2px;flex:1;min-width:0;';
						var bar = pw.children[ 0 ];
						if ( bar ) {
							var origH = parseInt( bar.style.height ) || 48;
							bar.style.cssText = 'width:100%;height:' + Math.round( origH * 0.6 ) + 'px;background:transparent;border:1px solid #000;border-radius:3px 3px 0 0;position:relative;overflow:hidden;box-shadow:none;';
							var fill = bar.children[ 0 ];
							if ( fill && noteColors ) { fill.style.background = noteColors[ i ] || noteColors[ noteColors.length - 1 ]; }
						}
						var nLbl = pw.children[ 1 ];
						if ( nLbl ) { nLbl.style.cssText = 'font-size:7px;font-weight:700;color:#000;white-space:nowrap;text-shadow:none;'; }
					}
				} else if ( isCircle ) {
					// Blink: very tight gap so label+dot read as one unit
					item.style.cssText = 'display:flex;flex-direction:row;align-items:center;gap:5px;';
					if ( c0 ) c0.style.cssText = 'font-size:8px;color:#000;letter-spacing:1px;text-transform:uppercase;flex:0 0 auto;';
				} else {
					// Expression bar: compact for 2-col grid
					item.style.cssText = 'display:flex;flex-direction:row;align-items:center;gap:5px;overflow:hidden;';
					if ( c0 ) c0.style.cssText = 'font-size:8px;color:#000;letter-spacing:0.5px;text-transform:uppercase;flex:0 0 auto;min-width:0;max-width:56px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
					c1.style.flex = '0 0 auto';
					c1.style.width = '65px';
					c1.style.border = '1px solid #000';
					c1.style.boxShadow = 'none';
				}
			}

			while ( vizContainer.firstChild ) vizContainer.removeChild( vizContainer.firstChild );

			var xyloColors  = [ '#ff2244','#ff7700','#ffdd00','#22cc44','#00bbee','#2266ff','#8833ff','#ff44cc' ];
			var pianoColors = [ '#ff6600','#ffaa00','#ffee00','#aaee00','#00ccaa','#0088ff','#6644ff','#cc44ff' ];
			var pipeColors  = [ '#00ffcc','#00eeff','#00aaff','#4488ff','#6655ff','#9944ff','#cc44ff','#ff44cc' ];

			var groups = [
				{ title: 'Instruments', items: [ kids[ 1 ], kids[ 2 ], kids[ 3 ] ], itemColors: [ xyloColors, pianoColors, pipeColors ], open: true,  grid: false },
				{ title: 'Expressions', items: [ kids[ 4 ], kids[ 5 ], kids[ 7 ], kids[ 12 ] ], open: false, grid: true },
				{ title: 'Advanced',    items: [ kids[ 6 ], kids[ 8 ], kids[ 9 ], kids[ 10 ], kids[ 11 ] ], open: false, grid: true },
			];

			groups.forEach( function ( g ) {
				var sec = document.createElement( 'div' );
				sec.style.cssText = 'background:rgba(255,255,255,0.15);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);';

				var hdr = document.createElement( 'button' );
				hdr.type = 'button';
				hdr.setAttribute( 'aria-expanded', g.open ? 'true' : 'false' );
				hdr.setAttribute( 'data-nh-btn', '' );
				hdr.style.cssText = [
					'width:100%', 'display:flex', 'justify-content:space-between',
					'align-items:center', 'padding:6px 16px 5px',
					'background:none', 'border:none',
					'border-bottom:1px solid rgba(0,0,0,0.25)',
					'color:#000',
					'font-family:"Courier New",Courier,monospace',
					'font-size:9px', 'font-weight:700', 'letter-spacing:2.5px', 'text-transform:uppercase',
					'cursor:pointer', 'pointer-events:auto', 'touch-action:manipulation',
					'-webkit-tap-highlight-color:transparent',
				].join( ';' );

				var titleEl = document.createElement( 'span' );
				titleEl.textContent = g.title;
				var arrowEl = document.createElement( 'span' );
				arrowEl.textContent = g.open ? '\u25b4' : '\u25be';
				arrowEl.style.cssText = 'font-size:8px;opacity:0.6;';
				hdr.appendChild( titleEl );
				hdr.appendChild( arrowEl );

				var body = document.createElement( 'div' );
				body.setAttribute( 'data-nh-body', '' );
				if ( g.grid ) {
					body.style.cssText = [
						'display:' + ( g.open ? 'grid' : 'none' ),
						'grid-template-columns:1fr 1fr',
						'gap:8px', 'padding:4px 16px 48px',
						'align-items:center', 'background:transparent',
					].join( ';' );
				} else {
					body.style.cssText = [
						'display:' + ( g.open ? 'flex' : 'none' ),
						'flex-direction:column', 'align-items:stretch',
						'gap:9px', 'padding:4px 16px 48px',
						'background:transparent',
					].join( ';' );
				}

				g.items.forEach( function ( item, itemIdx ) {
					mobilizeItem( item, g.itemColors ? g.itemColors[ itemIdx ] : null );
					body.appendChild( item );
				} );

				hdr.addEventListener( 'click', function () {
					var isOpen = hdr.getAttribute( 'aria-expanded' ) === 'true';
					var allBtns   = vizContainer.querySelectorAll( '[data-nh-btn]' );
					var allBodies = vizContainer.querySelectorAll( '[data-nh-body]' );
					for ( var i = 0; i < allBtns.length; i++ ) {
						allBtns[ i ].setAttribute( 'aria-expanded', 'false' );
						allBtns[ i ].lastChild.textContent = '\u25be';
					}
					for ( var j = 0; j < allBodies.length; j++ ) {
						allBodies[ j ].style.display = 'none';
					}
					if ( ! isOpen ) {
						hdr.setAttribute( 'aria-expanded', 'true' );
						arrowEl.textContent = '\u25b4';
						body.style.display = g.grid ? 'grid' : 'flex';
					}
				} );

				sec.appendChild( hdr );
				sec.appendChild( body );
				vizContainer.appendChild( sec );
			} );

			// Controls toggle: pink tinted, glass, bottom-right
			var drawerOpen = false;
			var toggleBtn = document.createElement( 'button' );
			toggleBtn.id = 'nh-controls-btn';
			toggleBtn.type = 'button';
			toggleBtn.setAttribute( 'aria-expanded', 'false' );
			toggleBtn.setAttribute( 'aria-controls', 'nh-viz' );
			toggleBtn.textContent = 'Controls';
			toggleBtn.style.cssText = [
				'position:fixed',
				'bottom:env(safe-area-inset-bottom,0px)',
				'right:12px', 'z-index:21',
				'pointer-events:auto', 'touch-action:manipulation',
				'-webkit-tap-highlight-color:transparent',
				'font-family:"Courier New",Courier,monospace',
				'font-size:10px', 'font-weight:900',
				'letter-spacing:0.12em', 'text-transform:uppercase',
				'padding:7px 14px',
				'border:none', 'border-radius:4px 4px 0 0',
				'background:rgb(183,255,0)',
				'color:#000',
				'cursor:pointer',
			].join( ';' );

			toggleBtn.addEventListener( 'click', function () {
				drawerOpen = ! drawerOpen;
				toggleBtn.setAttribute( 'aria-expanded', drawerOpen ? 'true' : 'false' );
				toggleBtn.textContent = drawerOpen ? 'Close' : 'Controls';
				vizContainer.style.maxHeight = drawerOpen ? '21svh' : '0';
				vizContainer.style.overflowY = drawerOpen ? 'auto' : 'hidden';
			} );

			document.body.appendChild( toggleBtn );

			// Scroll hint: inject scrollbar style + fade edges + chevron
			var nhStyle = document.createElement( 'style' );
			nhStyle.textContent = [
				'#nh-viz::-webkit-scrollbar{width:3px}',
				'#nh-viz::-webkit-scrollbar-track{background:transparent}',
				'#nh-viz::-webkit-scrollbar-thumb{background:rgba(251,174,210,0.4);border-radius:2px}',
				'#nh-viz{scrollbar-width:thin;scrollbar-color:rgba(251,174,210,0.4) transparent}',
			].join( '' );
			document.head.appendChild( nhStyle );

			// Sticky scroll bar at bottom with up/down arrows
			var scrollBar = document.createElement( 'div' );
			scrollBar.style.cssText = [
				'position:sticky', 'bottom:0', 'left:0', 'right:0',
				'display:flex', 'align-items:center', 'justify-content:center',
				'gap:10px', 'padding:5px 0 6px',
				'pointer-events:none',
				'background:rgb(183,255,0)',
			].join( ';' );
			var upArrow = document.createElement( 'span' );
			upArrow.textContent = '↑';
			upArrow.style.cssText = 'font-size:13px;font-weight:900;color:#000;animation:nh-bob-up 1.6s ease-in-out infinite;';
			var scrollLbl = document.createElement( 'span' );
			scrollLbl.textContent = 'scroll';
			scrollLbl.style.cssText = 'font-family:"Courier New",Courier,monospace;font-size:8px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#000;';
			var downArrow = document.createElement( 'span' );
			downArrow.textContent = '↓';
			downArrow.style.cssText = 'font-size:13px;font-weight:900;color:#000;animation:nh-bob-down 1.6s ease-in-out infinite;';
			scrollBar.appendChild( upArrow );
			scrollBar.appendChild( scrollLbl );
			scrollBar.appendChild( downArrow );
			vizContainer.appendChild( scrollBar );

			var nhBobStyle = document.createElement( 'style' );
			nhBobStyle.textContent = '@keyframes nh-bob-up{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes nh-bob-down{0%,100%{transform:translateY(0)}50%{transform:translateY(3px)}}';
			document.head.appendChild( nhBobStyle );

		} )();
		// ---------------------------------------------------------------------------

		// bgAnim + vizLoop already started from play()

		}

		function refreshVizVisibility() {

			if ( ! vizContainer ) return;
			vizContainer.style.display = ( isMobileUI && previewActive ) ? 'none' : 'flex';

		}

		function triggerVizBlink() {

			vizBlinkFlash = 1.0;

		}

		function updateViz( deltaMs ) {

			if ( ! vizContainer ) return;

			// Decay blink flash
			vizBlinkFlash = Math.max( 0, vizBlinkFlash - deltaMs / 180 );

			// Blink dot
			if ( vizBlinkEl ) {
				var bf = vizBlinkFlash;
				var bAlpha = 0.07 + bf * 0.93;
				vizBlinkEl.style.background = 'rgba(200,240,255,' + bAlpha.toFixed( 3 ) + ')';
				vizBlinkEl.style.boxShadow = bf > 0.02 ? '0 0 ' + ( bf * 12 ).toFixed( 1 ) + 'px rgba(200,240,255,' + bf.toFixed( 3 ) + ')' : 'none';
			}

			// Smile bar
			if ( vizSmileEl ) {
				var sa = Math.max( smileLeftValue, smileRightValue );
				var spct = clamp( ( sa - smileThreshold ) / ( 1 - smileThreshold ), 0, 1 ) * 100;
				vizSmileEl.style.width = spct.toFixed( 1 ) + '%';
			}

			// Frown bar
			if ( vizFrownEl ) {
				var fa = Math.max( browDownLeftValue, browDownRightValue );
				var fpct = clamp( ( fa - frownThreshold ) / ( 1 - frownThreshold ), 0, 1 ) * 100;
				vizFrownEl.style.width = fpct.toFixed( 1 ) + '%';
			}

			// Hurdy gurdy bar (eyebrows raised)
			if ( vizHurdyEl ) {
				var ba = Math.max( browInnerUpValue, browOuterUpLeftValue, browOuterUpRightValue );
				var bpct = clamp( ( ba - hurdyThreshold ) / ( 1 - hurdyThreshold ), 0, 1 ) * 100;
				vizHurdyEl.style.width = bpct.toFixed( 1 ) + '%';
			}

			if ( vizGuitarEl ) {
				var wa = Math.max( eyeWideLeftValue, eyeWideRightValue );
				vizGuitarEl.style.width = ( clamp( ( wa - guitarThreshold ) / ( 1 - guitarThreshold ), 0, 1 ) * 100 ).toFixed( 1 ) + '%';
			}
			if ( vizBanjoEl ) {
				vizBanjoEl.style.width = ( clamp( ( cheekPuffFinalValue - banjoThreshold ) / ( 1 - banjoThreshold ), 0, 1 ) * 100 ).toFixed( 1 ) + '%';
			}
			if ( vizConcertinaEl ) {
				vizConcertinaEl.style.width = ( clamp( ( mouthPuckerValue - concertinaThreshold ) / ( 1 - concertinaThreshold ), 0, 1 ) * 100 ).toFixed( 1 ) + '%';
			}
			if ( vizGlockEl ) {
				var sna = Math.max( noseSneerLeftValue, noseSneerRightValue );
				vizGlockEl.style.width = ( clamp( ( sna - glockThreshold ) / ( 1 - glockThreshold ), 0, 1 ) * 100 ).toFixed( 1 ) + '%';
			}

			// Choir bar (jaw open)
			if ( vizChoirEl ) {
				var cpct = clamp( ( jawOpenValue - choirThreshold ) / ( 1 - choirThreshold ), 0, 1 ) * 100;
				vizChoirEl.style.width = cpct.toFixed( 1 ) + '%';
			}

			// Xylophone bars (yaw)
			if ( vizXyloEls.length ) {
				for ( var xi = 0; xi < vizXyloEls.length; xi ++ ) {
					var xe = vizXyloEls[ xi ];
					var xActive = ( xi === xyloActiveIndex );
					if ( xActive ) {
						xe.bar.style.borderColor = 'rgba(255,180,50,1)';
						xe.bar.style.boxShadow = '0 0 14px rgba(255,180,50,0.8)';
						xe.fill.style.height = '100%';
					} else {
						xe.bar.style.borderColor = isMobileUI ? '#000' : 'rgba(255,255,255,0.35)';
						xe.bar.style.boxShadow = 'none';
						xe.fill.style.height = '0%';
					}
				}
			}

			// Piano keys (pitch)
			if ( vizPianoEls.length ) {
				for ( var ki = 0; ki < vizPianoEls.length; ki ++ ) {
					var ke = vizPianoEls[ ki ];
					var kActive = ( ki === pianoActiveIndex );
					if ( kActive ) {
						ke.bar.style.borderColor = 'rgba(200,200,255,1)';
						ke.bar.style.boxShadow = '0 0 14px rgba(200,200,255,0.8)';
						ke.fill.style.height = '100%';
					} else {
						ke.bar.style.borderColor = isMobileUI ? '#000' : 'rgba(255,255,255,0.35)';
						ke.bar.style.boxShadow = 'none';
						ke.fill.style.height = '0%';
					}
				}
			}

			// Pan pipes (roll)
			if ( vizPipeEls.length ) {
				var rangeRad = headRotationRangeDeg * Math.PI / 180;
				var rawRoll = clamp( headPoseRoll / rangeRad, -1, 1 );
				var rollMag = Math.abs( rawRoll );
				var isBlowing = rollMag > instDeadzone;
				var breath = isBlowing ? clamp( rollMag * 2.5, 0.15, 1.0 ) : 0;

				for ( var pi = 0; pi < vizPipeEls.length; pi ++ ) {
					var el = vizPipeEls[ pi ];
					var active = ( pi === panPipeActiveIndex );
					if ( active ) {
						el.bar.style.borderColor = 'rgba(100,220,180,1)';
						el.bar.style.boxShadow = '0 0 14px rgba(100,220,180,0.8)';
						el.fill.style.height = ( breath * 100 ).toFixed( 1 ) + '%';
					} else {
						el.bar.style.borderColor = isMobileUI ? '#000' : 'rgba(255,255,255,0.35)';
						el.bar.style.boxShadow = 'none';
						el.fill.style.height = '0%';
					}
				}
			}

		}

		function updateAudio( deltaMs ) {

			if ( ! audioCtx || ( ! faceDetected && ! previewActive ) ) return;
			ensureAudioResumed();

			// ── XYLOPHONE: yaw (left/right) selects note ──
			updateXylophone( headPoseYaw );

			// ── PIANO: pitch (nod up/down) selects note ──
			updatePiano( headPosePitch );

			// ── PAN PIPES: roll (head tilt) selects note, tilt intensity = breath ──
			updatePanPipes( headPoseRoll, deltaMs );
			if ( panPipeActiveIndex >= 0 ) {
				var rollAmt = Math.abs( headPoseRoll ) / ( headRotationRangeDeg * Math.PI / 180 );
				if ( Math.random() < 0.3 ) spawnBgParticle( 'panPipes', clamp( rollAmt * 2, 0.2, 1 ) );
			}

			// ── BLINK: trigger on blink onset ──
			if ( blinkCooldown > 0 ) blinkCooldown -= deltaMs;
			var blinkNow = eyeBlinkValue > blinkThreshold || eyeBlinkRightValue > blinkThreshold;
			if ( blinkNow && ! blinkWasActive && blinkCooldown <= 0 ) {
				triggerBlinkSound();
				spawnBgParticle( 'blink', 1.0 );
				blinkCooldown = blinkCooldownMs;
			}
			blinkWasActive = blinkNow;

			// ── SMILE: continuous warm shimmer ──
			var smileAmount = Math.max( smileLeftValue, smileRightValue );
			updateSmileAudio( smileAmount );
			if ( smileAmount > smileThreshold && Math.random() < 0.25 ) {
				spawnBgParticle( 'smile', clamp( smileAmount, 0.3, 1 ) );
			}

			// ── FROWN: low drone ──
			var frownAmount = Math.max( browDownLeftValue, browDownRightValue );
			updateFrownAudio( frownAmount );
			if ( frownAmount > frownThreshold && Math.random() < 0.2 ) {
				spawnBgParticle( 'frown', clamp( frownAmount, 0.3, 1 ) );
			}

			// ── HURDY GURDY: rasping drone on eyebrows raised ──
			var browUpAmount = Math.max( browInnerUpValue, browOuterUpLeftValue, browOuterUpRightValue );
			updateHurdyGurdyAudio( browUpAmount );
			if ( browUpAmount > hurdyThreshold && Math.random() < 0.2 ) {
				spawnBgParticle( 'frown', clamp( browUpAmount, 0.3, 1 ) );
			}

			// ── ACOUSTIC GUITAR: wide eyes ──
			var eyeWideAmount = Math.max( eyeWideLeftValue, eyeWideRightValue );
			updateGuitarAudio( eyeWideAmount );
			if ( eyeWideAmount > guitarThreshold && Math.random() < 0.2 ) {
				spawnBgParticle( 'smile', clamp( eyeWideAmount, 0.3, 1 ) );
			}

			// ── BANJO: cheek puff ──
			updateBanjoAudio( cheekPuffFinalValue );
			if ( cheekPuffFinalValue > banjoThreshold && Math.random() < 0.25 ) {
				spawnBgParticle( 'xylophone', clamp( cheekPuffFinalValue, 0.3, 1 ) );
			}

			// ── CONCERTINA: mouth pucker ──
			updateConcertinaAudio( mouthPuckerValue );
			if ( mouthPuckerValue > concertinaThreshold && Math.random() < 0.2 ) {
				spawnBgParticle( 'panPipes', clamp( mouthPuckerValue, 0.3, 1 ) );
			}

			// ── GLOCKENSPIEL: nose sneer ──
			var sneerAmount = Math.max( noseSneerLeftValue, noseSneerRightValue );
			updateGlockAudio( sneerAmount );
			if ( sneerAmount > glockThreshold && Math.random() < 0.3 ) {
				spawnBgParticle( 'blink', clamp( sneerAmount, 0.3, 1 ) );
			}

			// ── CHOIR: angelic pad on jaw open ──
			updateChoirAudio( jawOpenValue );
			if ( jawOpenValue > choirThreshold && Math.random() < 0.3 ) {
				spawnBgParticle( 'choir', clamp( jawOpenValue, 0.2, 1 ) );
			}

		}
		// ── END AUDIO ENGINE ──────────────────────────────────────────────


		var dom = document.createElement( 'div' );
		dom.style.touchAction = 'none';
		dom.style.userSelect = 'none';
		dom.style.position = 'relative';
		dom.style.overflow = 'hidden';
		dom.appendChild( renderer.domElement );
		renderer.domElement.style.position = 'relative';
		renderer.domElement.style.zIndex = '1';

		this.dom = dom;
		this.canvas = renderer.domElement;

		this.width = 500;
		this.height = 500;



		this.setCamera = function ( value ) {

			camera = value;
			camera.aspect = this.width / this.height;
			camera.updateProjectionMatrix();

		};

		this.setScene = function ( value ) {

			scene = value;
			scene.background = null;
			renderer.setClearColor( 0x000000, 0 );

		};

		this.setPixelRatio = function ( pixelRatio ) {

			renderer.setPixelRatio( pixelRatio );

		};

		this.setSize = function ( width, height ) {

			this.width = width;
			this.height = height;

			if ( camera ) {

				camera.aspect = this.width / this.height;
				camera.updateProjectionMatrix();

			}

			renderer.setSize( width, height );
			resizeBgCanvas();

		};

		this.updateLayout = function ( width, height ) {

			this.setSize( width, height );
			setMobileUI( width < 768 );
			updateOverlayCanvasSize();
			dispatch( events.resize, { width: width, height: height } );

		};

		function initFaceTracking() {

			if ( faceInitPromise ) return;
			if ( ! window.FaceLandmarker || ! window.FilesetResolver || ! navigator.mediaDevices ) return;

			faceVideo = document.createElement( 'video' );
			faceVideo.autoplay = true;
			faceVideo.muted = true;
			faceVideo.playsInline = true;
			faceVideo.width = 320;
			faceVideo.height = 240;
			faceVideo.style.cssText = 'position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; top: -9999px; left: -9999px; z-index: 9;';
			dom.appendChild( faceVideo );

			faceInitPromise = window.FilesetResolver.forVisionTasks( 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.15/wasm' )
				.then( function ( resolver ) {

					return window.FaceLandmarker.createFromOptions( resolver, {
						baseOptions: {
							modelAssetPath: 'https://storage.googleapis.com/mediapipe-assets/face_landmarker_with_blendshapes.task'
						},
						outputFaceBlendshapes: true,
						runningMode: 'VIDEO'
					} );

				} )
				.then( function ( landmarker ) {

					faceLandmarker = landmarker;
					return navigator.mediaDevices.getUserMedia( { video: { facingMode: { ideal: 'user' } } } );

				} )
				.then( function ( stream ) {

					faceVideo.srcObject = stream;
					return faceVideo.play();

				} )
				.catch( function ( err ) {

					console.warn( 'Face tracking init failed', err );

				} );

		}

		function ensureDebugDrawer() {

			if ( debugDrawer ) return;

			debugDrawer = document.createElement( 'div' );
			debugDrawer.style.cssText = 'position:fixed;left:0;right:0;bottom:0;max-height:45vh;transform:translateY(100%);transition:transform 0.2s ease;background:rgba(0,0,0,0.85);z-index:11;overflow:auto;';
			dom.appendChild( debugDrawer );

			debugDrawerToggle = document.createElement( 'button' );
			debugDrawerToggle.textContent = 'Debug';
			debugDrawerToggle.style.cssText = 'position:fixed;right:10px;bottom:10px;z-index:12;background:#111;color:#fff;border:1px solid rgba(255,255,255,0.4);padding:8px 12px;font:12px monospace;cursor:pointer;';
			debugDrawerToggle.addEventListener( 'pointerup', function () {
				debugDrawerOpen = ! debugDrawerOpen;
				debugDrawer.style.transform = debugDrawerOpen ? 'translateY(0)' : 'translateY(100%)';
			} );
			dom.appendChild( debugDrawerToggle );

		}

		this.load = function ( json ) {

			var project = json.project;

			if ( project.shadows ) {

				// Shadow maps disabled — scene uses only AmbientLight,
				// shadow mapping with no directional light causes artefacts
				renderer.shadowMap.enabled = false;

			}

			if ( project.toneMapping !== undefined ) {

				// Use no tone mapping to avoid harsh contrast on face
				renderer.toneMapping = THREE.NoToneMapping;
				renderer.toneMappingExposure = 1;

			}

			if ( project.physicallyCorrectLights !== undefined ) {

				renderer.physicallyCorrectLights = project.physicallyCorrectLights;

			}

			this.setScene( loader.parse( json.scene ) );
			this.setCamera( loader.parse( json.camera ) );

			events = {
				init: [],
				start: [],
				stop: [],
				update: [],
				keydown: [],
				keyup: [],
				pointerdown: [],
				pointerup: [],
				pointermove: [],
				pointercancel: [],
				resize: []
			};

			var scripts = json.scripts;

			if ( scripts !== undefined ) {

				for ( var uuid in scripts ) {

					var object = scene.getObjectByProperty( 'uuid', uuid );
					var script = scripts[ uuid ];

					for ( var i = 0; i < script.length; i ++ ) {

						var data = script[ i ];
						var source = data.source;

						var scriptWrap = new Function( 'player', 'scene', 'camera', 'renderer', 'THREE', 'var init, start, stop, update, keydown, keyup, pointerdown, pointerup, pointermove, pointercancel, resize;\n' + source + '\nreturn { init, start, stop, update, keydown, keyup, pointerdown, pointerup, pointermove, pointercancel, resize };' );

						var scope = scriptWrap( this, scene, camera, renderer, THREE );

						if ( scope.init ) events.init.push( scope.init.bind( object ) );
						if ( scope.start ) events.start.push( scope.start.bind( object ) );
						if ( scope.stop ) events.stop.push( scope.stop.bind( object ) );
						if ( scope.update ) events.update.push( scope.update.bind( object ) );
						if ( scope.keydown ) events.keydown.push( scope.keydown.bind( object ) );
						if ( scope.keyup ) events.keyup.push( scope.keyup.bind( object ) );
						if ( scope.pointerdown ) events.pointerdown.push( scope.pointerdown.bind( object ) );
						if ( scope.pointerup ) events.pointerup.push( scope.pointerup.bind( object ) );
						if ( scope.pointermove ) events.pointermove.push( scope.pointermove.bind( object ) );
						if ( scope.pointercancel ) events.pointercancel.push( scope.pointercancel.bind( object ) );
						if ( scope.resize ) events.resize.push( scope.resize.bind( object ) );

					}

				}

			}

			dispatch( events.init, arguments );

		};

		this.initAudio = function () {

			initAudio();

		};

		this.startCamera = function () {

			previewActive = false;
			refreshVizVisibility();
			initFaceTracking();
			initAudio();

		};

		function dispatch( array, event ) {

			for ( var i = 0, l = array.length; i < l; i ++ ) {

				array[ i ]( event );

			}

		}

		function resolveMorphIndex( mesh, morphName ) {

			if ( mesh.morphTargetDictionary && mesh.morphTargetDictionary[ morphName ] !== undefined ) {
				return mesh.morphTargetDictionary[ morphName ];
			}

			if ( mesh.userData && Array.isArray( mesh.userData.targetNames ) ) {
				var idx = mesh.userData.targetNames.indexOf( morphName );
				return idx !== -1 ? idx : null;
			}

			return null;

		}

		function getMorphTargetNames( mesh ) {

			if ( mesh.morphTargetDictionary ) {
				return Object.keys( mesh.morphTargetDictionary );
			}

			if ( mesh.userData && Array.isArray( mesh.userData.targetNames ) ) {
				return mesh.userData.targetNames.slice();
			}

			return [];

		}

		function findCheekPuffMorphName( mesh ) {

			var names = getMorphTargetNames( mesh );
			if ( ! names.length ) return null;

			if ( names.indexOf( 'cheekPuff' ) !== -1 ) return 'cheekPuff';

			var candidates = names.filter( function ( name ) {
				var lower = name.toLowerCase();
				return lower.indexOf( 'cheek' ) !== -1 && lower.indexOf( 'puff' ) !== -1;
			} );

			return candidates.length ? candidates[ 0 ] : null;

		}

		function getBlendshapeScore( categoryName ) {

			if ( ! lastBlendshapes || ! lastBlendshapes.length ) return null;
			for ( var i = 0; i < lastBlendshapes.length; i ++ ) {
				if ( lastBlendshapes[ i ].categoryName === categoryName ) {
					return lastBlendshapes[ i ].score;
				}
			}
			return null;

		}

		function hasBlendshapeCategory( categoryName ) {

			if ( ! lastBlendshapes || ! lastBlendshapes.length ) return false;
			for ( var i = 0; i < lastBlendshapes.length; i ++ ) {
				if ( lastBlendshapes[ i ].categoryName === categoryName ) {
					return true;
				}
			}
			return false;

		}

		function computeCheekPuffProxy( landmarks, allowBaselineUpdate ) {

			if ( ! landmarks || ! landmarks.length ) return 0;

			var nose = landmarks[ 1 ];
			if ( ! nose ) return 0;

			var leftSum = 0;
			var rightSum = 0;
			var leftCount = 0;
			var rightCount = 0;

			for ( var i = 0; i < cheekLeftIndices.length; i ++ ) {
				var idxLeft = cheekLeftIndices[ i ];
				var lmLeft = landmarks[ idxLeft ];
				if ( ! lmLeft ) continue;
				leftSum += lmLeft.x;
				leftCount ++;
			}

			for ( var j = 0; j < cheekRightIndices.length; j ++ ) {
				var idxRight = cheekRightIndices[ j ];
				var lmRight = landmarks[ idxRight ];
				if ( ! lmRight ) continue;
				rightSum += lmRight.x;
				rightCount ++;
			}

			if ( ! leftCount || ! rightCount ) return 0;

			var leftAvg = leftSum / leftCount;
			var rightAvg = rightSum / rightCount;
			var leftDist = Math.max( nose.x - leftAvg, 0 );
			var rightDist = Math.max( rightAvg - nose.x, 0 );

			if ( cheekPuffBaselineLeft === null || cheekPuffBaselineRight === null ) {
				cheekPuffBaselineLeft = leftDist;
				cheekPuffBaselineRight = rightDist;
			}

			if ( allowBaselineUpdate ) {
				var blendL = leftDist < cheekPuffBaselineLeft ? cheekPuffProxyBlend : cheekPuffProxyBlendUp;
				var blendR = rightDist < cheekPuffBaselineRight ? cheekPuffProxyBlend : cheekPuffProxyBlendUp;
				cheekPuffBaselineLeft += ( leftDist - cheekPuffBaselineLeft ) * blendL;
				cheekPuffBaselineRight += ( rightDist - cheekPuffBaselineRight ) * blendR;
			}

			var baselineReady = cheekPuffBaselineLeft > 0 && cheekPuffBaselineRight > 0;
			if ( baselineReady ) {
				var leftDelta = ( leftDist - cheekPuffBaselineLeft ) / cheekPuffBaselineLeft;
				var rightDelta = ( rightDist - cheekPuffBaselineRight ) / cheekPuffBaselineRight;
				var delta = ( Math.max( leftDelta, 0 ) + Math.max( rightDelta, 0 ) ) * 0.5;
				var boosted = Math.min( Math.max( delta * cheekPuffProxyScale, 0 ), 1 );
				return Math.pow( boosted, 0.6 );
			}

			return 0;

		}

		function smoothstep( edge0, edge1, x ) {

			if ( edge0 === edge1 ) return x < edge0 ? 0 : 1;
			var t = Math.min( Math.max( ( x - edge0 ) / ( edge1 - edge0 ), 0 ), 1 );
			return t * t * ( 3 - 2 * t );

		}

		function ensureDebugPanel() {

			if ( ! debugPanelEnabled || debugPanel ) return;

			debugPanel = document.createElement( 'div' );
			if ( isMobileUI ) {
				ensureDebugDrawer();
				debugPanel.style.cssText = 'position:relative;max-width:100%;color:#c7f7d0;background:transparent;font:11px/1.4 monospace;padding:8px;border:0;pointer-events:none;white-space:pre;';
			} else {
				debugPanel.style.cssText = 'position:absolute;top:8px;left:8px;max-width:320px;color:#c7f7d0;background:rgba(0,0,0,0.65);font:11px/1.4 monospace;padding:8px;border:1px solid rgba(255,255,255,0.15);pointer-events:none;white-space:pre;z-index:10;';
			}

			var title = document.createElement( 'div' );
			title.textContent = 'Blendshape Debug';
			title.style.cssText = 'color:#fff;margin-bottom:6px;';
			debugPanel.appendChild( title );

			debugPanelList = document.createElement( 'div' );
			debugPanelList.textContent = 'No blendshape data yet.';
			debugPanel.appendChild( debugPanelList );

			var divider = document.createElement( 'div' );
			divider.textContent = '';
			divider.style.cssText = 'margin:6px 0;border-top:1px solid rgba(255,255,255,0.1);';
			debugPanel.appendChild( divider );

			debugPanelWeights = document.createElement( 'div' );
			debugPanelWeights.textContent = 'Morph weights: n/a';
			debugPanel.appendChild( debugPanelWeights );

			if ( isMobileUI && debugDrawer ) {
				debugDrawer.appendChild( debugPanel );
			} else {
				dom.appendChild( debugPanel );
			}

		}

		function setMobileUI( enabled ) {

			if ( enabled === isMobileUI ) return;
			isMobileUI = enabled;

			if ( debugDrawerToggle ) {
				debugDrawerToggle.style.display = isMobileUI ? 'block' : 'none';
			}
			if ( debugDrawer ) {
				debugDrawer.style.display = isMobileUI ? 'block' : 'none';
				if ( ! isMobileUI ) {
					debugDrawer.style.transform = 'translateY(100%)';
					debugDrawerOpen = false;
				}
			}

			if ( debugPanel ) {
				if ( isMobileUI ) {
					ensureDebugDrawer();
					debugPanel.style.cssText = 'position:relative;max-width:100%;color:#c7f7d0;background:transparent;font:11px/1.4 monospace;padding:8px;border:0;pointer-events:none;white-space:pre;';
					debugDrawer.appendChild( debugPanel );
				} else {
					debugPanel.style.cssText = 'position:absolute;top:8px;left:8px;max-width:320px;color:#c7f7d0;background:rgba(0,0,0,0.65);font:11px/1.4 monospace;padding:8px;border:1px solid rgba(255,255,255,0.15);pointer-events:none;white-space:pre;z-index:10;';
					dom.appendChild( debugPanel );
				}
			}

			refreshVizVisibility();

		}

		function updateOverlayCanvasSize() {

			if ( ! faceVideo || ! overlayCanvas || ! overlayCtx ) return;

			var displayWidth = faceVideo.clientWidth || faceVideo.width;
			var displayHeight = faceVideo.clientHeight || faceVideo.height;

			overlayCanvas.width = displayWidth;
			overlayCanvas.height = displayHeight;
			overlayCanvas.style.left = faceVideo.style.left || '8px';
			overlayCanvas.style.top = faceVideo.style.top || '8px';
			overlayCanvas.style.width = displayWidth + 'px';
			overlayCanvas.style.height = displayHeight + 'px';

		}

		function positionFaceVideo() {

			if ( ! faceVideo ) return;

			if ( debugPanel ) {
				var rect = debugPanel.getBoundingClientRect();
				faceVideo.style.left = Math.round( rect.left ) + 'px';
				faceVideo.style.top = Math.round( rect.bottom + 8 ) + 'px';
			}

		}

		function ensureOverlayCanvas() {

			if ( overlayCanvas ) return;

			overlayCanvas = document.createElement( 'canvas' );
			overlayCanvas.style.cssText = 'position: absolute; pointer-events: none; top: 8px; left: 8px; z-index: 10;';
			overlayCtx = overlayCanvas.getContext( '2d' );
			dom.appendChild( overlayCanvas );

		}

		function drawLandmarksOverlay() {

			if ( ! faceVideo || ! overlayCanvas || ! overlayCtx ) return;
			if ( ! lastFaceLandmarks || ! lastFaceLandmarks.length ) return;

			updateOverlayCanvasSize();

			var displayWidth = overlayCanvas.width;
			var displayHeight = overlayCanvas.height;

			if ( ! displayWidth || ! displayHeight ) return;

			overlayCtx.clearRect( 0, 0, displayWidth, displayHeight );

			var landmarks = lastFaceLandmarks[ 0 ];
			if ( ! landmarks || ! landmarks.length ) return;

			overlayCtx.fillStyle = 'rgba(0, 200, 255, 0.7)';
			for ( var i = 0; i < landmarks.length; i ++ ) {
				var lm = landmarks[ i ];
				var x = lm.x * displayWidth;
				var y = lm.y * displayHeight;
				overlayCtx.beginPath();
				overlayCtx.arc( x, y, 1.2, 0, Math.PI * 2 );
				overlayCtx.fill();
			}

			var leftCenter = { x: 0, y: 0, count: 0 };
			var rightCenter = { x: 0, y: 0, count: 0 };

			overlayCtx.fillStyle = 'rgba(255, 180, 0, 0.9)';
			for ( var j = 0; j < cheekLeftIndices.length; j ++ ) {
				var idxLeft = cheekLeftIndices[ j ];
				var lmLeft = landmarks[ idxLeft ];
				if ( ! lmLeft ) continue;
				var lx = lmLeft.x * displayWidth;
				var ly = lmLeft.y * displayHeight;
				overlayCtx.beginPath();
				overlayCtx.arc( lx, ly, 2.6, 0, Math.PI * 2 );
				overlayCtx.fill();
				leftCenter.x += lx;
				leftCenter.y += ly;
				leftCenter.count ++;
			}

			for ( var k = 0; k < cheekRightIndices.length; k ++ ) {
				var idxRight = cheekRightIndices[ k ];
				var lmRight = landmarks[ idxRight ];
				if ( ! lmRight ) continue;
				var rx = lmRight.x * displayWidth;
				var ry = lmRight.y * displayHeight;
				overlayCtx.beginPath();
				overlayCtx.arc( rx, ry, 2.6, 0, Math.PI * 2 );
				overlayCtx.fill();
				rightCenter.x += rx;
				rightCenter.y += ry;
				rightCenter.count ++;
			}

			overlayCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
			overlayCtx.font = '12px sans-serif';
			if ( leftCenter.count ) {
				overlayCtx.fillText( 'cheek L', leftCenter.x / leftCenter.count + 4, leftCenter.y / leftCenter.count );
			}
			if ( rightCenter.count ) {
				overlayCtx.fillText( 'cheek R', rightCenter.x / rightCenter.count + 4, rightCenter.y / rightCenter.count );
			}

		}

		function formatScore( value ) {

			if ( value === null || value === undefined || isNaN( value ) ) return 'n/a';
			return value.toFixed( 3 );

		}

		function clamp( value, min, max ) {

			return Math.min( Math.max( value, min ), max );

		}

		function computeHeadPose( landmarks ) {

			if ( ! landmarks || ! landmarks.length ) return null;

			var leftEye = landmarks[ 33 ];
			var rightEye = landmarks[ 263 ];
			var nose = landmarks[ 1 ];
			var chin = landmarks[ 152 ];

			if ( ! leftEye || ! rightEye || ! nose || ! chin ) return null;

			var yawRaw = rightEye.z - leftEye.z;
			var pitchRaw = nose.y - chin.y;
			var rollRaw = Math.atan2( rightEye.y - leftEye.y, rightEye.x - leftEye.x );

			if ( ! headPoseBaseline ) {
				headPoseBaseline = { yaw: yawRaw, pitch: pitchRaw, roll: rollRaw };
			}

			var rangeRad = headRotationRangeDeg * Math.PI / 180;
			var rangeRadUp = rangeRad * 1.2;
			var rangeRadDown = rangeRad;
			var yaw = clamp( ( yawRaw - headPoseBaseline.yaw ) * headYawScale, -rangeRad, rangeRad );
			var pitch = clamp( ( headPoseBaseline.pitch - pitchRaw ) * headPitchScale, -rangeRadDown, rangeRadUp );
			var roll = clamp( ( rollRaw - headPoseBaseline.roll ) * headRollScale, -rangeRad, rangeRad );

			return { yaw: yaw, pitch: pitch, roll: roll };

		}

		function getMorphWeight( index ) {

			if ( ! FBHeadMesh || ! FBHeadMesh.morphTargetInfluences ) return null;
			if ( index === null || index === undefined ) return null;
			return FBHeadMesh.morphTargetInfluences[ index ] || 0;

		}

		function updateDebugPanel() {

			if ( ! debugPanelEnabled ) return;

			ensureDebugPanel();

			if ( debugPanelList ) {
				if ( lastBlendshapes && lastBlendshapes.length ) {
					var sorted = lastBlendshapes.slice().sort( function ( a, b ) {
						return b.score - a.score;
					} );
					var lines = [];
					for ( var i = 0; i < sorted.length && lines.length < 12; i ++ ) {
						var entry = sorted[ i ];
						lines.push( entry.categoryName + ': ' + formatScore( entry.score ) );
					}
					debugPanelList.textContent = lines.join( '\n' );
				} else {
					debugPanelList.textContent = 'No blendshape data yet.';
				}
			}

			if ( debugPanelWeights ) {
				var maxScore = 0;
				if ( lastBlendshapes && lastBlendshapes.length ) {
					for ( var i = 0; i < lastBlendshapes.length; i ++ ) {
						if ( lastBlendshapes[ i ].score > maxScore ) {
							maxScore = lastBlendshapes[ i ].score;
						}
					}
				}
				var weights = [
					'jawOpen (jawOpen): ' + formatScore( getMorphWeight( jawOpenMorphIndex ) ) + ' | raw: ' + formatScore( getBlendshapeScore( 'jawOpen' ) ),
					'cheekPuff present: ' + ( hasBlendshapeCategory( 'cheekPuff' ) ? 'yes' : 'no' ) + ' | max score: ' + formatScore( maxScore ),
					'pout raw: ' + formatScore( poutRawValue ),
					'pout final: ' + formatScore( poutFinalValue ),
					'roll raw: ' + formatScore( rollRawValue ),
					'roll final: ' + formatScore( rollFinalValue ),
					'roll weights:',
					'  ' + mouthRollUpperMorphName + ' (index ' + mouthRollUpperMorphIndex + '): ' + formatScore( getMorphWeight( mouthRollUpperMorphIndex ) ),
					'  ' + mouthRollLowerMorphName + ' (index ' + mouthRollLowerMorphIndex + '): ' + formatScore( getMorphWeight( mouthRollLowerMorphIndex ) ),
					'pout target morphs:',
					'  ' + mouthPuckerMorphName + ' (index ' + mouthPuckerMorphIndex + '): ' + formatScore( getMorphWeight( mouthPuckerMorphIndex ) ) + ' | raw: ' + formatScore( getBlendshapeScore( 'mouthPucker' ) ),
					'  ' + mouthFunnelMorphName + ' (index ' + mouthFunnelMorphIndex + '): ' + formatScore( getMorphWeight( mouthFunnelMorphIndex ) ) + ' | raw: ' + formatScore( getBlendshapeScore( 'mouthFunnel' ) ),
					'  ' + mouthRollLowerMorphName + ' (index ' + mouthRollLowerMorphIndex + '): ' + formatScore( getMorphWeight( mouthRollLowerMorphIndex ) ) + ' | raw: ' + formatScore( getBlendshapeScore( 'mouthRollLower' ) ),
					'  ' + mouthRollUpperMorphName + ' (index ' + mouthRollUpperMorphIndex + '): ' + formatScore( getMorphWeight( mouthRollUpperMorphIndex ) ) + ' | raw: ' + formatScore( getBlendshapeScore( 'mouthRollUpper' ) ),
					'lowerDown raw: ' + formatScore( lowerDownRawValue ),
					'lowerDown final: ' + formatScore( lowerDownFinalValue ),
					'lowerDown target morphs:',
					'  ' + mouthLowerDownLeftMorphName + ' (index ' + mouthLowerDownLeftMorphIndex + '): ' + formatScore( getMorphWeight( mouthLowerDownLeftMorphIndex ) ) + ' | raw: ' + formatScore( getBlendshapeScore( 'mouthLowerDownLeft' ) ),
					'  ' + mouthLowerDownRightMorphName + ' (index ' + mouthLowerDownRightMorphIndex + '): ' + formatScore( getMorphWeight( mouthLowerDownRightMorphIndex ) ) + ' | raw: ' + formatScore( getBlendshapeScore( 'mouthLowerDownRight' ) ),
					'jawLeft (index ' + jawLeftMorphIndex + '): ' + formatScore( getMorphWeight( jawLeftMorphIndex ) ) + ' | raw: ' + formatScore( getBlendshapeScore( 'jawLeft' ) ),
					'jawRight (index ' + jawRightMorphIndex + '): ' + formatScore( getMorphWeight( jawRightMorphIndex ) ) + ' | raw: ' + formatScore( getBlendshapeScore( 'jawRight' ) ) + ' | present: ' + ( hasBlendshapeCategory( 'jawRight' ) ? 'yes' : 'no' ),
					'cheekPuff input: ' + formatScore( getBlendshapeScore( 'cheekPuff' ) ),
					'cheekPuff raw: ' + formatScore( cheekPuffRawValue ),
					'cheekPuff proxy: ' + formatScore( cheekPuffProxyValue ),
					'cheekPuff final: ' + formatScore( cheekPuffFinalValue ),
					'cheekPuff target morph:',
					'  ' + ( cheekPuffMorphName || 'none' ) + ' (index ' + cheekPuffMorphIndex + '): ' + formatScore( getMorphWeight( cheekPuffMorphIndex ) ) + ' | raw: ' + formatScore( getBlendshapeScore( 'cheekPuff' ) ),
					'cheekSquintLeft (index ' + cheekSquintLeftMorphIndex + '): ' + formatScore( getMorphWeight( cheekSquintLeftMorphIndex ) ),
					'cheekSquintRight (index ' + cheekSquintRightMorphIndex + '): ' + formatScore( getMorphWeight( cheekSquintRightMorphIndex ) ),
					'mouthStretchLeft (mouthStretchLeft): ' + formatScore( getMorphWeight( mouthStretchLeftMorphIndex ) ) + ' | raw: ' + formatScore( getBlendshapeScore( 'mouthStretchLeft' ) ),
					'mouthStretchRight (mouthStretchRight): ' + formatScore( getMorphWeight( mouthStretchRightMorphIndex ) ) + ' | raw: ' + formatScore( getBlendshapeScore( 'mouthStretchRight' ) ),
					'eyeWideLeft (index ' + eyeWideLeftMorphIndex + '): ' + formatScore( getMorphWeight( eyeWideLeftMorphIndex ) ) + ' | raw: ' + formatScore( getBlendshapeScore( 'eyeWideLeft' ) ),
					'eyeWideRight (index ' + eyeWideRightMorphIndex + '): ' + formatScore( getMorphWeight( eyeWideRightMorphIndex ) ) + ' | raw: ' + formatScore( getBlendshapeScore( 'eyeWideRight' ) ),
					'browDownLeft (index ' + browDownLeftMorphIndex + '): ' + formatScore( getMorphWeight( browDownLeftMorphIndex ) ) + ' | raw: ' + formatScore( getBlendshapeScore( 'browDownLeft' ) ),
					'browDownRight (index ' + browDownRightMorphIndex + '): ' + formatScore( getMorphWeight( browDownRightMorphIndex ) ) + ' | raw: ' + formatScore( getBlendshapeScore( 'browDownRight' ) ),
					'browInnerUp (index ' + browInnerUpMorphIndex + '): ' + formatScore( getMorphWeight( browInnerUpMorphIndex ) ) + ' | raw: ' + formatScore( getBlendshapeScore( 'browInnerUp' ) ),
					'browOuterUpLeft (index ' + browOuterUpLeftMorphIndex + '): ' + formatScore( getMorphWeight( browOuterUpLeftMorphIndex ) ) + ' | raw: ' + formatScore( getBlendshapeScore( 'browOuterUpLeft' ) ),
					'browOuterUpRight (index ' + browOuterUpRightMorphIndex + '): ' + formatScore( getMorphWeight( browOuterUpRightMorphIndex ) ) + ' | raw: ' + formatScore( getBlendshapeScore( 'browOuterUpRight' ) ),
					'mouthSmileLeft (mouthSmileLeft): ' + formatScore( getMorphWeight( smileLeftMorphIndex ) ) + ' | raw: ' + formatScore( getBlendshapeScore( 'mouthSmileLeft' ) ),
					'mouthSmileRight (mouthSmileRight): ' + formatScore( getMorphWeight( smileRightMorphIndex ) ) + ' | raw: ' + formatScore( getBlendshapeScore( 'mouthSmileRight' ) )
				];
				debugPanelWeights.textContent = weights.join( '\n' );
			}

			if ( overlayEnabled ) {
				ensureOverlayCanvas();
				if ( overlayCanvas ) {
					overlayCanvas.style.display = 'block';
				}
				drawLandmarksOverlay();
				if ( overlayCtx && overlayCanvas ) {
					var leftText = 'L rot (deg): ' + formatScore( eyeLeftRotX !== null ? ( eyeLeftRotX * 180 / Math.PI ) : null ) + ', ' + formatScore( eyeLeftRotY !== null ? ( eyeLeftRotY * 180 / Math.PI ) : null );
					var rightText = 'R rot (deg): ' + formatScore( eyeRightRotX !== null ? ( eyeRightRotX * 180 / Math.PI ) : null ) + ', ' + formatScore( eyeRightRotY !== null ? ( eyeRightRotY * 180 / Math.PI ) : null );
					overlayCtx.fillStyle = 'rgba(0, 0, 0, 0.6)';
					overlayCtx.fillRect( 6, 6, 210, 34 );
					overlayCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
					overlayCtx.font = '12px monospace';
					overlayCtx.fillText( leftText, 10, 20 );
					overlayCtx.fillText( rightText, 10, 34 );
				}
				positionFaceVideo();
			} else if ( overlayCanvas ) {
				overlayCanvas.style.display = 'none';
			}

		}

		function debugLoop() {

			updateDebugPanel();
			debugLoopId = window.requestAnimationFrame( debugLoop );

		}

		function startDebugLoop() {

			if ( debugLoopId || ! debugPanelEnabled ) return;
			debugLoopId = window.requestAnimationFrame( debugLoop );

		}

		function stopDebugLoop() {

			if ( ! debugLoopId ) return;
			window.cancelAnimationFrame( debugLoopId );
			debugLoopId = 0;

		}

		var time, startTime, prevTime;

	function animate() {

  time = performance.now();

  try {

    dispatch( events.update, { time: time - startTime, delta: time - prevTime } );

  } catch ( e ) {

    console.error( ( e.message || e ), ( e.stack || '' ) );

  }

  if ( ! FBHeadMesh && scene ) {
    FBHeadMesh = scene.getObjectByName( 'FBHead' );
    // Fix harsh shadowing: boost emissive so the face self-illuminates evenly,
    // reducing dependence on scene lights that create uneven PBR shading
    if ( FBHeadMesh && FBHeadMesh.material ) {
      var mat = FBHeadMesh.material;
      if ( mat.emissive ) {
        mat.emissive.set( 0x555555 );
        mat.emissiveIntensity = 0.6;
      }
      mat.roughness = Math.max( mat.roughness, 0.7 );
      mat.metalness = Math.min( mat.metalness, 0.0 );
      mat.envMapIntensity = 0.15;
      mat.needsUpdate = true;
      // Also fix eye materials if they share the same issue
      var eyeL = scene.getObjectByName( 'eye_lft' );
      var eyeR = scene.getObjectByName( 'eye_rt' );
      [ eyeL, eyeR ].forEach( function ( eyeObj ) {
        if ( eyeObj && eyeObj.material && eyeObj.material.emissive ) {
          eyeObj.material.emissive.set( 0x444444 );
          eyeObj.material.emissiveIntensity = 0.5;
          eyeObj.material.needsUpdate = true;
        }
      } );
    }
  }

  if ( FBHeadMesh && ! FBHeadRestPosition ) {
    FBHeadRestPosition = FBHeadMesh.position.clone();
  }

  if ( FBHeadMesh && ! FBHeadRestRotation ) {
    FBHeadRestRotation = FBHeadMesh.rotation.clone();
  }

  if ( ! headGroup && scene ) {
    headGroup = scene.getObjectByName( 'gp_head_6.glb' );
  }

  if ( headGroup && ! headGroupRestRotation ) {
    headGroup.rotation.set( 0, 0, 0 );
    headGroupRestRotation = headGroup.rotation.clone();
  }

  // ── Create drop shadow behind the head ──
  if ( headGroup && ! headShadowMesh && scene ) {
    var shadowSize = 2.4;
    var shadowCanvas = document.createElement( 'canvas' );
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    var sctx = shadowCanvas.getContext( '2d' );
    var grad = sctx.createRadialGradient( 128, 128, 0, 128, 128, 128 );
    grad.addColorStop( 0, 'rgba(0,0,0,0.7)' );
    grad.addColorStop( 0.5, 'rgba(0,0,0,0.35)' );
    grad.addColorStop( 1, 'rgba(0,0,0,0)' );
    sctx.fillStyle = grad;
    sctx.fillRect( 0, 0, 256, 256 );
    var shadowTex = new THREE.CanvasTexture( shadowCanvas );
    var shadowMat = new THREE.MeshBasicMaterial( {
      map: shadowTex, transparent: true, depthWrite: false, side: THREE.DoubleSide
    } );
    var shadowGeo = new THREE.PlaneGeometry( shadowSize, shadowSize );
    headShadowMesh = new THREE.Mesh( shadowGeo, shadowMat );
    headShadowMesh.position.copy( headGroup.position );
    headShadowMesh.position.z -= 0.6;
    headShadowMesh.position.y -= 0.15;
    headShadowMesh.renderOrder = -1;
    headGroup.parent.add( headShadowMesh );
  }

  if ( ! eyeLeftObj && scene ) {
    eyeLeftObj = scene.getObjectByName( 'eye_lft' );
  }

  if ( ! eyeRightObj && scene ) {
    eyeRightObj = scene.getObjectByName( 'eye_rt' );
  }

  if ( FBHeadMesh && jawOpenMorphIndex === null && ! jawOpenMorphLogged ) {
    jawOpenMorphIndex = resolveMorphIndex( FBHeadMesh, jawOpenMorphName );
    jawOpenMorphLogged = true;
  }

  if ( FBHeadMesh && ! smileMorphLogged ) {
    smileLeftMorphIndex = resolveMorphIndex( FBHeadMesh, smileLeftMorphName );
    smileRightMorphIndex = resolveMorphIndex( FBHeadMesh, smileRightMorphName );
    smileMorphLogged = true;
  }

  if ( FBHeadMesh && ! mouthPressMorphLogged ) {
    mouthPressLeftMorphIndex = resolveMorphIndex( FBHeadMesh, mouthPressLeftMorphName );
    mouthPressRightMorphIndex = resolveMorphIndex( FBHeadMesh, mouthPressRightMorphName );
    mouthPressMorphLogged = true;
  }

  if ( FBHeadMesh && ! mouthPuckerMorphLogged ) {
    mouthPuckerMorphIndex = resolveMorphIndex( FBHeadMesh, mouthPuckerMorphName );
    mouthFunnelMorphIndex = resolveMorphIndex( FBHeadMesh, mouthFunnelMorphName );
    mouthRollLowerMorphIndex = resolveMorphIndex( FBHeadMesh, mouthRollLowerMorphName );
    mouthRollUpperMorphIndex = resolveMorphIndex( FBHeadMesh, mouthRollUpperMorphName );
    mouthLowerDownLeftMorphIndex = resolveMorphIndex( FBHeadMesh, mouthLowerDownLeftMorphName );
    mouthLowerDownRightMorphIndex = resolveMorphIndex( FBHeadMesh, mouthLowerDownRightMorphName );
    mouthPuckerMorphLogged = true;
  }

  if ( FBHeadMesh && ! cheekPuffMorphLogged ) {
    cheekPuffMorphName = findCheekPuffMorphName( FBHeadMesh );
    if ( cheekPuffMorphName ) {
      cheekPuffMorphIndex = resolveMorphIndex( FBHeadMesh, cheekPuffMorphName );
    }
    if ( cheekPuffMorphIndex === null ) {
      cheekPuffMorphIndex = 48;
      cheekPuffMorphName = 'cheekPuff(fallback:48)';
    }
    cheekPuffMorphLogged = true;
  }

  if ( FBHeadMesh && ! mouthStretchMorphLogged ) {
    mouthStretchLeftMorphIndex = resolveMorphIndex( FBHeadMesh, mouthStretchLeftMorphName );
    mouthStretchRightMorphIndex = resolveMorphIndex( FBHeadMesh, mouthStretchRightMorphName );
    mouthStretchMorphLogged = true;
  }

  if ( FBHeadMesh && ! mouthUpperUpMorphLogged ) {
    mouthUpperUpLeftMorphIndex = resolveMorphIndex( FBHeadMesh, mouthUpperUpLeftMorphName );
    mouthUpperUpRightMorphIndex = resolveMorphIndex( FBHeadMesh, mouthUpperUpRightMorphName );
    if ( mouthUpperUpLeftMorphIndex === null && mouthUpperUpRightMorphIndex === null ) {
      mouthUpperUpMorphIndex = resolveMorphIndex( FBHeadMesh, mouthUpperUpMorphName );
    }
    mouthUpperUpMorphLogged = true;
  }

  if ( FBHeadMesh && ! browMorphLogged ) {
    browInnerUpMorphIndex = browInnerUpMorphIndexOverride;
    browOuterUpLeftMorphIndex = browOuterUpLeftMorphIndexOverride;
    browOuterUpRightMorphIndex = browOuterUpRightMorphIndexOverride;
    browDownLeftMorphIndex = browDownLeftMorphIndexOverride;
    browDownRightMorphIndex = browDownRightMorphIndexOverride;
    browMorphLogged = true;
  }


  if ( FBHeadMesh && ! debugMorphLogged ) {
    var debugInfluences = FBHeadMesh.morphTargetInfluences;
    var debugInfluenceCount = debugInfluences ? debugInfluences.length : 0;
    console.log( 'FBHead morph debug:', {
      morphTargetInfluences: debugInfluenceCount,
      jawOpenMorphName: jawOpenMorphName,
      jawOpenMorphIndex: jawOpenMorphIndex,
      morphTargetNames: getMorphTargetNames( FBHeadMesh )
    } );
    debugMorphLogged = true;
  }

  // ── Preview animation (before camera is enabled) ──
  if ( previewActive && FBHeadMesh && FBHeadMesh.morphTargetInfluences && headGroup && headGroupRestRotation ) {
    previewTime += ( time - prevTime ) * 0.001;
    var pt = previewTime;
    var inf = FBHeadMesh.morphTargetInfluences;

    // ── Head sway — wide & expressive ──
    var pvYaw = Math.sin( pt * 0.5 ) * 0.35 + Math.sin( pt * 1.3 ) * 0.12;
    var pvPitch = Math.sin( pt * 0.38 + 1.2 ) * 0.2 + Math.sin( pt * 0.9 + 0.5 ) * 0.08;
    var pvRoll = Math.sin( pt * 0.28 + 2.5 ) * 0.15 + Math.sin( pt * 0.7 + 1.0 ) * 0.06;
    headGroup.rotation.y = headGroupRestRotation.y + pvYaw;
    headGroup.rotation.x = headGroupRestRotation.x + ( headRestPitchOffsetDeg * Math.PI / 180 ) + pvPitch;
    headGroup.rotation.z = headGroupRestRotation.z + pvRoll;

    // ── Eyes follow head + independent darting ──
    if ( eyeLeftObj ) {
      if ( eyeLeftBaseRotX === null ) {
        eyeLeftBaseRotX = eyeLeftObj.rotation.x; eyeLeftBaseRotY = eyeLeftObj.rotation.y;
        eyeLeftBaseRotZ = eyeLeftObj.rotation.z; eyeLeftRotX = 0; eyeLeftRotY = 0;
      }
      eyeLeftObj.rotation.x = eyeLeftBaseRotX + ( eyeLeftPitchOffsetDeg * Math.PI / 180 ) + Math.sin( pt * 0.7 + 0.5 ) * 0.18;
      eyeLeftObj.rotation.y = eyeLeftBaseRotY + Math.sin( pt * 0.55 ) * 0.2 + Math.sin( pt * 1.8 ) * 0.06;
    }
    if ( eyeRightObj ) {
      if ( eyeRightBaseRotX === null ) {
        eyeRightBaseRotX = eyeRightObj.rotation.x; eyeRightBaseRotY = eyeRightObj.rotation.y;
        eyeRightBaseRotZ = eyeRightObj.rotation.z; eyeRightRotX = 0; eyeRightRotY = 0;
      }
      eyeRightObj.rotation.x = eyeRightBaseRotX + ( eyeRightPitchOffsetDeg * Math.PI / 180 ) + Math.sin( pt * 0.7 + 0.5 ) * 0.18;
      eyeRightObj.rotation.y = eyeRightBaseRotY + Math.sin( pt * 0.55 ) * 0.2 + Math.sin( pt * 1.8 ) * 0.06;
    }

    // ── Blinks — every ~2.8s with double-blink sometimes ──
    var blinkCycle = ( pt % 2.8 );
    var pvBlink = 0;
    if ( blinkCycle < 0.1 ) pvBlink = Math.sin( blinkCycle / 0.1 * Math.PI );
    else if ( blinkCycle > 0.2 && blinkCycle < 0.3 && Math.sin( pt * 0.17 ) > 0.5 ) pvBlink = Math.sin( ( blinkCycle - 0.2 ) / 0.1 * Math.PI );
    inf[ 0 ] = pvBlink;
    inf[ 1 ] = pvBlink;

    // ── Eye wide — opens wide between blinks ──
    var pvEyeWide = Math.max( 0, Math.sin( pt * 0.35 + 2.0 ) * 0.5 ) * ( 1 - pvBlink );
    if ( eyeWideLeftMorphIndex !== null ) inf[ eyeWideLeftMorphIndex ] = pvEyeWide;
    if ( eyeWideRightMorphIndex !== null ) inf[ eyeWideRightMorphIndex ] = pvEyeWide;

    // ── Jaw open — breathing / talking cycle ──
    var pvJaw = Math.max( 0, Math.sin( pt * 0.65 + 2.0 ) * 0.4 + Math.sin( pt * 1.5 ) * 0.15 );
    if ( jawOpenMorphIndex !== null ) inf[ jawOpenMorphIndex ] = pvJaw;

    // ── Smile — warm waves ──
    var pvSmile = Math.max( 0, Math.sin( pt * 0.4 + 0.8 ) * 0.6 );
    if ( smileLeftMorphIndex !== null ) inf[ smileLeftMorphIndex ] = pvSmile;
    if ( smileRightMorphIndex !== null ) inf[ smileRightMorphIndex ] = pvSmile;

    // ── Frown — intermittent ──
    var pvFrown = Math.max( 0, Math.sin( pt * 0.25 + 4.0 ) * 0.45 ) * ( pvSmile < 0.1 ? 1 : 0 );
    if ( browDownLeftMorphIndex !== null ) inf[ browDownLeftMorphIndex ] = pvFrown;
    if ( browDownRightMorphIndex !== null ) inf[ browDownRightMorphIndex ] = pvFrown;

    // ── Brow raise — alternating with frown ──
    var pvBrow = Math.max( 0, Math.sin( pt * 0.35 + 1.5 ) * 0.5 ) * ( pvFrown < 0.1 ? 1 : 0 );
    if ( browInnerUpMorphIndex !== null ) inf[ browInnerUpMorphIndex ] = pvBrow;
    if ( browOuterUpLeftMorphIndex !== null ) inf[ browOuterUpLeftMorphIndex ] = pvBrow * 0.7;
    if ( browOuterUpRightMorphIndex !== null ) inf[ browOuterUpRightMorphIndex ] = pvBrow * 0.7;

    // ── Mouth pucker ──
    var pvPucker = Math.max( 0, Math.sin( pt * 0.3 + 5.0 ) * 0.6 ) * ( pvJaw < 0.1 ? 1 : 0 );
    if ( mouthPuckerMorphIndex !== null ) inf[ mouthPuckerMorphIndex ] = pvPucker;

    // ── Mouth funnel ──
    var pvFunnel = Math.max( 0, Math.sin( pt * 0.45 + 3.5 ) * 0.35 ) * ( pvPucker < 0.1 ? 1 : 0 );
    if ( mouthFunnelMorphIndex !== null ) inf[ mouthFunnelMorphIndex ] = pvFunnel;

    // ── Mouth press ──
    var pvPress = Math.max( 0, Math.sin( pt * 0.55 + 1.0 ) * 0.4 ) * ( pvJaw < 0.05 ? 1 : 0 );
    if ( mouthPressLeftMorphIndex !== null ) inf[ mouthPressLeftMorphIndex ] = pvPress;
    if ( mouthPressRightMorphIndex !== null ) inf[ mouthPressRightMorphIndex ] = pvPress;

    // ── Mouth stretch ──
    var pvStretch = Math.max( 0, Math.sin( pt * 0.5 + 2.5 ) * 0.3 ) * ( pvSmile > 0.2 ? 1 : 0 );
    if ( mouthStretchLeftMorphIndex !== null ) inf[ mouthStretchLeftMorphIndex ] = pvStretch;
    if ( mouthStretchRightMorphIndex !== null ) inf[ mouthStretchRightMorphIndex ] = pvStretch;

    // ── Upper lip raise ──
    var pvUpperLip = Math.max( 0, Math.sin( pt * 0.7 + 0.3 ) * 0.3 ) * ( pvJaw > 0.1 ? 1 : 0 );
    if ( mouthUpperUpLeftMorphIndex !== null ) inf[ mouthUpperUpLeftMorphIndex ] = pvUpperLip;
    if ( mouthUpperUpRightMorphIndex !== null ) inf[ mouthUpperUpRightMorphIndex ] = pvUpperLip;
    if ( mouthUpperUpMorphIndex !== null ) inf[ mouthUpperUpMorphIndex ] = pvUpperLip;

    // ── Mouth roll ──
    var pvRollLip = Math.max( 0, Math.sin( pt * 0.4 + 6.0 ) * 0.25 );
    if ( mouthRollLowerMorphIndex !== null ) inf[ mouthRollLowerMorphIndex ] = pvRollLip;
    if ( mouthRollUpperMorphIndex !== null ) inf[ mouthRollUpperMorphIndex ] = pvRollLip * 0.6;

    // ── Lower lip down ──
    var pvLowerDown = Math.max( 0, Math.sin( pt * 0.6 + 1.8 ) * 0.3 ) * ( pvJaw > 0.05 ? 1 : 0 );
    if ( mouthLowerDownLeftMorphIndex !== null ) inf[ mouthLowerDownLeftMorphIndex ] = pvLowerDown;
    if ( mouthLowerDownRightMorphIndex !== null ) inf[ mouthLowerDownRightMorphIndex ] = pvLowerDown;

    // ── Cheek squint (with smile) ──
    var pvCheekSquint = pvSmile * 0.5;
    if ( cheekSquintLeftMorphIndex !== null ) inf[ cheekSquintLeftMorphIndex ] = pvCheekSquint;
    if ( cheekSquintRightMorphIndex !== null ) inf[ cheekSquintRightMorphIndex ] = pvCheekSquint;

    // ── Jaw left/right ──
    var pvJawLR = Math.sin( pt * 0.3 + 3.0 ) * 0.15;
    if ( jawLeftMorphIndex !== null ) inf[ jawLeftMorphIndex ] = Math.max( 0, pvJawLR );
    if ( jawRightMorphIndex !== null ) inf[ jawRightMorphIndex ] = Math.max( 0, -pvJawLR );

    // ── Feed global tracking vars so updateAudio() can drive instruments ──
    headPoseYaw = pvYaw;
    headPosePitch = pvPitch;
    headPoseRoll = pvRoll;
    eyeBlinkValue = pvBlink;
    eyeBlinkRightValue = pvBlink;
    smileLeftValue = pvSmile;
    smileRightValue = pvSmile;
    browDownLeftValue = pvFrown;
    browDownRightValue = pvFrown;
    jawOpenValue = pvJaw;

    // ── Update audio engine if ready (instruments + some particle spawns) ──
    updateAudio( time - prevTime );

    // ── Always spawn background particles directly from preview values ──
    var pvHeadYawNorm = Math.abs( pvYaw ) / 0.35;
    var pvHeadPitchNorm = Math.abs( pvPitch ) / 0.2;
    var pvHeadRollNorm = Math.abs( pvRoll ) / 0.15;
    if ( pvHeadYawNorm > 0.3 && Math.random() < 0.25 ) spawnBgParticle( 'xylophone', clamp( pvHeadYawNorm, 0.4, 1 ) );
    if ( pvHeadPitchNorm > 0.3 && Math.random() < 0.25 ) spawnBgParticle( 'piano', clamp( pvHeadPitchNorm, 0.4, 1 ) );
    if ( pvHeadRollNorm > 0.3 && Math.random() < 0.15 ) spawnBgParticle( 'panPipes', clamp( pvHeadRollNorm, 0.2, 1 ) );
    if ( pvBlink > 0.5 ) spawnBgParticle( 'blink', 1.0 );
    if ( pvSmile > 0.25 && Math.random() < 0.2 ) spawnBgParticle( 'smile', clamp( pvSmile, 0.3, 1 ) );
    if ( pvFrown > 0.2 && Math.random() < 0.15 ) spawnBgParticle( 'frown', clamp( pvFrown, 0.3, 1 ) );
    if ( pvJaw > 0.15 && Math.random() < 0.2 ) spawnBgParticle( 'choir', clamp( pvJaw, 0.2, 1 ) );

    // Skip face tracking when preview is active — jump to render
    renderer.render( scene, camera );
    prevTime = time;
    return;
  }

  if ( faceLandmarker && faceVideo && faceVideo.readyState >= 2 ) {
    var result = faceLandmarker.detectForVideo( faceVideo, time );
    faceDetected = false;

    if ( result.faceLandmarks && result.faceLandmarks.length ) {
      lastFaceLandmarks = result.faceLandmarks;
    }

    if ( result.faceBlendshapes && result.faceBlendshapes.length ) {
      var categories = result.faceBlendshapes[ 0 ].categories;
      lastBlendshapes = categories;

      for ( var i = 0; i < categories.length; i ++ ) {
        if ( categories[ i ].categoryName === 'eyeBlinkLeft' ) {
          eyeBlinkValue = Math.min( categories[ i ].score * 2.3, 1 );
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'eyeBlinkRight' ) {
          eyeBlinkRightValue = Math.min( categories[ i ].score * 2.3, 1 );
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'eyeWideLeft' ) {
          eyeWideLeftValue = Math.min( categories[ i ].score * eyeWideStrength, 1 );
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'eyeWideRight' ) {
          eyeWideRightValue = Math.min( categories[ i ].score * eyeWideStrength, 1 );
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'eyeLookUpLeft' ) {
          eyeLookUpLeftValue = Math.min( categories[ i ].score, 1 );
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'eyeLookDownLeft' ) {
          eyeLookDownLeftValue = Math.min( categories[ i ].score, 1 );
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'eyeLookInLeft' ) {
          eyeLookInLeftValue = Math.min( categories[ i ].score, 1 );
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'eyeLookOutLeft' ) {
          eyeLookOutLeftValue = Math.min( categories[ i ].score, 1 );
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'eyeLookUpRight' ) {
          eyeLookUpRightValue = Math.min( categories[ i ].score, 1 );
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'eyeLookDownRight' ) {
          eyeLookDownRightValue = Math.min( categories[ i ].score, 1 );
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'eyeLookInRight' ) {
          eyeLookInRightValue = Math.min( categories[ i ].score, 1 );
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'eyeLookOutRight' ) {
          eyeLookOutRightValue = Math.min( categories[ i ].score, 1 );
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'jawOpen' ) {
          var jawScore = categories[ i ].score;
          if ( jawScore <= jawDeadzone ) {
            jawOpenValue = 0;
          } else {
            jawOpenValue = Math.min( ( ( jawScore - jawDeadzone ) / ( 1 - jawDeadzone ) ) * jawOpenStrength, 1 );
          }
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'mouthSmileLeft' ) {
          var smileLeftScore = categories[ i ].score;
          if ( smileLeftScore <= mouthDeadzone ) {
            smileLeftValue = 0;
          } else {
            smileLeftValue = Math.min( ( ( smileLeftScore - mouthDeadzone ) / ( 1 - mouthDeadzone ) ) * smileStrength, 1 );
          }
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'mouthSmileRight' ) {
          var smileRightScore = categories[ i ].score;
          if ( smileRightScore <= mouthDeadzone ) {
            smileRightValue = 0;
          } else {
            smileRightValue = Math.min( ( ( smileRightScore - mouthDeadzone ) / ( 1 - mouthDeadzone ) ) * smileStrength, 1 );
          }
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'mouthPressLeft' ) {
          var mouthPressLeftScore = categories[ i ].score;
          if ( mouthPressLeftScore <= mouthDeadzone ) {
            mouthPressLeftValue = 0;
          } else {
            mouthPressLeftValue = Math.min( ( ( mouthPressLeftScore - mouthDeadzone ) / ( 1 - mouthDeadzone ) ) * mouthPressStrength, 1 );
          }
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'mouthPressRight' ) {
          var mouthPressRightScore = categories[ i ].score;
          if ( mouthPressRightScore <= mouthDeadzone ) {
            mouthPressRightValue = 0;
          } else {
            mouthPressRightValue = Math.min( ( ( mouthPressRightScore - mouthDeadzone ) / ( 1 - mouthDeadzone ) ) * mouthPressStrength, 1 );
          }
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'mouthFunnel' ) {
          var mouthFunnelScore = categories[ i ].score;
          if ( mouthFunnelScore <= mouthFunnelDeadzone ) {
            mouthFunnelRawValue = 0;
          } else {
            mouthFunnelRawValue = Math.min( ( ( mouthFunnelScore - mouthFunnelDeadzone ) / ( 1 - mouthFunnelDeadzone ) ) * mouthFunnelStrength, 1 );
          }
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'mouthPucker' ) {
          var mouthPuckerScore = categories[ i ].score;
          if ( mouthPuckerScore <= mouthPuckerDeadzone ) {
            mouthPuckerRawValue = 0;
          } else {
            mouthPuckerRawValue = Math.min( ( ( mouthPuckerScore - mouthPuckerDeadzone ) / ( 1 - mouthPuckerDeadzone ) ) * mouthPuckerStrength, 1 );
          }
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'mouthRollLower' ) {
          var mouthRollLowerScore = categories[ i ].score;
          if ( mouthRollLowerScore <= mouthDeadzone ) {
            mouthRollLowerValue = 0;
          } else {
            mouthRollLowerValue = Math.min( ( ( mouthRollLowerScore - mouthDeadzone ) / ( 1 - mouthDeadzone ) ), 1 );
          }
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'mouthRollUpper' ) {
          var mouthRollUpperScore = categories[ i ].score;
          if ( mouthRollUpperScore <= mouthDeadzone ) {
            mouthRollUpperValue = 0;
          } else {
            mouthRollUpperValue = Math.min( ( ( mouthRollUpperScore - mouthDeadzone ) / ( 1 - mouthDeadzone ) ), 1 );
          }
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'mouthLowerDownLeft' ) {
          var mouthLowerDownLeftScore = categories[ i ].score;
          if ( mouthLowerDownLeftScore <= mouthDeadzone ) {
            mouthLowerDownLeftValue = 0;
          } else {
            mouthLowerDownLeftValue = Math.min( ( ( mouthLowerDownLeftScore - mouthDeadzone ) / ( 1 - mouthDeadzone ) ) * lowerDownStrength, 1 );
          }
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'mouthLowerDownRight' ) {
          var mouthLowerDownRightScore = categories[ i ].score;
          if ( mouthLowerDownRightScore <= mouthDeadzone ) {
            mouthLowerDownRightValue = 0;
          } else {
            mouthLowerDownRightValue = Math.min( ( ( mouthLowerDownRightScore - mouthDeadzone ) / ( 1 - mouthDeadzone ) ) * lowerDownStrength, 1 );
          }
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'jawLeft' ) {
          var jawLeftScore = categories[ i ].score;
          if ( jawLeftScore <= jawLeftDeadzone ) {
            jawLeftValue = 0;
          } else {
            jawLeftValue = Math.min( ( ( jawLeftScore - jawLeftDeadzone ) / ( 1 - jawLeftDeadzone ) ) * jawLeftStrength, 1 );
          }
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'jawRight' ) {
          var jawRightScore = categories[ i ].score;
          jawRightValue = Math.min( jawRightScore * jawRightStrength, 1 );
          if ( jawRightScore > jawRightMinThreshold ) {
            jawRightValue = Math.max( jawRightValue, jawRightMinValue );
          }
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'cheekPuff' ) {
          var cheekPuffScore = categories[ i ].score;
          if ( cheekPuffScore <= cheekPuffDeadzone ) {
            cheekPuffRawValue = 0;
          } else {
            cheekPuffRawValue = Math.min( ( ( cheekPuffScore - cheekPuffDeadzone ) / ( 1 - cheekPuffDeadzone ) ) * cheekPuffStrength, 1 );
          }
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'mouthStretchLeft' ) {
          var mouthStretchLeftScore = categories[ i ].score;
          if ( mouthStretchLeftScore <= mouthDeadzone ) {
            mouthStretchLeftValue = 0;
          } else {
            mouthStretchLeftValue = Math.min( ( ( mouthStretchLeftScore - mouthDeadzone ) / ( 1 - mouthDeadzone ) ) * mouthStretchStrength, 1 );
          }
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'mouthStretchRight' ) {
          var mouthStretchRightScore = categories[ i ].score;
          if ( mouthStretchRightScore <= mouthDeadzone ) {
            mouthStretchRightValue = 0;
          } else {
            mouthStretchRightValue = Math.min( ( ( mouthStretchRightScore - mouthDeadzone ) / ( 1 - mouthDeadzone ) ) * mouthStretchStrength, 1 );
          }
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'mouthUpperUpLeft' ) {
          var mouthUpperUpLeftScore = categories[ i ].score;
          if ( mouthUpperUpLeftScore <= mouthDeadzone ) {
            mouthUpperUpLeftValue = 0;
          } else {
            mouthUpperUpLeftValue = Math.min( ( ( mouthUpperUpLeftScore - mouthDeadzone ) / ( 1 - mouthDeadzone ) ) * mouthUpperUpLeftStrength, 1 );
          }
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'mouthUpperUpRight' ) {
          var mouthUpperUpRightScore = categories[ i ].score;
          if ( mouthUpperUpRightScore <= mouthDeadzone ) {
            mouthUpperUpRightValue = 0;
          } else {
            mouthUpperUpRightValue = Math.min( ( ( mouthUpperUpRightScore - mouthDeadzone ) / ( 1 - mouthDeadzone ) ) * mouthUpperUpRightStrength, 1 );
          }
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'browInnerUp' ) {
          browInnerUpValue = Math.min( categories[ i ].score * browStrength, 1 );
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'browOuterUpLeft' ) {
          browOuterUpLeftValue = Math.min( categories[ i ].score * browStrength, 1 );
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'browOuterUpRight' ) {
          browOuterUpRightValue = Math.min( categories[ i ].score * browStrength, 1 );
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'browDownLeft' ) {
          browDownLeftValue = Math.min( categories[ i ].score * browFrownStrength, 1 );
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'browDownRight' ) {
          browDownRightValue = Math.min( categories[ i ].score * browFrownStrength, 1 );
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'cheekSquintLeft' ) {
          cheekSquintLeftValue = Math.min( categories[ i ].score * cheekSquintStrength, 1 );
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'cheekSquintRight' ) {
          cheekSquintRightValue = Math.min( categories[ i ].score * cheekSquintStrength, 1 );
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'eyeSquintLeft' ) {
          eyeSquintLeftValue = categories[ i ].score;
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'eyeSquintRight' ) {
          eyeSquintRightValue = categories[ i ].score;
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'mouthClose' ) {
          mouthCloseValue = categories[ i ].score;
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'jawForward' ) {
          jawForwardValue = categories[ i ].score;
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'mouthDimpleLeft' ) {
          mouthDimpleLeftValue = categories[ i ].score;
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'mouthDimpleRight' ) {
          mouthDimpleRightValue = categories[ i ].score;
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'mouthFrownLeft' ) {
          mouthFrownLeftValue = categories[ i ].score;
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'mouthFrownRight' ) {
          mouthFrownRightValue = categories[ i ].score;
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'mouthLeft' ) {
          mouthLeftValue = categories[ i ].score;
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'mouthRight' ) {
          mouthRightValue = categories[ i ].score;
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'mouthShrugLower' ) {
          mouthShrugLowerValue = categories[ i ].score;
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'mouthShrugUpper' ) {
          mouthShrugUpperValue = categories[ i ].score;
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'noseSneerLeft' ) {
          noseSneerLeftValue = categories[ i ].score;
          faceDetected = true;
        } else if ( categories[ i ].categoryName === 'noseSneerRight' ) {
          noseSneerRightValue = categories[ i ].score;
          faceDetected = true;
        }
      }

      if ( lastFaceLandmarks && lastFaceLandmarks.length ) {
        var landmarks = lastFaceLandmarks[ 0 ];
        var allowCheekBaseline = jawOpenValue < 0.1 && mouthPuckerRawValue < 0.2 && mouthFunnelRawValue < 0.2;
        cheekPuffProxyValue = computeCheekPuffProxy( landmarks, allowCheekBaseline );
      } else {
        cheekPuffProxyValue = 0;
      }

      if ( cheekPuffRawValue < 0.05 && cheekPuffProxyValue > cheekPuffProxyMinThreshold ) {
        var proxyClamped = ( cheekPuffProxyValue - cheekPuffProxyMinThreshold ) / ( 1 - cheekPuffProxyMinThreshold );
        cheekPuffRawValue = Math.max( cheekPuffRawValue, proxyClamped * cheekPuffStrength );
      }


      var puckerApertureValue = mouthPuckerRawValue;
      var funnelApertureValue = mouthFunnelRawValue;
      poutRawValue = Math.max( puckerApertureValue, funnelApertureValue );
      rollRawValue = ( mouthRollLowerValue + mouthRollUpperValue ) * 0.5;
      lowerDownRawValue = ( mouthLowerDownLeftValue + mouthLowerDownRightValue ) * 0.5;

      var jawDiminish = 1 - Math.min( Math.max( jawOpenValue, 0 ), 1 );
      poutRawValue *= jawDiminish;
      puckerApertureValue *= jawDiminish;
      funnelApertureValue *= jawDiminish;
      rollRawValue *= jawDiminish;
      lowerDownRawValue *= jawDiminish;
      cheekPuffRawValue *= jawDiminish;

      // Suppress pucker when head is pitched down — MediaPipe false positive
      var phRangeRad = headRotationRangeDeg * Math.PI / 180;
      var normPitchDown = clamp( -headPosePitch / phRangeRad, 0, 1 );
      if ( normPitchDown > 0.1 ) {
        var pitchSuppress = clamp( 1 - ( normPitchDown - 0.1 ) / 0.35, 0, 1 );
        puckerApertureValue *= pitchSuppress;
        mouthPuckerRawValue *= pitchSuppress;
      }

      mouthPuckerFiltered += ( puckerApertureValue - mouthPuckerFiltered ) * puckerInputSmoothing;

      var effectiveJawOpen = Math.max( 0, jawOpenValue - jawLipOffset );

      if ( jawOpenValue > jawOpenPuckerHardBlock || effectiveJawOpen > jawOpenPuckerBlock ) {
        puckerActive = false;
        puckerCandidateSince = 0;
      } else if ( mouthPuckerFiltered >= mouthPuckerActivate ) {
        if ( puckerCandidateSince === 0 ) {
          puckerCandidateSince = time;
        }
        if ( time - puckerCandidateSince >= puckerMinHoldMs ) {
          puckerActive = true;
        }
      } else if ( mouthPuckerFiltered <= mouthPuckerRelease ) {
        puckerActive = false;
        puckerCandidateSince = 0;
      }

      if ( mouthPuckerRawValue < puckerClearThreshold && mouthFunnelRawValue < puckerClearThreshold && rollRawValue < puckerClearThreshold ) {
        puckerActive = false;
        puckerCandidateSince = 0;
      }

      var puckerFinalValue = 0;
      if ( jawLeftValue > 0.05 || jawRightValue > 0.05 ) {
        puckerActive = false;
        puckerCandidateSince = 0;
      }

      if ( ! puckerActive ) {
        puckerFinalValue = 0;
      } else if ( effectiveJawOpen > 0 ) {
        puckerFinalValue = puckerApertureValue * ( 1 - effectiveJawOpen );
      } else {
        puckerFinalValue = puckerApertureValue;
      }

      if ( puckerFinalValue > 0 ) {
        puckerFinalValue = Math.pow( puckerFinalValue, mouthPuckerCurve );
      }
      poutFinalValue = puckerFinalValue;

      if ( puckerActive ) {
        jawOpenValue *= puckerJawSuppression;
      }

      var funnelFinalValue = Math.min( Math.max( funnelApertureValue, 0 ), 1 );
      lowerDownFinalValue = Math.min( Math.max( lowerDownRawValue, 0 ), 1 );
      rollFinalValue = Math.min( Math.max( rollRawValue * 0.25, 0 ), 0.3 );
      if ( puckerFinalValue > 0 ) {
        rollFinalValue = Math.max( rollFinalValue, Math.min( puckerFinalValue * 0.5, 0.3 ) );
      }
      cheekPuffFinalValue = 0; // disabled — MediaPipe cheekPuff unreliable via webcam

      // Suppress cheekPuff when mouth pucker/funnel are active (MediaPipe cross-talk)
      var mouthActivity = Math.max( mouthPuckerRawValue, mouthFunnelRawValue );
      if ( mouthActivity > 0.15 ) {
        var suppression = 1 - smoothstep( 0.15, 0.5, mouthActivity );
        cheekPuffFinalValue *= suppression;
      }

      mouthPuckerValue = puckerFinalValue;
      mouthFunnelValue = funnelFinalValue;
    }

  }

  // Wink cross-talk suppression: when one eye closes much more, suppress the other
  var winkBlinkL = eyeBlinkValue;
  var winkBlinkR = eyeBlinkRightValue;
  var winkDiff = Math.abs( winkBlinkL - winkBlinkR );
  if ( winkDiff > 0.12 ) {
    var winkSup = smoothstep( 0.12, 0.45, winkDiff );
    if ( winkBlinkL > winkBlinkR ) {
      eyeBlinkRightValue *= ( 1 - winkSup );
    } else {
      eyeBlinkValue *= ( 1 - winkSup );
    }
  }

  if ( FBHeadMesh && FBHeadMesh.morphTargetInfluences ) {
    var targetBlink = faceDetected ? eyeBlinkValue : 0;
    var currentBlink = morphStates[ 0 ];
    var targetBlinkRight = faceDetected ? eyeBlinkRightValue : 0;
    var currentBlinkRight = morphStates[ 1 ];
    var targetEyeWideLeft = faceDetected ? eyeWideLeftValue : 0;
    var targetEyeWideRight = faceDetected ? eyeWideRightValue : 0;
    var currentEyeWideLeft = null;
    var currentEyeWideRight = null;
    var targetJawOpen = faceDetected ? jawOpenValue : 0;
    var currentJawOpen = null;
    var smileJawGate = 1 - smoothstep( 0.05, 0.15, jawOpenValue );
    var targetSmileLeft = faceDetected ? Math.pow( smileLeftValue, 0.85 ) * smileJawGate : 0;
    var targetSmileRight = faceDetected ? Math.pow( smileRightValue, 0.85 ) * smileJawGate : 0;
    var currentSmileLeft = null;
    var currentSmileRight = null;
    var targetMouthPressLeft = faceDetected ? mouthPressLeftValue : 0;
    var targetMouthPressRight = faceDetected ? mouthPressRightValue : 0;
    var smileLevel = Math.max( targetSmileLeft, targetSmileRight );
    var pressFade = 1 - smoothstep( 0.35, 0.75, smileLevel );
    targetMouthPressLeft *= pressFade;
    targetMouthPressRight *= pressFade;
    var currentMouthPressLeft = null;
    var currentMouthPressRight = null;
    var targetMouthPucker = faceDetected ? Math.min( mouthPuckerValue * 0.7, 1 ) : 0;
    var targetMouthFunnel = faceDetected ? Math.min( mouthFunnelValue * 0.55, 0.25 ) : 0;
    var currentMouthPout = null;
    var currentMouthFunnel = null;
    var currentMouthRollLower = null;
    var currentMouthRollUpper = null;
    var targetMouthRoll = faceDetected ? rollFinalValue : 0;
    var targetLowerDown = faceDetected ? lowerDownFinalValue : 0;
    var currentLowerDownLeft = null;
    var currentLowerDownRight = null;
    var targetMouthStretchLeft = faceDetected ? mouthStretchLeftValue : 0;
    var targetMouthStretchRight = faceDetected ? mouthStretchRightValue : 0;
    var currentMouthStretchLeft = null;
    var currentMouthStretchRight = null;
    var targetMouthUpperUpLeft = faceDetected ? mouthUpperUpLeftValue : 0;
    var targetMouthUpperUpRight = faceDetected ? mouthUpperUpRightValue : 0;
    var currentMouthUpperUpLeft = null;
    var currentMouthUpperUpRight = null;
    var targetMouthUpperUp = faceDetected ? ( mouthUpperUpLeftValue + mouthUpperUpRightValue ) * 0.5 : 0;
    var currentMouthUpperUp = null;
    var targetBrowInnerUp = faceDetected ? browInnerUpValue : 0;
    var targetBrowOuterUpLeft = faceDetected ? browOuterUpLeftValue : 0;
    var targetBrowOuterUpRight = faceDetected ? browOuterUpRightValue : 0;
    var targetBrowDownLeft = faceDetected ? browDownLeftValue : 0;
    var targetBrowDownRight = faceDetected ? browDownRightValue : 0;
    var currentBrowInnerUp = null;
    var currentBrowOuterUpLeft = null;
    var currentBrowOuterUpRight = null;
    var currentBrowDownLeft = null;
    var currentBrowDownRight = null;
    var targetCheekPuff = faceDetected ? cheekPuffFinalValue : 0;
    var currentCheekPuff = null;
    var targetCheekSquintLeft = faceDetected ? cheekSquintLeftValue : 0;
    var targetCheekSquintRight = faceDetected ? cheekSquintRightValue : 0;
    var currentCheekSquintLeft = null;
    var currentCheekSquintRight = null;
    var targetEyeSquintLeft = faceDetected ? eyeSquintLeftValue : 0;
    var targetEyeSquintRight = faceDetected ? eyeSquintRightValue : 0;
    var targetMouthClose = faceDetected ? mouthCloseValue : 0;
    var targetJawForward = faceDetected ? jawForwardValue : 0;
    var targetMouthDimpleLeft = faceDetected ? mouthDimpleLeftValue : 0;
    var targetMouthDimpleRight = faceDetected ? mouthDimpleRightValue : 0;
    var targetMouthFrownLeft = faceDetected ? mouthFrownLeftValue : 0;
    var targetMouthFrownRight = faceDetected ? mouthFrownRightValue : 0;
    var targetMouthLeft = faceDetected ? mouthLeftValue : 0;
    var targetMouthRight = faceDetected ? mouthRightValue : 0;
    var targetMouthShrugLower = faceDetected ? mouthShrugLowerValue : 0;
    var targetMouthShrugUpper = faceDetected ? mouthShrugUpperValue : 0;
    var targetNoseSneerLeft = faceDetected ? noseSneerLeftValue : 0;
    var targetNoseSneerRight = faceDetected ? noseSneerRightValue : 0;
    var targetJawLeft = faceDetected ? jawLeftValue : 0;
    var targetJawRight = faceDetected ? jawRightValue : 0;
    var currentJawLeft = null;
    var currentJawRight = null;
    if ( cheekPuffLogCounter % 30 === 0 ) {
      console.log( 'cheekPuff raw score:', formatScore( getBlendshapeScore( 'cheekPuff' ) ), 'jawRight raw score:', formatScore( getBlendshapeScore( 'jawRight' ) ) );
    }
    cheekPuffLogCounter++;
    var upperLipJawGate = smoothstep( 0.0, 0.15, jawOpenValue );
    targetMouthUpperUpLeft *= upperLipJawGate;
    targetMouthUpperUpRight *= upperLipJawGate;
    targetMouthUpperUp *= upperLipJawGate;

    if ( currentBlink === undefined ) {
      currentBlink = FBHeadMesh.morphTargetInfluences[ 0 ] || 0;
    }

    currentBlink += ( targetBlink - currentBlink ) * smoothingFactor;
    morphStates[ 0 ] = currentBlink;
    FBHeadMesh.morphTargetInfluences[ 0 ] = currentBlink;

    if ( currentBlinkRight === undefined ) {
      currentBlinkRight = FBHeadMesh.morphTargetInfluences[ 1 ] || 0;
    }

    currentBlinkRight += ( targetBlinkRight - currentBlinkRight ) * smoothingFactor;
    morphStates[ 1 ] = currentBlinkRight;
    FBHeadMesh.morphTargetInfluences[ 1 ] = currentBlinkRight;

    if ( eyeWideLeftMorphIndex !== null && eyeWideLeftMorphIndex !== undefined ) {
      currentEyeWideLeft = morphStates[ eyeWideLeftMorphIndex ];
      if ( currentEyeWideLeft === undefined ) {
        currentEyeWideLeft = FBHeadMesh.morphTargetInfluences[ eyeWideLeftMorphIndex ] || 0;
      }
      currentEyeWideLeft += ( targetEyeWideLeft - currentEyeWideLeft ) * smoothingFactor;
      morphStates[ eyeWideLeftMorphIndex ] = currentEyeWideLeft;
      FBHeadMesh.morphTargetInfluences[ eyeWideLeftMorphIndex ] = currentEyeWideLeft;
    }

    if ( eyeWideRightMorphIndex !== null && eyeWideRightMorphIndex !== undefined ) {
      currentEyeWideRight = morphStates[ eyeWideRightMorphIndex ];
      if ( currentEyeWideRight === undefined ) {
        currentEyeWideRight = FBHeadMesh.morphTargetInfluences[ eyeWideRightMorphIndex ] || 0;
      }
      currentEyeWideRight += ( targetEyeWideRight - currentEyeWideRight ) * smoothingFactor;
      morphStates[ eyeWideRightMorphIndex ] = currentEyeWideRight;
      FBHeadMesh.morphTargetInfluences[ eyeWideRightMorphIndex ] = currentEyeWideRight;
    }

    if ( jawOpenMorphIndex !== null && jawOpenMorphIndex !== undefined ) {
      currentJawOpen = morphStates[ jawOpenMorphIndex ];
      if ( currentJawOpen === undefined ) {
        currentJawOpen = FBHeadMesh.morphTargetInfluences[ jawOpenMorphIndex ] || 0;
      }
      var jawSmoothing = targetJawOpen >= currentJawOpen ? jawSmoothingOpen : jawSmoothingClose;
      currentJawOpen += ( targetJawOpen - currentJawOpen ) * jawSmoothing;
      morphStates[ jawOpenMorphIndex ] = currentJawOpen;
      FBHeadMesh.morphTargetInfluences[ jawOpenMorphIndex ] = currentJawOpen;
    }

    if ( smileLeftMorphIndex !== null && smileLeftMorphIndex !== undefined ) {
      currentSmileLeft = morphStates[ smileLeftMorphIndex ];
      if ( currentSmileLeft === undefined ) {
        currentSmileLeft = FBHeadMesh.morphTargetInfluences[ smileLeftMorphIndex ] || 0;
      }
      currentSmileLeft += ( targetSmileLeft - currentSmileLeft ) * mouthSmoothingFactor;
      morphStates[ smileLeftMorphIndex ] = currentSmileLeft;
      FBHeadMesh.morphTargetInfluences[ smileLeftMorphIndex ] = currentSmileLeft;
    }

    if ( smileRightMorphIndex !== null && smileRightMorphIndex !== undefined ) {
      currentSmileRight = morphStates[ smileRightMorphIndex ];
      if ( currentSmileRight === undefined ) {
        currentSmileRight = FBHeadMesh.morphTargetInfluences[ smileRightMorphIndex ] || 0;
      }
      currentSmileRight += ( targetSmileRight - currentSmileRight ) * mouthSmoothingFactor;
      morphStates[ smileRightMorphIndex ] = currentSmileRight;
      FBHeadMesh.morphTargetInfluences[ smileRightMorphIndex ] = currentSmileRight;
    }

    if ( mouthPressLeftMorphIndex !== null && mouthPressLeftMorphIndex !== undefined ) {
      currentMouthPressLeft = morphStates[ mouthPressLeftMorphIndex ];
      if ( currentMouthPressLeft === undefined ) {
        currentMouthPressLeft = FBHeadMesh.morphTargetInfluences[ mouthPressLeftMorphIndex ] || 0;
      }
      currentMouthPressLeft += ( targetMouthPressLeft - currentMouthPressLeft ) * mouthSmoothingFactor;
      morphStates[ mouthPressLeftMorphIndex ] = currentMouthPressLeft;
      FBHeadMesh.morphTargetInfluences[ mouthPressLeftMorphIndex ] = currentMouthPressLeft;
    }

    if ( mouthPressRightMorphIndex !== null && mouthPressRightMorphIndex !== undefined ) {
      currentMouthPressRight = morphStates[ mouthPressRightMorphIndex ];
      if ( currentMouthPressRight === undefined ) {
        currentMouthPressRight = FBHeadMesh.morphTargetInfluences[ mouthPressRightMorphIndex ] || 0;
      }
      currentMouthPressRight += ( targetMouthPressRight - currentMouthPressRight ) * mouthSmoothingFactor;
      morphStates[ mouthPressRightMorphIndex ] = currentMouthPressRight;
      FBHeadMesh.morphTargetInfluences[ mouthPressRightMorphIndex ] = currentMouthPressRight;
    }

    if ( mouthPuckerMorphIndex !== null && mouthPuckerMorphIndex !== undefined ) {
      currentMouthPout = morphStates[ mouthPuckerMorphIndex ];
      if ( currentMouthPout === undefined ) {
        currentMouthPout = FBHeadMesh.morphTargetInfluences[ mouthPuckerMorphIndex ] || 0;
      }
      var poutSmoothing = targetMouthPucker >= currentMouthPout ? puckerSmoothingIn : puckerSmoothingOut;
      currentMouthPout += ( targetMouthPucker - currentMouthPout ) * poutSmoothing;
      morphStates[ mouthPuckerMorphIndex ] = currentMouthPout;
      FBHeadMesh.morphTargetInfluences[ mouthPuckerMorphIndex ] = currentMouthPout;
    }

    if ( mouthFunnelMorphIndex !== null && mouthFunnelMorphIndex !== undefined ) {
      currentMouthFunnel = morphStates[ mouthFunnelMorphIndex ];
      if ( currentMouthFunnel === undefined ) {
        currentMouthFunnel = FBHeadMesh.morphTargetInfluences[ mouthFunnelMorphIndex ] || 0;
      }
      var funnelSmoothing = targetMouthFunnel >= currentMouthFunnel ? puckerSmoothingIn : puckerSmoothingOut;
      currentMouthFunnel += ( targetMouthFunnel - currentMouthFunnel ) * funnelSmoothing;
      morphStates[ mouthFunnelMorphIndex ] = currentMouthFunnel;
      FBHeadMesh.morphTargetInfluences[ mouthFunnelMorphIndex ] = currentMouthFunnel;
    }

    if ( mouthRollLowerMorphIndex !== null && mouthRollLowerMorphIndex !== undefined ) {
      currentMouthRollLower = morphStates[ mouthRollLowerMorphIndex ];
      if ( currentMouthRollLower === undefined ) {
        currentMouthRollLower = FBHeadMesh.morphTargetInfluences[ mouthRollLowerMorphIndex ] || 0;
      }
      var rollLowerSmoothing = targetMouthRoll >= currentMouthRollLower ? puckerSmoothingIn : puckerSmoothingOut;
      currentMouthRollLower += ( targetMouthRoll - currentMouthRollLower ) * rollLowerSmoothing;
      morphStates[ mouthRollLowerMorphIndex ] = currentMouthRollLower;
      FBHeadMesh.morphTargetInfluences[ mouthRollLowerMorphIndex ] = currentMouthRollLower;
    }

    if ( mouthRollUpperMorphIndex !== null && mouthRollUpperMorphIndex !== undefined ) {
      currentMouthRollUpper = morphStates[ mouthRollUpperMorphIndex ];
      if ( currentMouthRollUpper === undefined ) {
        currentMouthRollUpper = FBHeadMesh.morphTargetInfluences[ mouthRollUpperMorphIndex ] || 0;
      }
      var rollUpperSmoothing = targetMouthRoll >= currentMouthRollUpper ? puckerSmoothingIn : puckerSmoothingOut;
      currentMouthRollUpper += ( targetMouthRoll - currentMouthRollUpper ) * rollUpperSmoothing;
      morphStates[ mouthRollUpperMorphIndex ] = currentMouthRollUpper;
      FBHeadMesh.morphTargetInfluences[ mouthRollUpperMorphIndex ] = currentMouthRollUpper;
    }

    if ( mouthLowerDownLeftMorphIndex !== null && mouthLowerDownLeftMorphIndex !== undefined ) {
      currentLowerDownLeft = morphStates[ mouthLowerDownLeftMorphIndex ];
      if ( currentLowerDownLeft === undefined ) {
        currentLowerDownLeft = FBHeadMesh.morphTargetInfluences[ mouthLowerDownLeftMorphIndex ] || 0;
      }
      currentLowerDownLeft += ( targetLowerDown - currentLowerDownLeft ) * mouthSmoothingFactor;
      morphStates[ mouthLowerDownLeftMorphIndex ] = currentLowerDownLeft;
      FBHeadMesh.morphTargetInfluences[ mouthLowerDownLeftMorphIndex ] = currentLowerDownLeft;
    }

    if ( mouthLowerDownRightMorphIndex !== null && mouthLowerDownRightMorphIndex !== undefined ) {
      currentLowerDownRight = morphStates[ mouthLowerDownRightMorphIndex ];
      if ( currentLowerDownRight === undefined ) {
        currentLowerDownRight = FBHeadMesh.morphTargetInfluences[ mouthLowerDownRightMorphIndex ] || 0;
      }
      currentLowerDownRight += ( targetLowerDown - currentLowerDownRight ) * mouthSmoothingFactor;
      morphStates[ mouthLowerDownRightMorphIndex ] = currentLowerDownRight;
      FBHeadMesh.morphTargetInfluences[ mouthLowerDownRightMorphIndex ] = currentLowerDownRight;
    }

    if ( jawLeftMorphIndex !== null && jawLeftMorphIndex !== undefined ) {
      currentJawLeft = morphStates[ jawLeftMorphIndex ];
      if ( currentJawLeft === undefined ) {
        currentJawLeft = FBHeadMesh.morphTargetInfluences[ jawLeftMorphIndex ] || 0;
      }
      currentJawLeft += ( targetJawLeft - currentJawLeft ) * mouthSmoothingFactor;
      morphStates[ jawLeftMorphIndex ] = currentJawLeft;
      FBHeadMesh.morphTargetInfluences[ jawLeftMorphIndex ] = currentJawLeft;
    }

    if ( jawRightMorphIndex !== null && jawRightMorphIndex !== undefined ) {
      currentJawRight = morphStates[ jawRightMorphIndex ];
      if ( currentJawRight === undefined ) {
        currentJawRight = FBHeadMesh.morphTargetInfluences[ jawRightMorphIndex ] || 0;
      }
      currentJawRight += ( targetJawRight - currentJawRight ) * mouthSmoothingFactor;
      morphStates[ jawRightMorphIndex ] = currentJawRight;
      FBHeadMesh.morphTargetInfluences[ jawRightMorphIndex ] = currentJawRight;
    }

    if ( cheekPuffMorphIndex !== null && cheekPuffMorphIndex !== undefined ) {
      currentCheekPuff = morphStates[ cheekPuffMorphIndex ];
      if ( currentCheekPuff === undefined ) {
        currentCheekPuff = FBHeadMesh.morphTargetInfluences[ cheekPuffMorphIndex ] || 0;
      }
      currentCheekPuff += ( targetCheekPuff - currentCheekPuff ) * mouthSmoothingFactor;
      morphStates[ cheekPuffMorphIndex ] = currentCheekPuff;
      FBHeadMesh.morphTargetInfluences[ cheekPuffMorphIndex ] = currentCheekPuff;
    }

    if ( cheekSquintLeftMorphIndex !== null && cheekSquintLeftMorphIndex !== undefined ) {
      currentCheekSquintLeft = morphStates[ cheekSquintLeftMorphIndex ];
      if ( currentCheekSquintLeft === undefined ) {
        currentCheekSquintLeft = FBHeadMesh.morphTargetInfluences[ cheekSquintLeftMorphIndex ] || 0;
      }
      currentCheekSquintLeft += ( targetCheekSquintLeft - currentCheekSquintLeft ) * mouthSmoothingFactor;
      morphStates[ cheekSquintLeftMorphIndex ] = currentCheekSquintLeft;
      FBHeadMesh.morphTargetInfluences[ cheekSquintLeftMorphIndex ] = currentCheekSquintLeft;
    }

    if ( cheekSquintRightMorphIndex !== null && cheekSquintRightMorphIndex !== undefined ) {
      currentCheekSquintRight = morphStates[ cheekSquintRightMorphIndex ];
      if ( currentCheekSquintRight === undefined ) {
        currentCheekSquintRight = FBHeadMesh.morphTargetInfluences[ cheekSquintRightMorphIndex ] || 0;
      }
      currentCheekSquintRight += ( targetCheekSquintRight - currentCheekSquintRight ) * mouthSmoothingFactor;
      morphStates[ cheekSquintRightMorphIndex ] = currentCheekSquintRight;
      FBHeadMesh.morphTargetInfluences[ cheekSquintRightMorphIndex ] = currentCheekSquintRight;
    }

    if ( mouthStretchLeftMorphIndex !== null && mouthStretchLeftMorphIndex !== undefined ) {
      currentMouthStretchLeft = morphStates[ mouthStretchLeftMorphIndex ];
      if ( currentMouthStretchLeft === undefined ) {
        currentMouthStretchLeft = FBHeadMesh.morphTargetInfluences[ mouthStretchLeftMorphIndex ] || 0;
      }
      currentMouthStretchLeft += ( targetMouthStretchLeft - currentMouthStretchLeft ) * mouthSmoothingFactor;
      morphStates[ mouthStretchLeftMorphIndex ] = currentMouthStretchLeft;
      FBHeadMesh.morphTargetInfluences[ mouthStretchLeftMorphIndex ] = currentMouthStretchLeft;
    }

    if ( mouthStretchRightMorphIndex !== null && mouthStretchRightMorphIndex !== undefined ) {
      currentMouthStretchRight = morphStates[ mouthStretchRightMorphIndex ];
      if ( currentMouthStretchRight === undefined ) {
        currentMouthStretchRight = FBHeadMesh.morphTargetInfluences[ mouthStretchRightMorphIndex ] || 0;
      }
      currentMouthStretchRight += ( targetMouthStretchRight - currentMouthStretchRight ) * mouthSmoothingFactor;
      morphStates[ mouthStretchRightMorphIndex ] = currentMouthStretchRight;
      FBHeadMesh.morphTargetInfluences[ mouthStretchRightMorphIndex ] = currentMouthStretchRight;
    }

    if ( mouthUpperUpMorphIndex !== null && mouthUpperUpMorphIndex !== undefined ) {
      currentMouthUpperUp = morphStates[ mouthUpperUpMorphIndex ];
      if ( currentMouthUpperUp === undefined ) {
        currentMouthUpperUp = FBHeadMesh.morphTargetInfluences[ mouthUpperUpMorphIndex ] || 0;
      }
      currentMouthUpperUp += ( targetMouthUpperUp - currentMouthUpperUp ) * mouthSmoothingFactor;
      morphStates[ mouthUpperUpMorphIndex ] = currentMouthUpperUp;
      FBHeadMesh.morphTargetInfluences[ mouthUpperUpMorphIndex ] = currentMouthUpperUp;
    } else {
      if ( mouthUpperUpLeftMorphIndex !== null && mouthUpperUpLeftMorphIndex !== undefined ) {
        currentMouthUpperUpLeft = morphStates[ mouthUpperUpLeftMorphIndex ];
        if ( currentMouthUpperUpLeft === undefined ) {
          currentMouthUpperUpLeft = FBHeadMesh.morphTargetInfluences[ mouthUpperUpLeftMorphIndex ] || 0;
        }
        currentMouthUpperUpLeft += ( targetMouthUpperUpLeft - currentMouthUpperUpLeft ) * mouthSmoothingFactor;
        morphStates[ mouthUpperUpLeftMorphIndex ] = currentMouthUpperUpLeft;
        FBHeadMesh.morphTargetInfluences[ mouthUpperUpLeftMorphIndex ] = currentMouthUpperUpLeft;
      }

      if ( mouthUpperUpRightMorphIndex !== null && mouthUpperUpRightMorphIndex !== undefined ) {
        currentMouthUpperUpRight = morphStates[ mouthUpperUpRightMorphIndex ];
        if ( currentMouthUpperUpRight === undefined ) {
          currentMouthUpperUpRight = FBHeadMesh.morphTargetInfluences[ mouthUpperUpRightMorphIndex ] || 0;
        }
        currentMouthUpperUpRight += ( targetMouthUpperUpRight - currentMouthUpperUpRight ) * mouthSmoothingFactor;
        morphStates[ mouthUpperUpRightMorphIndex ] = currentMouthUpperUpRight;
        FBHeadMesh.morphTargetInfluences[ mouthUpperUpRightMorphIndex ] = currentMouthUpperUpRight;
      }
    }

    if ( browInnerUpMorphIndex !== null && browInnerUpMorphIndex !== undefined ) {
      currentBrowInnerUp = morphStates[ browInnerUpMorphIndex ];
      if ( currentBrowInnerUp === undefined ) {
        currentBrowInnerUp = FBHeadMesh.morphTargetInfluences[ browInnerUpMorphIndex ] || 0;
      }
      currentBrowInnerUp += ( targetBrowInnerUp - currentBrowInnerUp ) * browSmoothingFactor;
      morphStates[ browInnerUpMorphIndex ] = currentBrowInnerUp;
      FBHeadMesh.morphTargetInfluences[ browInnerUpMorphIndex ] = currentBrowInnerUp;
    }

    if ( browOuterUpLeftMorphIndex !== null && browOuterUpLeftMorphIndex !== undefined ) {
      currentBrowOuterUpLeft = morphStates[ browOuterUpLeftMorphIndex ];
      if ( currentBrowOuterUpLeft === undefined ) {
        currentBrowOuterUpLeft = FBHeadMesh.morphTargetInfluences[ browOuterUpLeftMorphIndex ] || 0;
      }
      currentBrowOuterUpLeft += ( targetBrowOuterUpLeft - currentBrowOuterUpLeft ) * browSmoothingFactor;
      morphStates[ browOuterUpLeftMorphIndex ] = currentBrowOuterUpLeft;
      FBHeadMesh.morphTargetInfluences[ browOuterUpLeftMorphIndex ] = currentBrowOuterUpLeft;
    }

    if ( browOuterUpRightMorphIndex !== null && browOuterUpRightMorphIndex !== undefined ) {
      currentBrowOuterUpRight = morphStates[ browOuterUpRightMorphIndex ];
      if ( currentBrowOuterUpRight === undefined ) {
        currentBrowOuterUpRight = FBHeadMesh.morphTargetInfluences[ browOuterUpRightMorphIndex ] || 0;
      }
      currentBrowOuterUpRight += ( targetBrowOuterUpRight - currentBrowOuterUpRight ) * browSmoothingFactor;
      morphStates[ browOuterUpRightMorphIndex ] = currentBrowOuterUpRight;
      FBHeadMesh.morphTargetInfluences[ browOuterUpRightMorphIndex ] = currentBrowOuterUpRight;
    }

    if ( browDownLeftMorphIndex !== null && browDownLeftMorphIndex !== undefined ) {
      currentBrowDownLeft = morphStates[ browDownLeftMorphIndex ];
      if ( currentBrowDownLeft === undefined ) {
        currentBrowDownLeft = FBHeadMesh.morphTargetInfluences[ browDownLeftMorphIndex ] || 0;
      }
      currentBrowDownLeft += ( targetBrowDownLeft - currentBrowDownLeft ) * browSmoothingFactor;
      morphStates[ browDownLeftMorphIndex ] = currentBrowDownLeft;
      FBHeadMesh.morphTargetInfluences[ browDownLeftMorphIndex ] = currentBrowDownLeft;
    }

    if ( browDownRightMorphIndex !== null && browDownRightMorphIndex !== undefined ) {
      currentBrowDownRight = morphStates[ browDownRightMorphIndex ];
      if ( currentBrowDownRight === undefined ) {
        currentBrowDownRight = FBHeadMesh.morphTargetInfluences[ browDownRightMorphIndex ] || 0;
      }
      currentBrowDownRight += ( targetBrowDownRight - currentBrowDownRight ) * browSmoothingFactor;
      morphStates[ browDownRightMorphIndex ] = currentBrowDownRight;
      FBHeadMesh.morphTargetInfluences[ browDownRightMorphIndex ] = currentBrowDownRight;
    }

    // ── Eye squint (indices 2, 3) ──
    var eyeSquintLeftIdx = 2;
    var curEyeSquintLeft = morphStates[ eyeSquintLeftIdx ] || 0;
    curEyeSquintLeft += ( targetEyeSquintLeft - curEyeSquintLeft ) * smoothingFactor;
    morphStates[ eyeSquintLeftIdx ] = curEyeSquintLeft;
    FBHeadMesh.morphTargetInfluences[ eyeSquintLeftIdx ] = curEyeSquintLeft;

    var eyeSquintRightIdx = 3;
    var curEyeSquintRight = morphStates[ eyeSquintRightIdx ] || 0;
    curEyeSquintRight += ( targetEyeSquintRight - curEyeSquintRight ) * smoothingFactor;
    morphStates[ eyeSquintRightIdx ] = curEyeSquintRight;
    FBHeadMesh.morphTargetInfluences[ eyeSquintRightIdx ] = curEyeSquintRight;

    // ── Mouth close (index 20) ──
    var mouthCloseIdx = 20;
    var curMouthClose = morphStates[ mouthCloseIdx ] || 0;
    curMouthClose += ( targetMouthClose - curMouthClose ) * mouthSmoothingFactor;
    morphStates[ mouthCloseIdx ] = curMouthClose;
    FBHeadMesh.morphTargetInfluences[ mouthCloseIdx ] = curMouthClose;

    // ── Jaw forward (index 23) ──
    var jawForwardIdx = 23;
    var curJawForward = morphStates[ jawForwardIdx ] || 0;
    curJawForward += ( targetJawForward - curJawForward ) * mouthSmoothingFactor;
    morphStates[ jawForwardIdx ] = curJawForward;
    FBHeadMesh.morphTargetInfluences[ jawForwardIdx ] = curJawForward;

    // ── Mouth dimple (indices 32, 33) ──
    var mouthDimpleLeftIdx = 32;
    var curMouthDimpleLeft = morphStates[ mouthDimpleLeftIdx ] || 0;
    curMouthDimpleLeft += ( targetMouthDimpleLeft - curMouthDimpleLeft ) * mouthSmoothingFactor;
    morphStates[ mouthDimpleLeftIdx ] = curMouthDimpleLeft;
    FBHeadMesh.morphTargetInfluences[ mouthDimpleLeftIdx ] = curMouthDimpleLeft;

    var mouthDimpleRightIdx = 33;
    var curMouthDimpleRight = morphStates[ mouthDimpleRightIdx ] || 0;
    curMouthDimpleRight += ( targetMouthDimpleRight - curMouthDimpleRight ) * mouthSmoothingFactor;
    morphStates[ mouthDimpleRightIdx ] = curMouthDimpleRight;
    FBHeadMesh.morphTargetInfluences[ mouthDimpleRightIdx ] = curMouthDimpleRight;

    // ── Mouth frown (indices 36, 37) ──
    var mouthFrownLeftIdx = 36;
    var curMouthFrownLeft = morphStates[ mouthFrownLeftIdx ] || 0;
    curMouthFrownLeft += ( targetMouthFrownLeft - curMouthFrownLeft ) * mouthSmoothingFactor;
    morphStates[ mouthFrownLeftIdx ] = curMouthFrownLeft;
    FBHeadMesh.morphTargetInfluences[ mouthFrownLeftIdx ] = curMouthFrownLeft;

    var mouthFrownRightIdx = 37;
    var curMouthFrownRight = morphStates[ mouthFrownRightIdx ] || 0;
    curMouthFrownRight += ( targetMouthFrownRight - curMouthFrownRight ) * mouthSmoothingFactor;
    morphStates[ mouthFrownRightIdx ] = curMouthFrownRight;
    FBHeadMesh.morphTargetInfluences[ mouthFrownRightIdx ] = curMouthFrownRight;

    // ── Mouth left / right (indices 42, 43) ──
    var mouthLeftIdx = 42;
    var curMouthLeft = morphStates[ mouthLeftIdx ] || 0;
    curMouthLeft += ( targetMouthLeft - curMouthLeft ) * mouthSmoothingFactor;
    morphStates[ mouthLeftIdx ] = curMouthLeft;
    FBHeadMesh.morphTargetInfluences[ mouthLeftIdx ] = curMouthLeft;

    var mouthRightIdx = 43;
    var curMouthRight = morphStates[ mouthRightIdx ] || 0;
    curMouthRight += ( targetMouthRight - curMouthRight ) * mouthSmoothingFactor;
    morphStates[ mouthRightIdx ] = curMouthRight;
    FBHeadMesh.morphTargetInfluences[ mouthRightIdx ] = curMouthRight;

    // ── Mouth shrug (indices 44, 45) ──
    var mouthShrugLowerIdx = 44;
    var curMouthShrugLower = morphStates[ mouthShrugLowerIdx ] || 0;
    curMouthShrugLower += ( targetMouthShrugLower - curMouthShrugLower ) * mouthSmoothingFactor;
    morphStates[ mouthShrugLowerIdx ] = curMouthShrugLower;
    FBHeadMesh.morphTargetInfluences[ mouthShrugLowerIdx ] = curMouthShrugLower;

    var mouthShrugUpperIdx = 45;
    var curMouthShrugUpper = morphStates[ mouthShrugUpperIdx ] || 0;
    curMouthShrugUpper += ( targetMouthShrugUpper - curMouthShrugUpper ) * mouthSmoothingFactor;
    morphStates[ mouthShrugUpperIdx ] = curMouthShrugUpper;
    FBHeadMesh.morphTargetInfluences[ mouthShrugUpperIdx ] = curMouthShrugUpper;

    // ── Nose sneer (indices 46, 47) ──
    var noseSneerLeftIdx = 46;
    var curNoseSneerLeft = morphStates[ noseSneerLeftIdx ] || 0;
    curNoseSneerLeft += ( targetNoseSneerLeft - curNoseSneerLeft ) * smoothingFactor;
    morphStates[ noseSneerLeftIdx ] = curNoseSneerLeft;
    FBHeadMesh.morphTargetInfluences[ noseSneerLeftIdx ] = curNoseSneerLeft;

    var noseSneerRightIdx = 47;
    var curNoseSneerRight = morphStates[ noseSneerRightIdx ] || 0;
    curNoseSneerRight += ( targetNoseSneerRight - curNoseSneerRight ) * smoothingFactor;
    morphStates[ noseSneerRightIdx ] = curNoseSneerRight;
    FBHeadMesh.morphTargetInfluences[ noseSneerRightIdx ] = curNoseSneerRight;

  }

  if ( eyeLeftObj || eyeRightObj ) {
    var rangeRad = eyeRotationRangeDeg * Math.PI / 180;
    var verticalLeft = faceDetected ? ( eyeLookDownLeftValue - eyeLookUpLeftValue ) : 0;
    var horizontalLeft = faceDetected ? ( eyeLookInLeftValue - eyeLookOutLeftValue ) : 0;

    var targetLeftX = clamp( verticalLeft * rangeRad, -rangeRad, rangeRad );
    var targetLeftY = clamp( horizontalLeft * rangeRad, -rangeRad, rangeRad );
    var targetRightX = targetLeftX;
    var targetRightY = -targetLeftY;

    if ( eyeLeftObj ) {
      if ( eyeLeftRotX === null ) {
        eyeLeftRotX = 0;
        eyeLeftRotY = 0;
        eyeLeftBaseRotX = eyeLeftObj.rotation.x;
        eyeLeftBaseRotY = eyeLeftObj.rotation.y;
        eyeLeftBaseRotZ = eyeLeftObj.rotation.z;
      }
      eyeLeftRotX += ( targetLeftX - eyeLeftRotX ) * eyeRotationSmoothing;
      eyeLeftRotY += ( targetLeftY - eyeLeftRotY ) * eyeRotationSmoothing;
      eyeLeftObj.rotation.x = eyeLeftBaseRotX + eyeLeftRotX + ( eyeLeftPitchOffsetDeg * Math.PI / 180 );
      eyeLeftObj.rotation.y = eyeLeftBaseRotY + eyeLeftRotY;
      eyeLeftObj.rotation.z = eyeLeftBaseRotZ;
    }

    if ( eyeRightObj ) {
      if ( eyeRightRotX === null ) {
        eyeRightRotX = 0;
        eyeRightRotY = 0;
        eyeRightBaseRotX = eyeRightObj.rotation.x;
        eyeRightBaseRotY = eyeRightObj.rotation.y;
        eyeRightBaseRotZ = eyeRightObj.rotation.z;
      }
      eyeRightRotX += ( targetRightX - eyeRightRotX ) * eyeRotationSmoothing;
      eyeRightRotY += ( targetRightY - eyeRightRotY ) * eyeRotationSmoothing;
      eyeRightObj.rotation.x = eyeRightBaseRotX + eyeRightRotX + ( eyeRightPitchOffsetDeg * Math.PI / 180 );
      eyeRightObj.rotation.y = eyeRightBaseRotY + eyeRightRotY;
      eyeRightObj.rotation.z = eyeRightBaseRotZ;
    }
  }

  if ( headGroup && headGroupRestRotation && lastFaceLandmarks && lastFaceLandmarks.length ) {
    var pose = computeHeadPose( lastFaceLandmarks[ 0 ] );
    if ( pose ) {
      headPoseYaw += ( pose.yaw - headPoseYaw ) * headRotationSmoothing;
      headPosePitch += ( pose.pitch - headPosePitch ) * headRotationSmoothing;
      headPoseRoll += ( pose.roll - headPoseRoll ) * headRotationSmoothing;

      headGroup.rotation.y = headGroupRestRotation.y + headPoseYaw;
      headGroup.rotation.x = headGroupRestRotation.x + ( headRestPitchOffsetDeg * Math.PI / 180 ) - headPosePitch;
      headGroup.rotation.z = headGroupRestRotation.z + headPoseRoll;
    }
  }


  // ── UPDATE AUDIO ──
  updateAudio( time - prevTime );

  renderer.render( scene, camera );

  prevTime = time;

}


		this.play = function () {

			startTime = prevTime = performance.now();

			// Start background animation + instrument viz immediately
			initBgAnim();
			initViz();
			function bgLoop( nowMs ) {
				var delta = vizLastFrameTime ? nowMs - vizLastFrameTime : 16;
				vizLastFrameTime = nowMs;
				var dtSec = Math.min( delta / 1000, 0.1 );
				updateViz( delta );
				updateBgAnim( dtSec );
				window.requestAnimationFrame( bgLoop );
			}
			window.requestAnimationFrame( bgLoop );

			document.addEventListener( 'keydown', onKeyDown );
			document.addEventListener( 'keyup', onKeyUp );
			document.addEventListener( 'pointerdown', onPointerDown );
			document.addEventListener( 'pointerup', onPointerUp );
			document.addEventListener( 'pointermove', onPointerMove );
			document.addEventListener( 'pointercancel', onPointerCancel );

			dispatch( events.start, arguments );

			renderer.setAnimationLoop( animate );
			startDebugLoop();

		};

		this.stop = function () {

			document.removeEventListener( 'keydown', onKeyDown );
			document.removeEventListener( 'keyup', onKeyUp );
			document.removeEventListener( 'pointerdown', onPointerDown );
			document.removeEventListener( 'pointerup', onPointerUp );
			document.removeEventListener( 'pointermove', onPointerMove );
			document.removeEventListener( 'pointercancel', onPointerCancel );

			dispatch( events.stop, arguments );

			renderer.setAnimationLoop( null );
			stopDebugLoop();

		};

		this.render = function ( time ) {

			dispatch( events.update, { time: time * 1000, delta: 0 /* TODO */ } );

			renderer.render( scene, camera );

		};

		this.dispose = function () {

			renderer.dispose();

			camera = undefined;
			scene = undefined;

		};

		//

		function onKeyDown( event ) {

			dispatch( events.keydown, event );

		}

		function onKeyUp( event ) {

			dispatch( events.keyup, event );

		}

		function onPointerDown( event ) {

			dispatch( events.pointerdown, event );

		}

		function onPointerUp( event ) {

			dispatch( events.pointerup, event );

		}

		function onPointerMove( event ) {

			dispatch( events.pointermove, event );

		}

		function onPointerCancel( event ) {

			dispatch( events.pointercancel, event );

		}

	}

};

export { APP };
