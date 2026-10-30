import { c as createTokenComponent, u as useToken } from './tokenComponents.JX_18n2r.js';
import { k as createMemo, b as createSignal, a as onCleanup, n as createEffect, p as on, d as delegateEvents, g as getNextElement, i as insert, c as createComponent, y as Show, q as createRenderEffect, s as className, E as setStyleProperty, G as setAttribute, e as runHydrationEvents, O as Index, v as style, t as template, u as use, x as getNextMarker, H as spread, m as mergeProps, C as memo } from './web.fJ3rGgJk.js';
import { w as waitForFrames, b as baseComponent } from './BaseComponent.6jspVmqg.js';
import { g as getSafePosition } from './getSafePosition.RgHcJ5HV.js';

const chart = "_chart_1v3jn_1";
const plot = "_plot_1v3jn_20";
const svg = "_svg_1v3jn_29";
const overlay = "_overlay_1v3jn_35";
const labels = "_labels_1v3jn_43";
const label = "_label_1v3jn_43";
const slice = "_slice_1v3jn_59";
const legend = "_legend_1v3jn_74";
const tooltip = "_tooltip_1v3jn_114";
const pie$1 = "_pie_1v3jn_134";
const donut = "_donut_1v3jn_135";
const bar = "_bar_1v3jn_60";
const line$1 = "_line_1v3jn_137";
const area$1 = "_area_1v3jn_138";
const spider = "_spider_1v3jn_139";
const gridline = "_gridline_1v3jn_173";
const baseline = "_baseline_1v3jn_178";
const hole = "_hole_1v3jn_192";
const styles = {
	chart: chart,
	"chart-top": "_chart-top_1v3jn_7",
	"chart-bottom": "_chart-bottom_1v3jn_10",
	"chart-left": "_chart-left_1v3jn_13",
	"chart-right": "_chart-right_1v3jn_16",
	plot: plot,
	svg: svg,
	overlay: overlay,
	labels: labels,
	label: label,
	slice: slice,
	"bar-mark": "_bar-mark_1v3jn_60",
	"leader-line": "_leader-line_1v3jn_64",
	"is-hovered": "_is-hovered_1v3jn_70",
	legend: legend,
	"legend-top": "_legend-top_1v3jn_81",
	"legend-bottom": "_legend-bottom_1v3jn_81",
	"legend-left": "_legend-left_1v3jn_86",
	"legend-right": "_legend-right_1v3jn_86",
	"legend-entry": "_legend-entry_1v3jn_93",
	"legend-entry-hidden": "_legend-entry-hidden_1v3jn_99",
	"legend-marker": "_legend-marker_1v3jn_102",
	"legend-label": "_legend-label_1v3jn_109",
	tooltip: tooltip,
	"tooltip-label": "_tooltip-label_1v3jn_126",
	"tooltip-value": "_tooltip-value_1v3jn_130",
	pie: pie$1,
	donut: donut,
	bar: bar,
	line: line$1,
	area: area$1,
	spider: spider,
	"series-stroke": "_series-stroke_1v3jn_143",
	"area-fill": "_area-fill_1v3jn_149",
	"spider-shape": "_spider-shape_1v3jn_153",
	"spider-web": "_spider-web_1v3jn_157",
	"spider-spoke": "_spider-spoke_1v3jn_163",
	"series-point": "_series-point_1v3jn_168",
	gridline: gridline,
	baseline: baseline,
	"axis-label": "_axis-label_1v3jn_183",
	hole: hole,
	"hole-value": "_hole-value_1v3jn_202",
	"hole-label": "_hole-label_1v3jn_206"
};

function constant(x) {
  return function constant() {
    return x;
  };
}

const abs = Math.abs;
const atan2 = Math.atan2;
const cos = Math.cos;
const max = Math.max;
const min = Math.min;
const sin = Math.sin;
const sqrt = Math.sqrt;

const epsilon$1 = 1e-12;
const pi$1 = Math.PI;
const halfPi = pi$1 / 2;
const tau$1 = 2 * pi$1;

function acos(x) {
  return x > 1 ? 0 : x < -1 ? pi$1 : Math.acos(x);
}

function asin(x) {
  return x >= 1 ? halfPi : x <= -1 ? -halfPi : Math.asin(x);
}

const pi = Math.PI,
    tau = 2 * pi,
    epsilon = 1e-6,
    tauEpsilon = tau - epsilon;

function append(strings) {
  this._ += strings[0];
  for (let i = 1, n = strings.length; i < n; ++i) {
    this._ += arguments[i] + strings[i];
  }
}

function appendRound(digits) {
  let d = Math.floor(digits);
  if (!(d >= 0)) throw new Error(`invalid digits: ${digits}`);
  if (d > 15) return append;
  const k = 10 ** d;
  return function(strings) {
    this._ += strings[0];
    for (let i = 1, n = strings.length; i < n; ++i) {
      this._ += Math.round(arguments[i] * k) / k + strings[i];
    }
  };
}

class Path {
  constructor(digits) {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null; // end of current subpath
    this._ = "";
    this._append = digits == null ? append : appendRound(digits);
  }
  moveTo(x, y) {
    this._append`M${this._x0 = this._x1 = +x},${this._y0 = this._y1 = +y}`;
  }
  closePath() {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._append`Z`;
    }
  }
  lineTo(x, y) {
    this._append`L${this._x1 = +x},${this._y1 = +y}`;
  }
  quadraticCurveTo(x1, y1, x, y) {
    this._append`Q${+x1},${+y1},${this._x1 = +x},${this._y1 = +y}`;
  }
  bezierCurveTo(x1, y1, x2, y2, x, y) {
    this._append`C${+x1},${+y1},${+x2},${+y2},${this._x1 = +x},${this._y1 = +y}`;
  }
  arcTo(x1, y1, x2, y2, r) {
    x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;

    // Is the radius negative? Error.
    if (r < 0) throw new Error(`negative radius: ${r}`);

    let x0 = this._x1,
        y0 = this._y1,
        x21 = x2 - x1,
        y21 = y2 - y1,
        x01 = x0 - x1,
        y01 = y0 - y1,
        l01_2 = x01 * x01 + y01 * y01;

    // Is this path empty? Move to (x1,y1).
    if (this._x1 === null) {
      this._append`M${this._x1 = x1},${this._y1 = y1}`;
    }

    // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
    else if (!(l01_2 > epsilon));

    // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
    // Equivalently, is (x1,y1) coincident with (x2,y2)?
    // Or, is the radius zero? Line to (x1,y1).
    else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
      this._append`L${this._x1 = x1},${this._y1 = y1}`;
    }

    // Otherwise, draw an arc!
    else {
      let x20 = x2 - x0,
          y20 = y2 - y0,
          l21_2 = x21 * x21 + y21 * y21,
          l20_2 = x20 * x20 + y20 * y20,
          l21 = Math.sqrt(l21_2),
          l01 = Math.sqrt(l01_2),
          l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
          t01 = l / l01,
          t21 = l / l21;

      // If the start tangent is not coincident with (x0,y0), line to.
      if (Math.abs(t01 - 1) > epsilon) {
        this._append`L${x1 + t01 * x01},${y1 + t01 * y01}`;
      }

      this._append`A${r},${r},0,0,${+(y01 * x20 > x01 * y20)},${this._x1 = x1 + t21 * x21},${this._y1 = y1 + t21 * y21}`;
    }
  }
  arc(x, y, r, a0, a1, ccw) {
    x = +x, y = +y, r = +r, ccw = !!ccw;

    // Is the radius negative? Error.
    if (r < 0) throw new Error(`negative radius: ${r}`);

    let dx = r * Math.cos(a0),
        dy = r * Math.sin(a0),
        x0 = x + dx,
        y0 = y + dy,
        cw = 1 ^ ccw,
        da = ccw ? a0 - a1 : a1 - a0;

    // Is this path empty? Move to (x0,y0).
    if (this._x1 === null) {
      this._append`M${x0},${y0}`;
    }

    // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
    else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
      this._append`L${x0},${y0}`;
    }

    // Is this arc empty? We’re done.
    if (!r) return;

    // Does the angle go the wrong way? Flip the direction.
    if (da < 0) da = da % tau + tau;

    // Is this a complete circle? Draw two arcs to complete the circle.
    if (da > tauEpsilon) {
      this._append`A${r},${r},0,1,${cw},${x - dx},${y - dy}A${r},${r},0,1,${cw},${this._x1 = x0},${this._y1 = y0}`;
    }

    // Is this arc non-empty? Draw an arc!
    else if (da > epsilon) {
      this._append`A${r},${r},0,${+(da >= pi)},${cw},${this._x1 = x + r * Math.cos(a1)},${this._y1 = y + r * Math.sin(a1)}`;
    }
  }
  rect(x, y, w, h) {
    this._append`M${this._x0 = this._x1 = +x},${this._y0 = this._y1 = +y}h${w = +w}v${+h}h${-w}Z`;
  }
  toString() {
    return this._;
  }
}

function withPath(shape) {
  let digits = 3;

  shape.digits = function(_) {
    if (!arguments.length) return digits;
    if (_ == null) {
      digits = null;
    } else {
      const d = Math.floor(_);
      if (!(d >= 0)) throw new RangeError(`invalid digits: ${_}`);
      digits = d;
    }
    return shape;
  };

  return () => new Path(digits);
}

function arcInnerRadius(d) {
  return d.innerRadius;
}

function arcOuterRadius(d) {
  return d.outerRadius;
}

function arcStartAngle(d) {
  return d.startAngle;
}

function arcEndAngle(d) {
  return d.endAngle;
}

function arcPadAngle(d) {
  return d && d.padAngle; // Note: optional!
}

function intersect(x0, y0, x1, y1, x2, y2, x3, y3) {
  var x10 = x1 - x0, y10 = y1 - y0,
      x32 = x3 - x2, y32 = y3 - y2,
      t = y32 * x10 - x32 * y10;
  if (t * t < epsilon$1) return;
  t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / t;
  return [x0 + t * x10, y0 + t * y10];
}

// Compute perpendicular offset line of length rc.
// http://mathworld.wolfram.com/Circle-LineIntersection.html
function cornerTangents(x0, y0, x1, y1, r1, rc, cw) {
  var x01 = x0 - x1,
      y01 = y0 - y1,
      lo = (cw ? rc : -rc) / sqrt(x01 * x01 + y01 * y01),
      ox = lo * y01,
      oy = -lo * x01,
      x11 = x0 + ox,
      y11 = y0 + oy,
      x10 = x1 + ox,
      y10 = y1 + oy,
      x00 = (x11 + x10) / 2,
      y00 = (y11 + y10) / 2,
      dx = x10 - x11,
      dy = y10 - y11,
      d2 = dx * dx + dy * dy,
      r = r1 - rc,
      D = x11 * y10 - x10 * y11,
      d = (dy < 0 ? -1 : 1) * sqrt(max(0, r * r * d2 - D * D)),
      cx0 = (D * dy - dx * d) / d2,
      cy0 = (-D * dx - dy * d) / d2,
      cx1 = (D * dy + dx * d) / d2,
      cy1 = (-D * dx + dy * d) / d2,
      dx0 = cx0 - x00,
      dy0 = cy0 - y00,
      dx1 = cx1 - x00,
      dy1 = cy1 - y00;

  // Pick the closer of the two intersection points.
  // TODO Is there a faster way to determine which intersection to use?
  if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;

  return {
    cx: cx0,
    cy: cy0,
    x01: -ox,
    y01: -oy,
    x11: cx0 * (r1 / r - 1),
    y11: cy0 * (r1 / r - 1)
  };
}

function arc() {
  var innerRadius = arcInnerRadius,
      outerRadius = arcOuterRadius,
      cornerRadius = constant(0),
      padRadius = null,
      startAngle = arcStartAngle,
      endAngle = arcEndAngle,
      padAngle = arcPadAngle,
      context = null,
      path = withPath(arc);

  function arc() {
    var buffer,
        r,
        r0 = +innerRadius.apply(this, arguments),
        r1 = +outerRadius.apply(this, arguments),
        a0 = startAngle.apply(this, arguments) - halfPi,
        a1 = endAngle.apply(this, arguments) - halfPi,
        da = abs(a1 - a0),
        cw = a1 > a0;

    if (!context) context = buffer = path();

    // Ensure that the outer radius is always larger than the inner radius.
    if (r1 < r0) r = r1, r1 = r0, r0 = r;

    // Is it a point?
    if (!(r1 > epsilon$1)) context.moveTo(0, 0);

    // Or is it a circle or annulus?
    else if (da > tau$1 - epsilon$1) {
      context.moveTo(r1 * cos(a0), r1 * sin(a0));
      context.arc(0, 0, r1, a0, a1, !cw);
      if (r0 > epsilon$1) {
        context.moveTo(r0 * cos(a1), r0 * sin(a1));
        context.arc(0, 0, r0, a1, a0, cw);
      }
    }

    // Or is it a circular or annular sector?
    else {
      var a01 = a0,
          a11 = a1,
          a00 = a0,
          a10 = a1,
          da0 = da,
          da1 = da,
          ap = padAngle.apply(this, arguments) / 2,
          rp = (ap > epsilon$1) && (padRadius ? +padRadius.apply(this, arguments) : sqrt(r0 * r0 + r1 * r1)),
          rc = min(abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments)),
          rc0 = rc,
          rc1 = rc,
          t0,
          t1;

      // Apply padding? Note that since r1 ≥ r0, da1 ≥ da0.
      if (rp > epsilon$1) {
        var p0 = asin(rp / r0 * sin(ap)),
            p1 = asin(rp / r1 * sin(ap));
        if ((da0 -= p0 * 2) > epsilon$1) p0 *= (cw ? 1 : -1), a00 += p0, a10 -= p0;
        else da0 = 0, a00 = a10 = (a0 + a1) / 2;
        if ((da1 -= p1 * 2) > epsilon$1) p1 *= (cw ? 1 : -1), a01 += p1, a11 -= p1;
        else da1 = 0, a01 = a11 = (a0 + a1) / 2;
      }

      var x01 = r1 * cos(a01),
          y01 = r1 * sin(a01),
          x10 = r0 * cos(a10),
          y10 = r0 * sin(a10);

      // Apply rounded corners?
      if (rc > epsilon$1) {
        var x11 = r1 * cos(a11),
            y11 = r1 * sin(a11),
            x00 = r0 * cos(a00),
            y00 = r0 * sin(a00),
            oc;

        // Restrict the corner radius according to the sector angle. If this
        // intersection fails, it’s probably because the arc is too small, so
        // disable the corner radius entirely.
        if (da < pi$1) {
          if (oc = intersect(x01, y01, x00, y00, x11, y11, x10, y10)) {
            var ax = x01 - oc[0],
                ay = y01 - oc[1],
                bx = x11 - oc[0],
                by = y11 - oc[1],
                kc = 1 / sin(acos((ax * bx + ay * by) / (sqrt(ax * ax + ay * ay) * sqrt(bx * bx + by * by))) / 2),
                lc = sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
            rc0 = min(rc, (r0 - lc) / (kc - 1));
            rc1 = min(rc, (r1 - lc) / (kc + 1));
          } else {
            rc0 = rc1 = 0;
          }
        }
      }

      // Is the sector collapsed to a line?
      if (!(da1 > epsilon$1)) context.moveTo(x01, y01);

      // Does the sector’s outer ring have rounded corners?
      else if (rc1 > epsilon$1) {
        t0 = cornerTangents(x00, y00, x01, y01, r1, rc1, cw);
        t1 = cornerTangents(x11, y11, x10, y10, r1, rc1, cw);

        context.moveTo(t0.cx + t0.x01, t0.cy + t0.y01);

        // Have the corners merged?
        if (rc1 < rc) context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw);

        // Otherwise, draw the two corners and the ring.
        else {
          context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
          context.arc(0, 0, r1, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), !cw);
          context.arc(t1.cx, t1.cy, rc1, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
        }
      }

      // Or is the outer ring just a circular arc?
      else context.moveTo(x01, y01), context.arc(0, 0, r1, a01, a11, !cw);

      // Is there no inner ring, and it’s a circular sector?
      // Or perhaps it’s an annular sector collapsed due to padding?
      if (!(r0 > epsilon$1) || !(da0 > epsilon$1)) context.lineTo(x10, y10);

      // Does the sector’s inner ring (or point) have rounded corners?
      else if (rc0 > epsilon$1) {
        t0 = cornerTangents(x10, y10, x11, y11, r0, -rc0, cw);
        t1 = cornerTangents(x01, y01, x00, y00, r0, -rc0, cw);

        context.lineTo(t0.cx + t0.x01, t0.cy + t0.y01);

        // Have the corners merged?
        if (rc0 < rc) context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw);

        // Otherwise, draw the two corners and the ring.
        else {
          context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
          context.arc(0, 0, r0, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), cw);
          context.arc(t1.cx, t1.cy, rc0, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
        }
      }

      // Or is the inner ring just a circular arc?
      else context.arc(0, 0, r0, a10, a00, cw);
    }

    context.closePath();

    if (buffer) return context = null, buffer + "" || null;
  }

  arc.centroid = function() {
    var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2,
        a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - pi$1 / 2;
    return [cos(a) * r, sin(a) * r];
  };

  arc.innerRadius = function(_) {
    return arguments.length ? (innerRadius = typeof _ === "function" ? _ : constant(+_), arc) : innerRadius;
  };

  arc.outerRadius = function(_) {
    return arguments.length ? (outerRadius = typeof _ === "function" ? _ : constant(+_), arc) : outerRadius;
  };

  arc.cornerRadius = function(_) {
    return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : constant(+_), arc) : cornerRadius;
  };

  arc.padRadius = function(_) {
    return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : constant(+_), arc) : padRadius;
  };

  arc.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant(+_), arc) : startAngle;
  };

  arc.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant(+_), arc) : endAngle;
  };

  arc.padAngle = function(_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant(+_), arc) : padAngle;
  };

  arc.context = function(_) {
    return arguments.length ? ((context = _ == null ? null : _), arc) : context;
  };

  return arc;
}

function array(x) {
  return typeof x === "object" && "length" in x
    ? x // Array, TypedArray, NodeList, array-like
    : Array.from(x); // Map, Set, iterable, string, or anything else
}

function Linear(context) {
  this._context = context;
}

Linear.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
      case 1: this._point = 2; // falls through
      default: this._context.lineTo(x, y); break;
    }
  }
};

function curveLinear(context) {
  return new Linear(context);
}

function x(p) {
  return p[0];
}

function y(p) {
  return p[1];
}

function line(x$1, y$1) {
  var defined = constant(true),
      context = null,
      curve = curveLinear,
      output = null,
      path = withPath(line);

  x$1 = typeof x$1 === "function" ? x$1 : (x$1 === undefined) ? x : constant(x$1);
  y$1 = typeof y$1 === "function" ? y$1 : (y$1 === undefined) ? y : constant(y$1);

  function line(data) {
    var i,
        n = (data = array(data)).length,
        d,
        defined0 = false,
        buffer;

    if (context == null) output = curve(buffer = path());

    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0) output.lineStart();
        else output.lineEnd();
      }
      if (defined0) output.point(+x$1(d, i, data), +y$1(d, i, data));
    }

    if (buffer) return output = null, buffer + "" || null;
  }

  line.x = function(_) {
    return arguments.length ? (x$1 = typeof _ === "function" ? _ : constant(+_), line) : x$1;
  };

  line.y = function(_) {
    return arguments.length ? (y$1 = typeof _ === "function" ? _ : constant(+_), line) : y$1;
  };

  line.defined = function(_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : constant(!!_), line) : defined;
  };

  line.curve = function(_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
  };

  line.context = function(_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
  };

  return line;
}

function area(x0, y0, y1) {
  var x1 = null,
      defined = constant(true),
      context = null,
      curve = curveLinear,
      output = null,
      path = withPath(area);

  x0 = typeof x0 === "function" ? x0 : (x0 === undefined) ? x : constant(+x0);
  y0 = typeof y0 === "function" ? y0 : (y0 === undefined) ? constant(0) : constant(+y0);
  y1 = typeof y1 === "function" ? y1 : (y1 === undefined) ? y : constant(+y1);

  function area(data) {
    var i,
        j,
        k,
        n = (data = array(data)).length,
        d,
        defined0 = false,
        buffer,
        x0z = new Array(n),
        y0z = new Array(n);

    if (context == null) output = curve(buffer = path());

    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0) {
          j = i;
          output.areaStart();
          output.lineStart();
        } else {
          output.lineEnd();
          output.lineStart();
          for (k = i - 1; k >= j; --k) {
            output.point(x0z[k], y0z[k]);
          }
          output.lineEnd();
          output.areaEnd();
        }
      }
      if (defined0) {
        x0z[i] = +x0(d, i, data), y0z[i] = +y0(d, i, data);
        output.point(x1 ? +x1(d, i, data) : x0z[i], y1 ? +y1(d, i, data) : y0z[i]);
      }
    }

    if (buffer) return output = null, buffer + "" || null;
  }

  function arealine() {
    return line().defined(defined).curve(curve).context(context);
  }

  area.x = function(_) {
    return arguments.length ? (x0 = typeof _ === "function" ? _ : constant(+_), x1 = null, area) : x0;
  };

  area.x0 = function(_) {
    return arguments.length ? (x0 = typeof _ === "function" ? _ : constant(+_), area) : x0;
  };

  area.x1 = function(_) {
    return arguments.length ? (x1 = _ == null ? null : typeof _ === "function" ? _ : constant(+_), area) : x1;
  };

  area.y = function(_) {
    return arguments.length ? (y0 = typeof _ === "function" ? _ : constant(+_), y1 = null, area) : y0;
  };

  area.y0 = function(_) {
    return arguments.length ? (y0 = typeof _ === "function" ? _ : constant(+_), area) : y0;
  };

  area.y1 = function(_) {
    return arguments.length ? (y1 = _ == null ? null : typeof _ === "function" ? _ : constant(+_), area) : y1;
  };

  area.lineX0 =
  area.lineY0 = function() {
    return arealine().x(x0).y(y0);
  };

  area.lineY1 = function() {
    return arealine().x(x0).y(y1);
  };

  area.lineX1 = function() {
    return arealine().x(x1).y(y0);
  };

  area.defined = function(_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : constant(!!_), area) : defined;
  };

  area.curve = function(_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), area) : curve;
  };

  area.context = function(_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), area) : context;
  };

  return area;
}

function descending(a, b) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}

function identity(d) {
  return d;
}

function pie() {
  var value = identity,
      sortValues = descending,
      sort = null,
      startAngle = constant(0),
      endAngle = constant(tau$1),
      padAngle = constant(0);

  function pie(data) {
    var i,
        n = (data = array(data)).length,
        j,
        k,
        sum = 0,
        index = new Array(n),
        arcs = new Array(n),
        a0 = +startAngle.apply(this, arguments),
        da = Math.min(tau$1, Math.max(-tau$1, endAngle.apply(this, arguments) - a0)),
        a1,
        p = Math.min(Math.abs(da) / n, padAngle.apply(this, arguments)),
        pa = p * (da < 0 ? -1 : 1),
        v;

    for (i = 0; i < n; ++i) {
      if ((v = arcs[index[i] = i] = +value(data[i], i, data)) > 0) {
        sum += v;
      }
    }

    // Optionally sort the arcs by previously-computed values or by data.
    if (sortValues != null) index.sort(function(i, j) { return sortValues(arcs[i], arcs[j]); });
    else if (sort != null) index.sort(function(i, j) { return sort(data[i], data[j]); });

    // Compute the arcs! They are stored in the original data's order.
    for (i = 0, k = sum ? (da - n * pa) / sum : 0; i < n; ++i, a0 = a1) {
      j = index[i], v = arcs[j], a1 = a0 + (v > 0 ? v * k : 0) + pa, arcs[j] = {
        data: data[j],
        index: i,
        value: v,
        startAngle: a0,
        endAngle: a1,
        padAngle: p
      };
    }

    return arcs;
  }

  pie.value = function(_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : constant(+_), pie) : value;
  };

  pie.sortValues = function(_) {
    return arguments.length ? (sortValues = _, sort = null, pie) : sortValues;
  };

  pie.sort = function(_) {
    return arguments.length ? (sort = _, sortValues = null, pie) : sort;
  };

  pie.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant(+_), pie) : startAngle;
  };

  pie.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant(+_), pie) : endAngle;
  };

  pie.padAngle = function(_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant(+_), pie) : padAngle;
  };

  return pie;
}

function sign(x) {
  return x < 0 ? -1 : 1;
}

// Calculate the slopes of the tangents (Hermite-type interpolation) based on
// the following paper: Steffen, M. 1990. A Simple Method for Monotonic
// Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
// NOV(II), P. 443, 1990.
function slope3(that, x2, y2) {
  var h0 = that._x1 - that._x0,
      h1 = x2 - that._x1,
      s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
      s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
      p = (s0 * h1 + s1 * h0) / (h0 + h1);
  return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
}

// Calculate a one-sided slope.
function slope2(that, t) {
  var h = that._x1 - that._x0;
  return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
}

// According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
// "you can express cubic Hermite interpolation in terms of cubic Bézier curves
// with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
function point(that, t0, t1) {
  var x0 = that._x0,
      y0 = that._y0,
      x1 = that._x1,
      y1 = that._y1,
      dx = (x1 - x0) / 3;
  that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
}

function MonotoneX(context) {
  this._context = context;
}

MonotoneX.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 =
    this._y0 = this._y1 =
    this._t0 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2: this._context.lineTo(this._x1, this._y1); break;
      case 3: point(this, this._t0, slope2(this, this._t0)); break;
    }
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    var t1 = NaN;

    x = +x, y = +y;
    if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
    switch (this._point) {
      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
      case 1: this._point = 2; break;
      case 2: this._point = 3; point(this, slope2(this, t1 = slope3(this, x, y)), t1); break;
      default: point(this, this._t0, t1 = slope3(this, x, y)); break;
    }

    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
    this._t0 = t1;
  }
};

(Object.create(MonotoneX.prototype)).point = function(x, y) {
  MonotoneX.prototype.point.call(this, y, x);
};

function monotoneX(context) {
  return new MonotoneX(context);
}

function Step(context, t) {
  this._context = context;
  this._t = t;
}

Step.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = this._y = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    if (0 < this._t && this._t < 1 && this._point === 2) this._context.lineTo(this._x, this._y);
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    if (this._line >= 0) this._t = 1 - this._t, this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
      case 1: this._point = 2; // falls through
      default: {
        if (this._t <= 0) {
          this._context.lineTo(this._x, y);
          this._context.lineTo(x, y);
        } else {
          var x1 = this._x * (1 - this._t) + x * this._t;
          this._context.lineTo(x1, this._y);
          this._context.lineTo(x1, y);
        }
        break;
      }
    }
    this._x = x, this._y = y;
  }
};

function curveStep(context) {
  return new Step(context, 0.5);
}

function stepBefore(context) {
  return new Step(context, 0);
}

function stepAfter(context) {
  return new Step(context, 1);
}

const Legend = createTokenComponent();
const Tooltip = createTokenComponent();
const Labels = createTokenComponent();
const XAxis = createTokenComponent();
const YAxis = createTokenComponent();
const Grid = createTokenComponent();

const seriesKey = (series, index) => series.id ?? String(index);
const normalise = (data) => {
  const series = data ?? [];
  const categories = [];
  const categoryIndex = /* @__PURE__ */ new Map();
  for (const entry of series) {
    for (const point of entry.points ?? []) {
      if (categoryIndex.has(point.type)) continue;
      categoryIndex.set(point.type, categories.length);
      categories.push(point.type);
    }
  }
  const matrix = new Float64Array(series.length * categories.length);
  const present = new Uint8Array(series.length * categories.length);
  for (let s = 0; s < series.length; s++) {
    const offset = s * categories.length;
    for (const point of series[s].points ?? []) {
      const value = point.value;
      const cell = offset + categoryIndex.get(point.type);
      matrix[cell] = Number.isFinite(value) ? value : 0;
      present[cell] = 1;
    }
  }
  return { categories, matrix, present, seriesKeys: series.map(seriesKey), series };
};
const useChartData = (data, onSeriesToggle) => {
  const normalised = createMemo(() => normalise(data()));
  const [hidden, setHidden] = createSignal(/* @__PURE__ */ new Set());
  const keyOf = (seriesIndex, pointIndex, data2) => {
    const { seriesKeys, categories } = data2 ?? normalised();
    const series = seriesKeys[seriesIndex];
    if (series === void 0) return void 0;
    return pointIndex === void 0 ? series : `${series} ${categories[pointIndex]}`;
  };
  const toggle = (key) => {
    if (key === void 0) return void 0;
    const next = new Set(hidden());
    const wasVisible = !next.has(key);
    if (wasVisible) next.add(key);
    else next.delete(key);
    setHidden(next);
    return !wasVisible;
  };
  const isSeriesVisible = (seriesIndex, data2) => !hidden().has(keyOf(seriesIndex, void 0, data2));
  const isPointVisible = (seriesIndex, pointIndex, data2) => isSeriesVisible(seriesIndex, data2) && !hidden().has(keyOf(seriesIndex, pointIndex, data2));
  const visibleIn = (data2) => data2.seriesKeys.reduce((acc, key, index) => {
    if (!hidden().has(key)) acc.push(index);
    return acc;
  }, []);
  const toggleSeries = (seriesIndex) => {
    const visible = toggle(keyOf(seriesIndex));
    if (visible !== void 0) onSeriesToggle?.(seriesIndex, visible);
  };
  const togglePoint = (seriesIndex, pointIndex) => {
    toggle(keyOf(seriesIndex, pointIndex));
  };
  const visibleIndices = createMemo(() => visibleIn(normalised()));
  return { normalised, isSeriesVisible, isPointVisible, toggleSeries, togglePoint, visibleIndices, visibleIn };
};

const EASINGS = {
  "linear": (t) => t,
  "ease-in": (t) => t * t,
  "ease-out": (t) => t * (2 - t),
  "ease-in-out": (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
};
const resolveEasing = (easing) => {
  if (typeof easing === "function") return easing;
  return EASINGS[easing ?? "ease-out"] ?? EASINGS["ease-out"];
};
const clamp01 = (value) => value < 0 ? 0 : value > 1 ? 1 : value;
const cellKey = (seriesKey, category) => `${seriesKey}\0${category}`;
const remap = (previous, from, to) => {
  const next = new Float64Array(to.matrix.length);
  if (previous.length === 0) return next;
  const lookup = /* @__PURE__ */ new Map();
  for (let s = 0; s < from.seriesKeys.length; s++) {
    const offset = s * from.categories.length;
    for (let c = 0; c < from.categories.length; c++) {
      lookup.set(cellKey(from.seriesKeys[s], from.categories[c]), previous[offset + c]);
    }
  }
  for (let s = 0; s < to.seriesKeys.length; s++) {
    const offset = s * to.categories.length;
    for (let c = 0; c < to.categories.length; c++) {
      next[offset + c] = lookup.get(cellKey(to.seriesKeys[s], to.categories[c])) ?? 0;
    }
  }
  return next;
};
const mergeForExit = (previous, next) => {
  const categories = next.categories.slice();
  for (const category of previous.categories) {
    if (!categories.includes(category)) categories.push(category);
  }
  const seriesKeys = next.seriesKeys.slice();
  const series = next.series.slice();
  for (let s = 0; s < previous.seriesKeys.length; s++) {
    if (seriesKeys.includes(previous.seriesKeys[s])) continue;
    seriesKeys.push(previous.seriesKeys[s]);
    series.push(previous.series[s]);
  }
  if (categories.length === next.categories.length && seriesKeys.length === next.seriesKeys.length) {
    return next;
  }
  const matrix = new Float64Array(seriesKeys.length * categories.length);
  const present = new Uint8Array(matrix.length);
  for (let s = 0; s < next.seriesKeys.length; s++) {
    const fromOffset = s * next.categories.length;
    const toOffset = s * categories.length;
    for (let c = 0; c < next.categories.length; c++) {
      matrix[toOffset + c] = next.matrix[fromOffset + c];
      present[toOffset + c] = next.present[fromOffset + c];
    }
  }
  return { categories, matrix, present, seriesKeys, series };
};
const useChartTween = (target, animation) => {
  const initial = target();
  const [frame, setFrame] = createSignal({ data: initial, values: initial.matrix });
  let handle = 0;
  let previousData = initial;
  onCleanup(() => cancelAnimationFrame(handle));
  createEffect(on(target, (next) => {
    const config = animation();
    const duration = config?.duration ?? 300;
    cancelAnimationFrame(handle);
    if (!config || duration <= 0) {
      previousData = next;
      setFrame({ data: next, values: next.matrix });
      return;
    }
    const stage = mergeForExit(previousData, next);
    const from = remap(frame().values, previousData, stage);
    const to = stage.matrix;
    previousData = next;
    if (from.length === 0) {
      setFrame({ data: next, values: next.matrix });
      return;
    }
    const ease = resolveEasing(config.easing);
    const stagger = config.stagger ?? 0;
    const start = performance.now() + (config.delay ?? 0);
    const total = duration + Math.max(0, to.length - 1) * stagger;
    config.onStart?.();
    const step = (now) => {
      const elapsed = now - start;
      const out = new Float64Array(to.length);
      for (let i = 0; i < to.length; i++) {
        const k = ease(clamp01((elapsed - i * stagger) / duration));
        out[i] = from[i] + (to[i] - from[i]) * k;
      }
      setFrame({ data: stage, values: out });
      if (elapsed < total) {
        handle = requestAnimationFrame(step);
        return;
      }
      setFrame({ data: next, values: next.matrix });
      config.onEnd?.();
    };
    handle = requestAnimationFrame(step);
  }, { defer: true }));
  return frame;
};

const useChartSize = () => {
  const [size, setSize] = createSignal({ width: 0, height: 0 });
  let observer;
  const measure = (element) => {
    const width = element.clientWidth;
    const height = element.clientHeight;
    setSize((prev) => prev.width === width && prev.height === height ? prev : { width, height });
  };
  const observe = (element) => {
    measure(element);
    observer = new ResizeObserver(() => measure(element));
    observer.observe(element);
  };
  onCleanup(() => observer?.disconnect());
  return [size, observe];
};

const resolveHoverMode = (interactive, auto) => {
  if (!interactive) return "none";
  if (interactive === "svg" || interactive === "overlay") return interactive;
  return auto;
};
const useChartHover = (options) => {
  const [hovered, setHovered] = createSignal(null);
  let plotRect;
  const refreshRect = () => {
    plotRect = options.plotElement()?.getBoundingClientRect();
  };
  createEffect(() => {
    options.size();
    refreshRect();
  });
  const onEnter = () => refreshRect();
  const toLocal = (event) => {
    if (!plotRect) refreshRect();
    if (!plotRect) return null;
    return { x: event.clientX - plotRect.left, y: event.clientY - plotRect.top };
  };
  const publish = (next) => {
    const previous = hovered();
    const same = previous && next && previous.seriesIndex === next.seriesIndex && previous.pointIndex === next.pointIndex;
    setHovered(next);
    if (!same) options.onHover?.(next);
  };
  const isHovered = (seriesIndex, pointIndex) => {
    const current = hovered();
    return !!current && current.seriesIndex === seriesIndex && current.pointIndex === pointIndex;
  };
  const markProps = (seriesIndex, pointIndex) => {
    const eventFor = (event) => {
      const position = toLocal(event) ?? { x: 0, y: 0 };
      return options.toEvent({ seriesIndex: seriesIndex(), pointIndex: pointIndex(), position });
    };
    const whenSvg = (handler) => ((...args) => {
      if (options.mode() === "svg") handler(...args);
    });
    return {
      // mouseenter/mouseleave do not bubble, so these are per-mark
      // listeners. Above ~100 marks prefer interactive="overlay".
      onMouseEnter: whenSvg((event) => {
        onEnter();
        publish(eventFor(event));
      }),
      onMouseMove: whenSvg((event) => publish(eventFor(event))),
      onMouseLeave: whenSvg(() => publish(null)),
      onClick: whenSvg((event) => {
        const next = eventFor(event);
        if (next) options.onClick?.(next);
      })
    };
  };
  const overlayProps = () => {
    if (options.mode() !== "overlay") return {};
    return {
      onMouseEnter: onEnter,
      onMouseMove: (event) => {
        const local = toLocal(event);
        const resolve = options.resolver();
        if (!local || !resolve) return publish(null);
        const hit = resolve(local.x, local.y);
        publish(hit ? options.toEvent(hit) : null);
      },
      onMouseLeave: () => publish(null),
      onClick: () => {
        const current = hovered();
        if (current) options.onClick?.(current);
      }
    };
  };
  return { hovered, isHovered, markProps, overlayProps };
};

const TAU$1 = Math.PI * 2;
const normaliseAngle = (angle) => {
  const wrapped = angle % TAU$1;
  return wrapped < 0 ? wrapped + TAU$1 : wrapped;
};
const angularGap = (a, b) => {
  const gap = Math.abs(normaliseAngle(a) - normaliseAngle(b));
  return gap > Math.PI ? TAU$1 - gap : gap;
};
const createSpiderResolver = (centre, vertices, outerRadius) => (x, y) => {
  const { x: cx, y: cy } = centre();
  const dx = x - cx;
  const dy = y - cy;
  const radius = Math.sqrt(dx * dx + dy * dy);
  if (radius > outerRadius() + 8) return null;
  const points = vertices();
  if (points.length === 0) return null;
  const angle = normaliseAngle(Math.atan2(dx, -dy));
  let nearestAngle = Infinity;
  for (let i = 0; i < points.length; i++) {
    const gap = angularGap(points[i].angle, angle);
    if (gap < nearestAngle) nearestAngle = gap;
  }
  let best = null;
  let bestGap = Infinity;
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    if (angularGap(point.angle, angle) > nearestAngle + 1e-6) continue;
    const gap = Math.abs(point.radius - radius);
    if (gap < bestGap) {
      bestGap = gap;
      best = point;
    }
  }
  if (!best) return null;
  const hit = {
    seriesIndex: best.seriesIndex,
    pointIndex: best.categoryIndex,
    position: {
      x: cx + Math.sin(best.angle) * best.radius,
      y: cy - Math.cos(best.angle) * best.radius
    }
  };
  return hit;
};
const createRadialResolver = (centre, slices) => (x, y) => {
  const { x: cx, y: cy } = centre();
  const dx = x - cx;
  const dy = y - cy;
  const radius = Math.sqrt(dx * dx + dy * dy);
  const angle = normaliseAngle(Math.atan2(dx, -dy));
  const candidates = slices();
  for (let i = 0; i < candidates.length; i++) {
    const slice = candidates[i];
    if (radius < slice.innerRadius || radius > slice.outerRadius) continue;
    const start = normaliseAngle(slice.startAngle);
    const sweep = slice.endAngle - slice.startAngle;
    if (sweep <= 0) continue;
    if (sweep >= TAU$1 || normaliseAngle(angle - start) < sweep) {
      const hit = {
        seriesIndex: slice.seriesIndex,
        pointIndex: slice.pointIndex,
        position: { x, y }
      };
      return hit;
    }
  }
  return null;
};

const createPointEvent = (series, categories, hit) => {
  const entry = series[hit.seriesIndex];
  const category = categories[hit.pointIndex];
  if (!entry || category === void 0) return null;
  const fallback = { type: category, value: 0 };
  const point = entry.points?.find((candidate) => candidate.type === category) ?? fallback;
  return {
    point,
    series: entry,
    seriesIndex: hit.seriesIndex,
    pointIndex: hit.pointIndex,
    position: hit.position
  };
};

const DEFAULT_PALETTE = [
  "#3987e5",
  // blue
  "#d95926",
  // orange
  "#199e70",
  // aqua
  "#c98500",
  // yellow
  "#d55181",
  // magenta
  "#008300",
  // green
  "#9085e9",
  // violet
  "#e66767"
  // red
];
const resolveColor = (palette, seriesIndex, series, point) => {
  if (point?.color) return point.color;
  if (series?.color) return series.color;
  return palette[seriesIndex % palette.length];
};

const LENGTH_PATTERN = /^([-+]?(?:\d+\.?\d*|\.\d+))\s*([a-z%]*)$/i;
const readViewport = () => ({
  rem: parseFloat(getComputedStyle(document.documentElement).fontSize) || 16,
  width: window.innerWidth,
  height: window.innerHeight
});
let listening = false;
const [viewport, setViewport] = createSignal({ rem: 16, width: 0, height: 0 });
const currentViewport = () => {
  if (!listening) {
    listening = true;
    setViewport(readViewport());
    window.addEventListener("resize", () => setViewport(readViewport()));
  }
  return viewport();
};
const resolveLength = (value, fallback, percentOf) => {
  if (value === void 0) return fallback;
  if (typeof value === "number") return value;
  const match = LENGTH_PATTERN.exec(value.trim());
  if (!match) return fallback;
  const amount = parseFloat(match[1]);
  const { rem, width, height } = currentViewport();
  switch (match[2].toLowerCase()) {
    case "":
    case "px":
      return amount;
    case "rem":
      return amount * rem;
    case "vh":
      return amount * height / 100;
    case "vw":
      return amount * width / 100;
    case "vmin":
      return amount * Math.min(width, height) / 100;
    case "vmax":
      return amount * Math.max(width, height) / 100;
    case "%":
      return percentOf === void 0 ? fallback : amount * percentOf / 100;
    default:
      return fallback;
  }
};

const clamp = (value, min, max) => value < min ? min : value > max ? max : value;
const resolveInnerRadius = (value, outerRadius) => clamp(resolveLength(value, 0, outerRadius), 0, outerRadius);
const formatChartNumber = (value) => Number.isInteger(value) ? String(value) : value.toFixed(1);

const warnOnce = (message) => {
  return;
};
const MARK_BUDGET = 500;
const warnOnMarkBudget = (displayName, marks) => {
  if (marks <= MARK_BUDGET) return;
};

var _tmpl$$8 = /* @__PURE__ */ template(`<div>`), _tmpl$2$7 = /* @__PURE__ */ template(`<span>`);
const ChartLegend = (props) => {
  const isInteractive = () => props.token.interactive !== false;
  const classes = () => {
    const list = [styles.legend, styles[`legend-${props.token.position ?? "bottom"}`]];
    if (props.token.class) list.push(props.token.class);
    return list.join(" ");
  };
  const entryClasses = (entry) => {
    const list = [styles["legend-entry"]];
    if (!entry.visible) list.push(styles["legend-entry-hidden"]);
    return list.join(" ");
  };
  return (() => {
    var _el$ = getNextElement(_tmpl$$8);
    insert(_el$, createComponent(Index, {
      get each() {
        return props.entries;
      },
      children: (entry) => (() => {
        var _el$2 = getNextElement(_tmpl$$8);
        _el$2.$$click = () => isInteractive() && props.onToggle(entry());
        insert(_el$2, createComponent(Show, {
          get when() {
            return props.token.content;
          },
          get fallback() {
            return [(() => {
              var _el$3 = getNextElement(_tmpl$2$7);
              createRenderEffect((_p$) => {
                var _v$5 = styles["legend-marker"], _v$6 = entry().color;
                _v$5 !== _p$.e && className(_el$3, _p$.e = _v$5);
                _v$6 !== _p$.t && setStyleProperty(_el$3, "background-color", _p$.t = _v$6);
                return _p$;
              }, {
                e: void 0,
                t: void 0
              });
              return _el$3;
            })(), (() => {
              var _el$4 = getNextElement(_tmpl$2$7);
              insert(_el$4, () => entry().label);
              createRenderEffect(() => className(_el$4, styles["legend-label"]));
              return _el$4;
            })()];
          },
          get children() {
            return props.token.content(entry());
          }
        }));
        createRenderEffect((_p$) => {
          var _v$3 = entryClasses(entry()), _v$4 = isInteractive() ? 0 : void 0;
          _v$3 !== _p$.e && className(_el$2, _p$.e = _v$3);
          _v$4 !== _p$.t && setAttribute(_el$2, "tabindex", _p$.t = _v$4);
          return _p$;
        }, {
          e: void 0,
          t: void 0
        });
        runHydrationEvents();
        return _el$2;
      })()
    }));
    createRenderEffect((_p$) => {
      var _v$ = classes(), _v$2 = props.token.style;
      _v$ !== _p$.e && className(_el$, _p$.e = _v$);
      _p$.t = style(_el$, _v$2, _p$.t);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$;
  })();
};
delegateEvents(["click"]);

var _tmpl$$7 = /* @__PURE__ */ template(`<div>`), _tmpl$2$6 = /* @__PURE__ */ template(`<span>`);
const DEFAULT_OFFSET = "0.75rem";
const ChartTooltip = (props) => {
  const preferred = () => props.token.position && props.token.position !== "auto" ? props.token.position : "top";
  const [side, setSide] = createSignal(preferred());
  let element;
  createEffect(on(() => `${props.event.seriesIndex}:${props.event.pointIndex}`, () => {
    setSide(preferred());
    if (props.token.position && props.token.position !== "auto") return;
    waitForFrames(() => {
      if (!element) return;
      const safe = getSafePosition(element.getBoundingClientRect());
      if (safe) setSide(safe);
    });
  }));
  const positionStyles = () => {
    const {
      x,
      y
    } = props.event.position;
    const offset = resolveLength(props.token.offset ?? DEFAULT_OFFSET, 0);
    switch (side()) {
      case "bottom":
        return {
          left: `${x}px`,
          top: `${y + offset}px`,
          transform: "translate(-50%, 0)"
        };
      case "left":
        return {
          left: `${x - offset}px`,
          top: `${y}px`,
          transform: "translate(-100%, -50%)"
        };
      case "right":
        return {
          left: `${x + offset}px`,
          top: `${y}px`,
          transform: "translate(0, -50%)"
        };
      default:
        return {
          left: `${x}px`,
          top: `${y - offset}px`,
          transform: "translate(-50%, -100%)"
        };
    }
  };
  const classes = () => {
    const list = [styles.tooltip];
    if (props.token.class) list.push(props.token.class);
    return list.join(" ");
  };
  return (() => {
    var _el$ = getNextElement(_tmpl$$7);
    var _ref$ = element;
    typeof _ref$ === "function" ? use(_ref$, _el$) : element = _el$;
    insert(_el$, createComponent(Show, {
      get when() {
        return props.token.content;
      },
      get fallback() {
        return [(() => {
          var _el$2 = getNextElement(_tmpl$2$6);
          insert(_el$2, () => props.event.point.label ?? props.event.point.type);
          createRenderEffect(() => className(_el$2, styles["tooltip-label"]));
          return _el$2;
        })(), (() => {
          var _el$3 = getNextElement(_tmpl$2$6);
          insert(_el$3, () => props.event.point.value);
          createRenderEffect(() => className(_el$3, styles["tooltip-value"]));
          return _el$3;
        })()];
      },
      get children() {
        return props.token.content(props.event);
      }
    }));
    createRenderEffect((_p$) => {
      var _v$ = classes(), _v$2 = {
        ...positionStyles(),
        ...props.token.style
      };
      _v$ !== _p$.e && className(_el$, _p$.e = _v$);
      _p$.t = style(_el$, _v$2, _p$.t);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$;
  })();
};

var _tmpl$$6 = /* @__PURE__ */ template(`<div>`), _tmpl$2$5 = /* @__PURE__ */ template(`<div><!$><!/><div><!$><!/><!$><!/><!$><!/>`);
const ChartRoot = (props) => {
  const legendPosition = () => props.legend?.position ?? "bottom";
  const rootClasses = () => {
    const list = [styles.chart, styles[`chart-${legendPosition()}`], props.componentClass];
    return list.filter(Boolean).join(" ");
  };
  props.componentProps.componentClasses = () => rootClasses();
  return (() => {
    var _el$ = getNextElement(_tmpl$2$5), _el$0 = _el$.firstChild, [_el$1, _co$4] = getNextMarker(_el$0.nextSibling), _el$2 = _el$1.nextSibling, _el$4 = _el$2.firstChild, [_el$5, _co$] = getNextMarker(_el$4.nextSibling), _el$6 = _el$5.nextSibling, [_el$7, _co$2] = getNextMarker(_el$6.nextSibling), _el$8 = _el$7.nextSibling, [_el$9, _co$3] = getNextMarker(_el$8.nextSibling);
    use(baseComponent, _el$, () => props.componentProps);
    var _ref$ = props.componentProps.ref;
    typeof _ref$ === "function" ? use(_ref$, _el$) : props.componentProps.ref = _el$;
    insert(_el$, createComponent(Show, {
      get when() {
        return props.legend;
      },
      get children() {
        return createComponent(ChartLegend, {
          get token() {
            return props.legend;
          },
          get entries() {
            return props.entries;
          },
          get onToggle() {
            return props.onToggle;
          }
        });
      }
    }), _el$1, _co$4);
    var _ref$2 = props.plotRef;
    typeof _ref$2 === "function" ? use(_ref$2, _el$2) : props.plotRef = _el$2;
    insert(_el$2, () => props.children, _el$5, _co$);
    insert(_el$2, createComponent(Show, {
      get when() {
        return props.showOverlay;
      },
      get children() {
        var _el$3 = getNextElement(_tmpl$$6);
        spread(_el$3, mergeProps({
          get ["class"]() {
            return styles.overlay;
          }
        }, () => props.overlayProps), false, false);
        runHydrationEvents();
        return _el$3;
      }
    }), _el$7, _co$2);
    insert(_el$2, createComponent(Show, {
      get when() {
        return memo(() => !!props.tooltip)() && props.hovered;
      },
      get children() {
        return createComponent(ChartTooltip, {
          get token() {
            return props.tooltip;
          },
          get event() {
            return props.hovered;
          }
        });
      }
    }), _el$9, _co$3);
    createRenderEffect(() => className(_el$2, styles.plot));
    return _el$;
  })();
};

var _tmpl$$5 = /* @__PURE__ */ template(`<div>`);
const TRANSFORMS = {
  center: "translate(-50%, -50%)",
  start: "translate(0, -50%)",
  end: "translate(-100%, -50%)"
};
const ChartLabels = (props) => (() => {
  var _el$ = getNextElement(_tmpl$$5);
  insert(_el$, createComponent(Index, {
    get each() {
      return props.anchors;
    },
    children: (anchor) => (() => {
      var _el$2 = getNextElement(_tmpl$$5);
      insert(_el$2, () => anchor().text);
      createRenderEffect((_p$) => {
        var _v$ = [styles.label, props.token.class].filter(Boolean).join(" "), _v$2 = {
          left: `${anchor().x}px`,
          top: `${anchor().y}px`,
          transform: TRANSFORMS[anchor().align],
          ...props.token.style
        };
        _v$ !== _p$.e && className(_el$2, _p$.e = _v$);
        _p$.t = style(_el$2, _v$2, _p$.t);
        return _p$;
      }, {
        e: void 0,
        t: void 0
      });
      return _el$2;
    })()
  }));
  createRenderEffect(() => className(_el$, styles.labels));
  return _el$;
})();

var _tmpl$$4 = /* @__PURE__ */ template(`<span>`), _tmpl$2$4 = /* @__PURE__ */ template(`<svg><g><!$><!/><!$><!/></svg>`, false, true, false), _tmpl$3$4 = /* @__PURE__ */ template(`<svg>`), _tmpl$4$3 = /* @__PURE__ */ template(`<div>`), _tmpl$5$2 = /* @__PURE__ */ template(`<svg><path></svg>`, false, true, false), _tmpl$6$1 = /* @__PURE__ */ template(`<svg><polyline></svg>`, false, true, false);
const DEG$1 = Math.PI / 180;
const OUTSIDE_LABEL_GAP = 10;
const OUTSIDE_LABEL_RESERVE = 52;
const LABEL_LINE_HEIGHT = 16;
const LEADER_ELBOW = 6;
const LEADER_TEXT_GAP = 3;
const spreadOutsideLabels = (anchors, centreY) => {
  const sides = [anchors.filter((anchor) => anchor.align === "start"), anchors.filter((anchor) => anchor.align === "end")];
  for (const side of sides) {
    side.sort((a, b) => a.y - b.y);
    for (let i = 1; i < side.length; i++) {
      const gap = side[i].y - side[i - 1].y;
      if (gap < LABEL_LINE_HEIGHT) side[i].y = side[i - 1].y + LABEL_LINE_HEIGHT;
    }
    for (let i = side.length - 2; i >= 0; i--) {
      const gap = side[i + 1].y - side[i].y;
      if (gap < LABEL_LINE_HEIGHT) side[i].y = side[i + 1].y - LABEL_LINE_HEIGHT;
    }
    if (side.length > 1) {
      const span = side[side.length - 1].y - side[0].y;
      const drift = side[0].y + span / 2 - centreY;
      if (Math.abs(drift) > 1) {
        for (const anchor of side) anchor.y -= drift;
      }
    }
  }
  return anchors;
};
const createRadialChart = (config) => (props) => {
  const legendToken = useToken(Legend, props.children);
  const tooltipToken = useToken(Tooltip, props.children);
  const labelsToken = useToken(Labels, props.children);
  const sliceToken = useToken(config.sliceTokenizer, props.children);
  const holeToken = config.holeTokenizer ? useToken(config.holeTokenizer, props.children) : () => null;
  const [size, observePlot] = useChartSize();
  const model = useChartData(() => props.data, props.onSeriesToggle);
  const frame = useChartTween(model.normalised, () => props.animation);
  let plotElement;
  const palette = () => props.palette ?? DEFAULT_PALETTE;
  const placement = () => labelsToken()?.placement ?? "inside";
  const showsHole = () => !!holeToken() || placement() === "hole";
  const seriesIndex = createMemo(() => {
    if (props.data?.length > 1) {
      warnOnce(`[${config.displayName}] Only the first series is rendered. Give each slice its own point, or use one chart per series.`);
    }
    return model.visibleIn(frame().data)[0];
  });
  const geometry = createMemo(() => {
    const {
      width,
      height
    } = size();
    const index = seriesIndex();
    if (width <= 0 || height <= 0 || index === void 0) return null;
    const {
      data,
      values
    } = frame();
    const categories = data.categories;
    const offset = index * categories.length;
    const visible = [];
    for (let c = 0; c < categories.length; c++) {
      if (!model.isPointVisible(index, c, data)) continue;
      const value = values[offset + c] ?? 0;
      if (value < 0) {
        warnOnce(`[${config.displayName}] Negative values have no meaning here and are treated as 0.`);
      }
      if (value <= 0) continue;
      visible.push({
        pointIndex: c,
        value
      });
    }
    const total = visible.reduce((sum, slice) => sum + slice.value, 0);
    if (total <= 0) return null;
    const token = sliceToken();
    const outsideReserve = placement() === "outside" ? OUTSIDE_LABEL_RESERVE : 0;
    const outerRadius = Math.min(width, height) / 2 - outsideReserve;
    if (outerRadius <= 0) return null;
    const innerRadius = resolveInnerRadius(props.innerRadius ?? config.defaultInnerRadius, outerRadius);
    const centre = {
      x: width / 2,
      y: height / 2
    };
    const layout = pie().sort(null).value((slice) => slice.value).startAngle((props.startAngle ?? 0) * DEG$1).endAngle((props.endAngle ?? 360) * DEG$1).padAngle((token?.padAngle ?? 0) * DEG$1);
    const generator = arc().innerRadius(innerRadius).outerRadius(outerRadius).cornerRadius(resolveLength(token?.cornerRadius, 0));
    const arcs = layout(visible).map((entry) => ({
      pointIndex: entry.data.pointIndex,
      value: entry.data.value,
      startAngle: entry.startAngle,
      endAngle: entry.endAngle,
      midAngle: (entry.startAngle + entry.endAngle) / 2,
      d: generator(entry) ?? "",
      centroid: generator.centroid(entry),
      color: resolveColor(palette(), entry.data.pointIndex, data.series[index], data.series[index]?.points?.find((point) => point.type === categories[entry.data.pointIndex]))
    }));
    warnOnMarkBudget(config.displayName, arcs.length);
    return {
      centre,
      outerRadius,
      innerRadius,
      arcs,
      seriesIndex: index,
      categories,
      total
    };
  });
  const hoverMode = () => resolveHoverMode(props.interactive, "svg");
  const resolver = createRadialResolver(() => geometry()?.centre ?? {
    x: 0,
    y: 0
  }, () => {
    const current = geometry();
    if (!current) return [];
    return current.arcs.map((entry) => ({
      seriesIndex: current.seriesIndex,
      pointIndex: entry.pointIndex,
      startAngle: entry.startAngle,
      endAngle: entry.endAngle,
      // The hole is a real gap: pointing at it resolves to nothing.
      innerRadius: current.innerRadius,
      outerRadius: current.outerRadius
    }));
  });
  const hover = useChartHover({
    mode: hoverMode,
    resolver: () => resolver,
    plotElement: () => plotElement,
    size,
    toEvent: (hit) => createPointEvent(frame().data.series, frame().data.categories, hit),
    onHover: (event) => props.onPointHover?.(event),
    onClick: (event) => props.onPointClick?.(event)
  });
  const entries = createMemo(() => {
    const index = seriesIndex();
    const {
      data
    } = frame();
    if (index === void 0) return [];
    const series = data.series[index];
    return data.categories.map((category, pointIndex) => {
      const point = series?.points?.find((candidate) => candidate.type === category);
      return {
        label: point?.label ?? category,
        color: resolveColor(palette(), pointIndex, series, point),
        seriesIndex: index,
        pointIndex,
        visible: model.isPointVisible(index, pointIndex, data)
      };
    });
  });
  const labelAnchors = createMemo(() => {
    const token = labelsToken();
    const current = geometry();
    if (!token || !current || token.show === "never" || placement() === "hole") return [];
    const hovered = hover.hovered();
    const {
      data
    } = frame();
    const series = data.series[current.seriesIndex];
    const anchors = current.arcs.reduce((acc, entry) => {
      if (token.show === "hover" && hovered?.pointIndex !== entry.pointIndex) return acc;
      const category = current.categories[entry.pointIndex];
      const point = series?.points?.find((candidate) => candidate.type === category) ?? {
        type: category,
        value: entry.value
      };
      const outside = placement() === "outside";
      const radius = outside ? current.outerRadius + OUTSIDE_LABEL_GAP : 0;
      const x = outside ? current.centre.x + Math.sin(entry.midAngle) * radius : current.centre.x + entry.centroid[0];
      const y = outside ? current.centre.y - Math.cos(entry.midAngle) * radius : current.centre.y + entry.centroid[1];
      acc.push({
        key: category,
        x,
        y,
        text: token.format ? token.format(point, series) : point.label ?? category,
        align: outside ? Math.sin(entry.midAngle) >= 0 ? "start" : "end" : "center",
        seriesIndex: current.seriesIndex,
        pointIndex: entry.pointIndex
      });
      return acc;
    }, []);
    return placement() === "outside" ? spreadOutsideLabels(anchors, current.centre.y) : anchors;
  });
  const leaderLines = createMemo(() => {
    const current = geometry();
    if (!current || placement() !== "outside" || !labelsToken()?.leaderLines) return [];
    const byPoint = new Map(current.arcs.map((entry) => [entry.pointIndex, entry.midAngle]));
    return labelAnchors().reduce((acc, anchor) => {
      const midAngle = byPoint.get(anchor.pointIndex);
      if (midAngle === void 0) return acc;
      const sin = Math.sin(midAngle);
      const cos = Math.cos(midAngle);
      const elbowRadius = current.outerRadius + LEADER_ELBOW;
      const side = anchor.align === "start" ? 1 : -1;
      const points = [`${sin * current.outerRadius},${-cos * current.outerRadius}`, `${sin * elbowRadius},${-cos * elbowRadius}`, `${anchor.x - current.centre.x - side * LEADER_TEXT_GAP},${anchor.y - current.centre.y}`].join(" ");
      acc.push({
        key: anchor.key,
        points
      });
      return acc;
    }, []);
  });
  const holeContent = () => {
    const token = holeToken();
    if (token?.children) return token.children;
    if (placement() !== "hole") return null;
    const current = geometry();
    if (!current) return null;
    const labels = labelsToken();
    const hovered = hover.hovered();
    if (!hovered) {
      const totalPoint = {
        type: "total",
        value: current.total
      };
      const series = frame().data.series[current.seriesIndex];
      return (() => {
        var _el$ = getNextElement(_tmpl$$4);
        insert(_el$, (() => {
          var _c$ = memo(() => !!labels?.format);
          return () => _c$() ? labels.format(totalPoint, series) : formatChartNumber(current.total);
        })());
        createRenderEffect(() => className(_el$, styles["hole-value"]));
        return _el$;
      })();
    }
    return [(() => {
      var _el$2 = getNextElement(_tmpl$$4);
      insert(_el$2, (() => {
        var _c$2 = memo(() => !!labels?.format);
        return () => _c$2() ? labels.format(hovered.point, hovered.series) : formatChartNumber(hovered.point.value);
      })());
      createRenderEffect(() => className(_el$2, styles["hole-value"]));
      return _el$2;
    })(), (() => {
      var _el$3 = getNextElement(_tmpl$$4);
      insert(_el$3, () => hovered.point.label ?? hovered.point.type);
      createRenderEffect(() => className(_el$3, styles["hole-label"]));
      return _el$3;
    })()];
  };
  const sliceTransform = (pointIndex, midAngle) => {
    const offset = resolveLength(sliceToken()?.hoverOffset, 0);
    const current = geometry();
    if (!offset || !current || !hover.isHovered(current.seriesIndex, pointIndex)) return void 0;
    return `translate(${Math.sin(midAngle) * offset} ${-Math.cos(midAngle) * offset})`;
  };
  const sliceClasses = (pointIndex) => {
    const list = [styles.slice];
    if (hover.isHovered(geometry()?.seriesIndex ?? -1, pointIndex)) list.push(styles["is-hovered"]);
    if (sliceToken()?.class) list.push(sliceToken().class);
    return list.join(" ");
  };
  const holeLabels = () => placement() === "hole" ? labelsToken() : null;
  const holeClasses = () => [styles.hole, holeToken()?.class, holeLabels()?.class].filter(Boolean).join(" ");
  const holeStyles = () => {
    const current = geometry();
    if (!current) return {};
    return {
      left: `${current.centre.x}px`,
      top: `${current.centre.y}px`,
      width: `${current.innerRadius * 2}px`,
      height: `${current.innerRadius * 2}px`,
      ...holeLabels()?.style,
      ...holeToken()?.style
    };
  };
  return createComponent(ChartRoot, {
    componentProps: props,
    get componentClass() {
      return config.componentClass;
    },
    get legend() {
      return legendToken();
    },
    get tooltip() {
      return tooltipToken();
    },
    get entries() {
      return entries();
    },
    onToggle: (entry) => entry.pointIndex === void 0 ? model.toggleSeries(entry.seriesIndex) : model.togglePoint(entry.seriesIndex, entry.pointIndex),
    get hovered() {
      return hover.hovered();
    },
    plotRef: (element) => {
      plotElement = element;
      observePlot(element);
    },
    get overlayProps() {
      return hover.overlayProps();
    },
    get showOverlay() {
      return hoverMode() === "overlay";
    },
    get children() {
      return [(() => {
        var _el$4 = getNextElement(_tmpl$3$4);
        insert(_el$4, createComponent(Show, {
          get when() {
            return geometry();
          },
          get children() {
            var _el$5 = getNextElement(_tmpl$2$4), _el$6 = _el$5.firstChild, [_el$7, _co$] = getNextMarker(_el$6.nextSibling), _el$8 = _el$7.nextSibling, [_el$9, _co$2] = getNextMarker(_el$8.nextSibling);
            insert(_el$5, createComponent(Index, {
              get each() {
                return geometry().arcs;
              },
              children: (entry) => {
                const marks = hover.markProps(() => geometry()?.seriesIndex ?? -1, () => entry().pointIndex);
                return (() => {
                  var _el$1 = getNextElement(_tmpl$5$2);
                  spread(_el$1, mergeProps({
                    get d() {
                      return entry().d;
                    },
                    get fill() {
                      return entry().color;
                    },
                    get ["class"]() {
                      return sliceClasses(entry().pointIndex);
                    },
                    get style() {
                      return sliceToken()?.style;
                    },
                    get transform() {
                      return sliceTransform(entry().pointIndex, entry().midAngle);
                    }
                  }, marks), true, false);
                  runHydrationEvents();
                  return _el$1;
                })();
              }
            }), _el$7, _co$);
            insert(_el$5, createComponent(Index, {
              get each() {
                return leaderLines();
              },
              children: (leader) => (() => {
                var _el$10 = getNextElement(_tmpl$6$1);
                createRenderEffect((_p$) => {
                  var _v$7 = leader().points, _v$8 = styles["leader-line"];
                  _v$7 !== _p$.e && setAttribute(_el$10, "points", _p$.e = _v$7);
                  _v$8 !== _p$.t && setAttribute(_el$10, "class", _p$.t = _v$8);
                  return _p$;
                }, {
                  e: void 0,
                  t: void 0
                });
                return _el$10;
              })()
            }), _el$9, _co$2);
            createRenderEffect(() => setAttribute(_el$5, "transform", `translate(${geometry().centre.x} ${geometry().centre.y})`));
            return _el$5;
          }
        }));
        createRenderEffect((_p$) => {
          var _v$ = styles.svg, _v$2 = size().width, _v$3 = size().height, _v$4 = hoverMode() === "none" ? "none" : void 0;
          _v$ !== _p$.e && setAttribute(_el$4, "class", _p$.e = _v$);
          _v$2 !== _p$.t && setAttribute(_el$4, "width", _p$.t = _v$2);
          _v$3 !== _p$.a && setAttribute(_el$4, "height", _p$.a = _v$3);
          _v$4 !== _p$.o && setStyleProperty(_el$4, "pointer-events", _p$.o = _v$4);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        });
        return _el$4;
      })(), createComponent(Show, {
        get when() {
          return labelsToken();
        },
        get children() {
          return createComponent(ChartLabels, {
            get token() {
              return labelsToken();
            },
            get anchors() {
              return labelAnchors();
            }
          });
        }
      }), createComponent(Show, {
        get when() {
          return memo(() => !!showsHole())() && geometry();
        },
        get children() {
          var _el$0 = getNextElement(_tmpl$4$3);
          insert(_el$0, holeContent);
          createRenderEffect((_p$) => {
            var _v$5 = holeClasses(), _v$6 = holeStyles();
            _v$5 !== _p$.e && className(_el$0, _p$.e = _v$5);
            _p$.t = style(_el$0, _v$6, _p$.t);
            return _p$;
          }, {
            e: void 0,
            t: void 0
          });
          return _el$0;
        }
      })];
    }
  });
};

const Slice$1 = createTokenComponent();
const PieChart = createRadialChart({
  componentClass: styles.pie,
  displayName: "Chart.Pie",
  sliceTokenizer: Slice$1
});
const Pie = Object.assign(PieChart, {
  Slice: Slice$1
});

const Slice = createTokenComponent();
const Hole = createTokenComponent();
const DEFAULT_INNER_RADIUS = "60%";
const DonutChart = createRadialChart({
  componentClass: styles.donut,
  displayName: "Chart.Donut",
  sliceTokenizer: Slice,
  holeTokenizer: Hole,
  defaultInnerRadius: DEFAULT_INNER_RADIUS
});
const Donut = Object.assign(DonutChart, {
  Slice,
  Hole
});

const createNearestVertexResolver = (vertices, bounds) => (x, y) => {
  const box = bounds();
  if (!box || x < box.left || x > box.right || y < box.top || y > box.bottom) return null;
  const points = vertices();
  if (points.length === 0) return null;
  let nearestX = Infinity;
  for (let i = 0; i < points.length; i++) {
    const distance = Math.abs(points[i].x - x);
    if (distance < nearestX) nearestX = distance;
  }
  let best = null;
  let bestGap = Infinity;
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    if (Math.abs(point.x - x) > nearestX + 0.5) continue;
    const gap = Math.abs(point.y - y);
    if (gap < bestGap) {
      bestGap = gap;
      best = point;
    }
  }
  if (!best) return null;
  const hit = {
    seriesIndex: best.seriesIndex,
    pointIndex: best.categoryIndex,
    position: { x: best.x, y: best.y }
  };
  return hit;
};
const createBarResolver = (categoryScale, bars, horizontal) => (x, y) => {
  const scale = categoryScale();
  if (!scale) return null;
  const categoryIndex = scale.indexAt(horizontal() ? y : x);
  if (categoryIndex < 0) return null;
  const candidates = bars();
  for (let i = 0; i < candidates.length; i++) {
    const bar = candidates[i];
    if (bar.categoryIndex !== categoryIndex) continue;
    if (x < bar.x || x > bar.x + bar.width) continue;
    if (y < bar.y || y > bar.y + bar.height) continue;
    const hit = {
      seriesIndex: bar.seriesIndex,
      pointIndex: bar.categoryIndex,
      position: { x, y }
    };
    return hit;
  }
  return null;
};

const e10 = Math.sqrt(50),
    e5 = Math.sqrt(10),
    e2 = Math.sqrt(2);

function tickSpec(start, stop, count) {
  const step = (stop - start) / Math.max(0, count),
      power = Math.floor(Math.log10(step)),
      error = step / Math.pow(10, power),
      factor = error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1;
  let i1, i2, inc;
  if (power < 0) {
    inc = Math.pow(10, -power) / factor;
    i1 = Math.round(start * inc);
    i2 = Math.round(stop * inc);
    if (i1 / inc < start) ++i1;
    if (i2 / inc > stop) --i2;
    inc = -inc;
  } else {
    inc = Math.pow(10, power) * factor;
    i1 = Math.round(start / inc);
    i2 = Math.round(stop / inc);
    if (i1 * inc < start) ++i1;
    if (i2 * inc > stop) --i2;
  }
  if (i2 < i1 && 0.5 <= count && count < 2) return tickSpec(start, stop, count * 2);
  return [i1, i2, inc];
}

function ticks(start, stop, count) {
  stop = +stop, start = +start, count = +count;
  if (!(count > 0)) return [];
  if (start === stop) return [start];
  const reverse = stop < start, [i1, i2, inc] = reverse ? tickSpec(stop, start, count) : tickSpec(start, stop, count);
  if (!(i2 >= i1)) return [];
  const n = i2 - i1 + 1, ticks = new Array(n);
  if (reverse) {
    if (inc < 0) for (let i = 0; i < n; ++i) ticks[i] = (i2 - i) / -inc;
    else for (let i = 0; i < n; ++i) ticks[i] = (i2 - i) * inc;
  } else {
    if (inc < 0) for (let i = 0; i < n; ++i) ticks[i] = (i1 + i) / -inc;
    else for (let i = 0; i < n; ++i) ticks[i] = (i1 + i) * inc;
  }
  return ticks;
}

const DEFAULT_TICK_COUNT = 5;
const niceDomain = (min, max, count = DEFAULT_TICK_COUNT) => {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 1];
  if (min === max) return min === 0 ? [0, 1] : [Math.min(0, min), Math.max(0, max)];
  const step = tickStep(min, max, count);
  if (!Number.isFinite(step) || step <= 0) return [min, max];
  return [Math.floor(min / step) * step, Math.ceil(max / step) * step];
};
const tickStep = (min, max, count) => {
  const raw = (max - min) / Math.max(1, count);
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
  const normalised = raw / magnitude;
  const snapped = normalised >= 7.5 ? 10 : normalised >= 3 ? 5 : normalised >= 1.5 ? 2 : 1;
  return snapped * magnitude;
};
const createLinearScale = (domain, range) => {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const span = d1 - d0;
  const project = span === 0 ? () => r0 : (value) => r0 + (value - d0) / span * (r1 - r0);
  const scale = ((value) => project(value));
  scale.domain = domain;
  scale.range = range;
  scale.ticks = (count = DEFAULT_TICK_COUNT) => ticks(d0, d1, count);
  return scale;
};
const createBandScale = (count, range, options = {}) => {
  const [r0, r1] = range;
  const paddingInner = options.paddingInner ?? 0;
  const paddingOuter = options.paddingOuter ?? 0;
  const width = r1 - r0;
  const steps = Math.max(1, count - paddingInner + paddingOuter * 2);
  const step = count > 0 ? width / steps : 0;
  const bandwidth = step * (1 - paddingInner);
  const start = r0 + step * paddingOuter;
  const scale = ((index) => start + index * step);
  scale.bandwidth = bandwidth;
  scale.step = step;
  scale.count = count;
  scale.range = range;
  scale.indexAt = (position) => {
    if (step <= 0 || position < r0 || position > r1) return -1;
    const index = Math.floor((position - start) / step);
    return index < 0 || index >= count ? -1 : index;
  };
  return scale;
};
const bandCentre = (scale, index) => scale(index) + scale.bandwidth / 2;

const computeSpans = (data, values, visibleSeries, stacked) => {
  const categoryCount = data.categories.length;
  const spans = [];
  if (!stacked) {
    for (const seriesIndex of visibleSeries) {
      const offset = seriesIndex * categoryCount;
      for (let c = 0; c < categoryCount; c++) {
        spans.push({ seriesIndex, categoryIndex: c, from: 0, to: values[offset + c] ?? 0 });
      }
    }
    return spans;
  }
  const positiveTop = new Float64Array(categoryCount);
  const negativeBottom = new Float64Array(categoryCount);
  for (const seriesIndex of visibleSeries) {
    const offset = seriesIndex * categoryCount;
    for (let c = 0; c < categoryCount; c++) {
      const value = values[offset + c] ?? 0;
      if (value < 0) {
        const from = negativeBottom[c];
        negativeBottom[c] = from + value;
        spans.push({ seriesIndex, categoryIndex: c, from, to: negativeBottom[c] });
      } else {
        const from = positiveTop[c];
        positiveTop[c] = from + value;
        spans.push({ seriesIndex, categoryIndex: c, from, to: positiveTop[c] });
      }
    }
  }
  return spans;
};
const computeDomain = (spans, override, nice) => {
  if (override) return override;
  let min = 0;
  let max = 0;
  for (const span of spans) {
    if (span.to < min) min = span.to;
    if (span.to > max) max = span.to;
    if (span.from < min) min = span.from;
    if (span.from > max) max = span.from;
  }
  if (min === 0 && max === 0) return [0, 1];
  return nice ? niceDomain(min, max) : [min, max];
};
const computeMargin = (input) => {
  const { hasValueAxis, hasCategoryAxis, horizontal, valueAxisWidth, axisHeight } = input;
  const left = horizontal ? hasCategoryAxis ? valueAxisWidth : 0 : hasValueAxis ? valueAxisWidth : 0;
  const bottom = horizontal ? hasValueAxis ? axisHeight : 0 : hasCategoryAxis ? axisHeight : 0;
  return { top: 8, right: 8, bottom, left };
};

var _tmpl$$3 = /* @__PURE__ */ template(`<svg><line></svg>`, false, true, false), _tmpl$2$3 = /* @__PURE__ */ template(`<svg><g><!$><!/><!$><!/><!$><!/></svg>`, false, true, false), _tmpl$3$3 = /* @__PURE__ */ template(`<div><!$><!/><!$><!/>`), _tmpl$4$2 = /* @__PURE__ */ template(`<div>`);
const valueLine = (geometry, position) => geometry.horizontal ? {
  x1: position,
  y1: 0,
  x2: position,
  y2: geometry.plotHeight
} : {
  x1: 0,
  y1: position,
  x2: geometry.plotWidth,
  y2: position
};
const categoryLine = (geometry, position) => geometry.horizontal ? {
  x1: 0,
  y1: position,
  x2: geometry.plotWidth,
  y2: position
} : {
  x1: position,
  y1: 0,
  x2: position,
  y2: geometry.plotHeight
};
const ChartGridLines = (props) => {
  const gridClasses = () => [styles.gridline, props.grid?.class].filter(Boolean).join(" ");
  const showHorizontal = () => props.grid && props.grid.horizontal !== false;
  const showVertical = () => props.grid?.vertical === true;
  const showBaseline = () => !!props.valueAxis && !props.valueAxis.hide && props.valueAxis.line !== false;
  return (() => {
    var _el$ = getNextElement(_tmpl$2$3), _el$3 = _el$.firstChild, [_el$4, _co$] = getNextMarker(_el$3.nextSibling), _el$5 = _el$4.nextSibling, [_el$6, _co$2] = getNextMarker(_el$5.nextSibling), _el$7 = _el$6.nextSibling, [_el$8, _co$3] = getNextMarker(_el$7.nextSibling);
    insert(_el$, createComponent(Show, {
      get when() {
        return showHorizontal();
      },
      get children() {
        return createComponent(Index, {
          get each() {
            return props.valueTicks;
          },
          children: (tick) => (() => {
            var _el$9 = getNextElement(_tmpl$$3);
            spread(_el$9, mergeProps(() => valueLine(props, tick().position), {
              get ["class"]() {
                return gridClasses();
              },
              get style() {
                return props.grid?.style;
              }
            }), true, false);
            runHydrationEvents();
            return _el$9;
          })()
        });
      }
    }), _el$4, _co$);
    insert(_el$, createComponent(Show, {
      get when() {
        return showVertical();
      },
      get children() {
        return createComponent(Index, {
          get each() {
            return props.categoryTicks;
          },
          children: (tick) => (() => {
            var _el$0 = getNextElement(_tmpl$$3);
            spread(_el$0, mergeProps(() => categoryLine(props, tick().position), {
              get ["class"]() {
                return gridClasses();
              },
              get style() {
                return props.grid?.style;
              }
            }), true, false);
            runHydrationEvents();
            return _el$0;
          })()
        });
      }
    }), _el$6, _co$2);
    insert(_el$, createComponent(Show, {
      get when() {
        return showBaseline();
      },
      get children() {
        var _el$2 = getNextElement(_tmpl$$3);
        spread(_el$2, mergeProps(() => valueLine(props, props.baseline), {
          get ["class"]() {
            return styles.baseline;
          }
        }), true, false);
        runHydrationEvents();
        return _el$2;
      }
    }), _el$8, _co$3);
    createRenderEffect(() => setAttribute(_el$, "transform", `translate(${props.margin.left} ${props.margin.top})`));
    return _el$;
  })();
};
const ChartAxisLabels = (props) => {
  const valueLabelStyle = (position) => props.horizontal ? {
    left: `${props.margin.left + position}px`,
    top: `${props.margin.top + props.plotHeight}px`,
    transform: "translate(-50%, 0)"
  } : {
    left: `${props.margin.left}px`,
    top: `${props.margin.top + position}px`,
    transform: "translate(-100%, -50%)"
  };
  const categoryLabelStyle = (position) => props.horizontal ? {
    left: `${props.margin.left}px`,
    top: `${props.margin.top + position}px`,
    transform: "translate(-100%, -50%)"
  } : {
    left: `${props.margin.left + position}px`,
    top: `${props.margin.top + props.plotHeight}px`,
    transform: "translate(-50%, 0)"
  };
  return (() => {
    var _el$1 = getNextElement(_tmpl$3$3), _el$10 = _el$1.firstChild, [_el$11, _co$4] = getNextMarker(_el$10.nextSibling), _el$12 = _el$11.nextSibling, [_el$13, _co$5] = getNextMarker(_el$12.nextSibling);
    insert(_el$1, createComponent(Show, {
      get when() {
        return memo(() => !!props.valueAxis)() && !props.valueAxis.hide;
      },
      get children() {
        return createComponent(Index, {
          get each() {
            return props.valueTicks;
          },
          children: (tick) => (() => {
            var _el$14 = getNextElement(_tmpl$4$2);
            insert(_el$14, () => tick().label);
            createRenderEffect((_p$) => {
              var _v$ = [styles["axis-label"], props.valueAxis?.class].filter(Boolean).join(" "), _v$2 = {
                ...valueLabelStyle(tick().position),
                ...props.valueAxis?.style
              };
              _v$ !== _p$.e && className(_el$14, _p$.e = _v$);
              _p$.t = style(_el$14, _v$2, _p$.t);
              return _p$;
            }, {
              e: void 0,
              t: void 0
            });
            return _el$14;
          })()
        });
      }
    }), _el$11, _co$4);
    insert(_el$1, createComponent(Show, {
      get when() {
        return memo(() => !!props.categoryAxis)() && !props.categoryAxis.hide;
      },
      get children() {
        return createComponent(Index, {
          get each() {
            return props.categoryTicks;
          },
          children: (tick) => (() => {
            var _el$15 = getNextElement(_tmpl$4$2);
            insert(_el$15, () => tick().label);
            createRenderEffect((_p$) => {
              var _v$3 = [styles["axis-label"], props.categoryAxis?.class].filter(Boolean).join(" "), _v$4 = {
                ...categoryLabelStyle(tick().position),
                ...props.categoryAxis?.style
              };
              _v$3 !== _p$.e && className(_el$15, _p$.e = _v$3);
              _p$.t = style(_el$15, _v$4, _p$.t);
              return _p$;
            }, {
              e: void 0,
              t: void 0
            });
            return _el$15;
          })()
        });
      }
    }), _el$13, _co$5);
    createRenderEffect(() => className(_el$1, styles.labels));
    return _el$1;
  })();
};

var _tmpl$$2 = /* @__PURE__ */ template(`<svg><g></svg>`, false, true, false), _tmpl$2$2 = /* @__PURE__ */ template(`<svg>`), _tmpl$3$2 = /* @__PURE__ */ template(`<svg><path></svg>`, false, true, false);
const Fill$1 = createTokenComponent();
const VALUE_AXIS_WIDTH$1 = 40;
const AXIS_HEIGHT$1 = 20;
const DEFAULT_CORNER_RADIUS = "0.25rem";
const DEFAULT_GROUP_GAP = 0.2;
const MARK_GAP = 2;
const barPath = (x, y, width, height, radius, side) => {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  if (r <= 0) return `M${x},${y}h${width}v${height}h${-width}Z`;
  switch (side) {
    case "top":
      return `M${x},${y + height}v${-(height - r)}a${r},${r} 0 0 1 ${r},${-r}h${width - r * 2}a${r},${r} 0 0 1 ${r},${r}v${height - r}Z`;
    case "bottom":
      return `M${x},${y}v${height - r}a${r},${r} 0 0 0 ${r},${r}h${width - r * 2}a${r},${r} 0 0 0 ${r},${-r}v${-(height - r)}Z`;
    case "right":
      return `M${x},${y}h${width - r}a${r},${r} 0 0 1 ${r},${r}v${height - r * 2}a${r},${r} 0 0 1 ${-r},${r}h${-(width - r)}Z`;
    default:
      return `M${x + width},${y}h${-(width - r)}a${r},${r} 0 0 0 ${-r},${r}v${height - r * 2}a${r},${r} 0 0 0 ${r},${r}h${width - r}Z`;
  }
};
const BarChart = (props) => {
  const legendToken = useToken(Legend, props.children);
  const tooltipToken = useToken(Tooltip, props.children);
  const labelsToken = useToken(Labels, props.children);
  const fillToken = useToken(Fill$1, props.children);
  const xAxisToken = useToken(XAxis, props.children);
  const yAxisToken = useToken(YAxis, props.children);
  const gridToken = useToken(Grid, props.children);
  const [size, observePlot] = useChartSize();
  const model = useChartData(() => props.data, props.onSeriesToggle);
  const frame = useChartTween(model.normalised, () => props.animation);
  let plotElement;
  const palette = () => props.palette ?? DEFAULT_PALETTE;
  const horizontal = () => props.orientation === "horizontal";
  const stacked = () => props.layout === "stacked";
  const valueAxisToken = () => horizontal() ? xAxisToken() : yAxisToken();
  const categoryAxisToken = () => horizontal() ? yAxisToken() : xAxisToken();
  const geometry = createMemo(() => {
    const {
      width,
      height
    } = size();
    if (width <= 0 || height <= 0) return null;
    const {
      data,
      values
    } = frame();
    const categories = data.categories;
    const visible = model.visibleIn(data);
    if (categories.length === 0) return null;
    const spans = computeSpans(data, values, visible, stacked());
    const domain = computeDomain(spans, props.domain, props.nice !== false);
    const margin = computeMargin({
      hasValueAxis: !!valueAxisToken() && !valueAxisToken().hide,
      hasCategoryAxis: !!categoryAxisToken() && !categoryAxisToken().hide,
      horizontal: horizontal(),
      valueAxisWidth: VALUE_AXIS_WIDTH$1,
      axisHeight: AXIS_HEIGHT$1
    });
    const plotWidth = Math.max(0, width - margin.left - margin.right);
    const plotHeight = Math.max(0, height - margin.top - margin.bottom);
    if (plotWidth <= 0 || plotHeight <= 0) return null;
    const token = fillToken();
    const groupGap = token?.groupGap ?? DEFAULT_GROUP_GAP;
    const categoryScale = createBandScale(categories.length, horizontal() ? [0, plotHeight] : [0, plotWidth], {
      paddingInner: groupGap,
      paddingOuter: groupGap / 2
    });
    const valueScale = createLinearScale(domain, horizontal() ? [0, plotWidth] : [plotHeight, 0]);
    const baseline = valueScale(0);
    const seriesCount = stacked() ? 1 : Math.max(1, visible.length);
    const innerScale = createBandScale(seriesCount, [0, categoryScale.bandwidth]);
    const natural = innerScale.bandwidth - (stacked() ? 0 : resolveLength(token?.gap, 0));
    const thickness = Math.max(1, resolveLength(token?.width, natural, innerScale.bandwidth));
    const cornerRadius = resolveLength(token?.cornerRadius ?? DEFAULT_CORNER_RADIUS, 0);
    const topOfStack = new Float64Array(categories.length);
    const bottomOfStack = new Float64Array(categories.length);
    for (const span of spans) {
      if (span.to > topOfStack[span.categoryIndex]) topOfStack[span.categoryIndex] = span.to;
      if (span.to < bottomOfStack[span.categoryIndex]) bottomOfStack[span.categoryIndex] = span.to;
    }
    const bars = spans.map((span) => {
      const slot = stacked() ? 0 : visible.indexOf(span.seriesIndex);
      const bandStart = categoryScale(span.categoryIndex);
      const inner = innerScale(slot) + (innerScale.bandwidth - thickness) / 2;
      const along = bandStart + inner;
      const fromPx = valueScale(span.from);
      const toPx = valueScale(span.to);
      const low = Math.min(fromPx, toPx);
      const extent = Math.abs(toPx - fromPx);
      const trim = stacked() && span.from !== 0 ? Math.min(MARK_GAP, extent / 2) : 0;
      const growsPositive = span.to >= span.from;
      const rect = horizontal() ? {
        x: low + (growsPositive ? trim : 0),
        y: along,
        width: Math.max(0, extent - trim),
        height: thickness
      } : {
        x: along,
        y: low + (growsPositive ? 0 : trim),
        width: thickness,
        height: Math.max(0, extent - trim)
      };
      const isOuter = !stacked() || span.to === (growsPositive ? topOfStack[span.categoryIndex] : bottomOfStack[span.categoryIndex]);
      const side = horizontal() ? growsPositive ? "right" : "left" : growsPositive ? "top" : "bottom";
      return {
        ...rect,
        seriesIndex: span.seriesIndex,
        categoryIndex: span.categoryIndex,
        value: span.to - span.from,
        d: barPath(rect.x, rect.y, rect.width, rect.height, isOuter ? cornerRadius : 0, side),
        color: resolveColor(palette(), span.seriesIndex, data.series[span.seriesIndex], data.series[span.seriesIndex]?.points?.find((p) => p.type === categories[span.categoryIndex]))
      };
    });
    const valueTicks = valueScale.ticks(valueAxisToken()?.ticks ?? gridToken()?.ticks).map((value) => ({
      position: valueScale(value),
      label: valueAxisToken()?.format ? valueAxisToken().format(value) : formatChartNumber(value)
    }));
    const categoryTicks = categories.map((category, index) => ({
      position: bandCentre(categoryScale, index),
      label: categoryAxisToken()?.format ? categoryAxisToken().format(category) : category
    }));
    warnOnMarkBudget("Chart.Bar", bars.length);
    return {
      margin,
      plotWidth,
      plotHeight,
      bars,
      categoryScale,
      valueScale,
      baseline,
      valueTicks,
      categoryTicks,
      categories,
      domain
    };
  });
  const hoverMode = () => resolveHoverMode(props.interactive, "svg");
  const resolver = createBarResolver(() => geometry()?.categoryScale ?? null, () => {
    const current = geometry();
    if (!current) return [];
    return current.bars.map((bar) => ({
      seriesIndex: bar.seriesIndex,
      categoryIndex: bar.categoryIndex,
      x: bar.x + current.margin.left,
      y: bar.y + current.margin.top,
      width: bar.width,
      height: bar.height
    }));
  }, horizontal);
  const hover = useChartHover({
    mode: hoverMode,
    // The band lookup needs the margin removed again.
    resolver: () => (x, y) => {
      const current = geometry();
      if (!current) return null;
      const local = horizontal() ? y - current.margin.top : x - current.margin.left;
      return current.categoryScale.indexAt(local) < 0 ? null : resolver(x, y);
    },
    plotElement: () => plotElement,
    size,
    toEvent: (hit) => createPointEvent(frame().data.series, frame().data.categories, hit),
    onHover: (event) => props.onPointHover?.(event),
    onClick: (event) => props.onPointClick?.(event)
  });
  const entries = createMemo(() => {
    const {
      data
    } = frame();
    return data.series.map((series, seriesIndex) => ({
      label: series.label ?? `Series ${seriesIndex + 1}`,
      color: resolveColor(palette(), seriesIndex, series),
      seriesIndex,
      visible: model.isSeriesVisible(seriesIndex, data)
    }));
  });
  const labelAnchors = createMemo(() => {
    const token = labelsToken();
    const current = geometry();
    if (!token || !current || token.show === "never") return [];
    const hovered = hover.hovered();
    const {
      data
    } = frame();
    return current.bars.reduce((acc, bar) => {
      if (token.show === "hover" && !(hovered?.seriesIndex === bar.seriesIndex && hovered?.pointIndex === bar.categoryIndex)) {
        return acc;
      }
      const category = current.categories[bar.categoryIndex];
      const series = data.series[bar.seriesIndex];
      const point = series?.points?.find((candidate) => candidate.type === category) ?? {
        type: category,
        value: bar.value
      };
      acc.push({
        key: `${bar.seriesIndex}:${category}`,
        x: current.margin.left + bar.x + bar.width / 2,
        y: current.margin.top + bar.y + bar.height / 2,
        text: token.format ? token.format(point, series) : formatChartNumber(bar.value),
        align: "center",
        seriesIndex: bar.seriesIndex,
        pointIndex: bar.categoryIndex
      });
      return acc;
    }, []);
  });
  const barClasses = (seriesIndex, categoryIndex) => {
    const list = [styles["bar-mark"]];
    if (hover.isHovered(seriesIndex, categoryIndex)) list.push(styles["is-hovered"]);
    if (fillToken()?.class) list.push(fillToken().class);
    return list.join(" ");
  };
  return createComponent(ChartRoot, {
    componentProps: props,
    get componentClass() {
      return styles.bar;
    },
    get legend() {
      return legendToken();
    },
    get tooltip() {
      return tooltipToken();
    },
    get entries() {
      return entries();
    },
    onToggle: (entry) => model.toggleSeries(entry.seriesIndex),
    get hovered() {
      return hover.hovered();
    },
    plotRef: (element) => {
      plotElement = element;
      observePlot(element);
    },
    get overlayProps() {
      return hover.overlayProps();
    },
    get showOverlay() {
      return hoverMode() === "overlay";
    },
    get children() {
      return [(() => {
        var _el$ = getNextElement(_tmpl$2$2);
        insert(_el$, createComponent(Show, {
          get when() {
            return geometry();
          },
          get children() {
            return [createComponent(ChartGridLines, {
              get margin() {
                return geometry().margin;
              },
              get plotWidth() {
                return geometry().plotWidth;
              },
              get plotHeight() {
                return geometry().plotHeight;
              },
              get valueTicks() {
                return geometry().valueTicks;
              },
              get categoryTicks() {
                return geometry().categoryTicks;
              },
              get horizontal() {
                return horizontal();
              },
              get valueAxis() {
                return valueAxisToken();
              },
              get categoryAxis() {
                return categoryAxisToken();
              },
              get grid() {
                return gridToken();
              },
              get baseline() {
                return geometry().baseline;
              }
            }), (() => {
              var _el$2 = getNextElement(_tmpl$$2);
              insert(_el$2, createComponent(Index, {
                get each() {
                  return geometry().bars;
                },
                children: (bar) => {
                  const marks = hover.markProps(() => bar().seriesIndex, () => bar().categoryIndex);
                  return (() => {
                    var _el$3 = getNextElement(_tmpl$3$2);
                    spread(_el$3, mergeProps({
                      get d() {
                        return bar().d;
                      },
                      get fill() {
                        return bar().color;
                      },
                      get ["class"]() {
                        return barClasses(bar().seriesIndex, bar().categoryIndex);
                      },
                      get style() {
                        return fillToken()?.style;
                      }
                    }, marks), true, false);
                    runHydrationEvents();
                    return _el$3;
                  })();
                }
              }));
              createRenderEffect(() => setAttribute(_el$2, "transform", `translate(${geometry().margin.left} ${geometry().margin.top})`));
              return _el$2;
            })()];
          }
        }));
        createRenderEffect((_p$) => {
          var _v$ = styles.svg, _v$2 = size().width, _v$3 = size().height, _v$4 = hoverMode() === "none" ? "none" : void 0;
          _v$ !== _p$.e && setAttribute(_el$, "class", _p$.e = _v$);
          _v$2 !== _p$.t && setAttribute(_el$, "width", _p$.t = _v$2);
          _v$3 !== _p$.a && setAttribute(_el$, "height", _p$.a = _v$3);
          _v$4 !== _p$.o && setStyleProperty(_el$, "pointer-events", _p$.o = _v$4);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        });
        return _el$;
      })(), createComponent(Show, {
        get when() {
          return geometry();
        },
        get children() {
          return createComponent(ChartAxisLabels, {
            get margin() {
              return geometry().margin;
            },
            get plotWidth() {
              return geometry().plotWidth;
            },
            get plotHeight() {
              return geometry().plotHeight;
            },
            get valueTicks() {
              return geometry().valueTicks;
            },
            get categoryTicks() {
              return geometry().categoryTicks;
            },
            get horizontal() {
              return horizontal();
            },
            get valueAxis() {
              return valueAxisToken();
            },
            get categoryAxis() {
              return categoryAxisToken();
            }
          });
        }
      }), createComponent(Show, {
        get when() {
          return labelsToken();
        },
        get children() {
          return createComponent(ChartLabels, {
            get token() {
              return labelsToken();
            },
            get anchors() {
              return labelAnchors();
            }
          });
        }
      })];
    }
  });
};
const Bar = Object.assign(BarChart, {
  Fill: Fill$1
});

const CUBIC_SAMPLES = 16;
const cubicLength = (x0, y0, x1, y1, x2, y2, x3, y3) => {
  let length = 0;
  let px = x0;
  let py = y0;
  for (let i = 1; i <= CUBIC_SAMPLES; i++) {
    const t = i / CUBIC_SAMPLES;
    const mt = 1 - t;
    const a = mt * mt * mt;
    const b = 3 * mt * mt * t;
    const c = 3 * mt * t * t;
    const d = t * t * t;
    const x = a * x0 + b * x1 + c * x2 + d * x3;
    const y = a * y0 + b * y1 + c * y2 + d * y3;
    length += Math.hypot(x - px, y - py);
    px = x;
    py = y;
  }
  return length;
};
const COMMANDS = /([MLCZmlcz])([^MLCZmlcz]*)/g;
const NUMBERS = /-?\d*\.?\d+(?:e[-+]?\d+)?/gi;
const measurePathLength = (d) => {
  if (!d) return 0;
  let length = 0;
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;
  COMMANDS.lastIndex = 0;
  let command;
  while ((command = COMMANDS.exec(d)) !== null) {
    const type = command[1].toUpperCase();
    const numbers = (command[2].match(NUMBERS) ?? []).map(Number);
    if (type === "M") {
      for (let i = 0; i + 1 < numbers.length; i += 2) {
        x = numbers[i];
        y = numbers[i + 1];
        if (i === 0) {
          startX = x;
          startY = y;
        }
      }
    } else if (type === "L") {
      for (let i = 0; i + 1 < numbers.length; i += 2) {
        length += Math.hypot(numbers[i] - x, numbers[i + 1] - y);
        x = numbers[i];
        y = numbers[i + 1];
      }
    } else if (type === "C") {
      for (let i = 0; i + 5 < numbers.length; i += 6) {
        length += cubicLength(
          x,
          y,
          numbers[i],
          numbers[i + 1],
          numbers[i + 2],
          numbers[i + 3],
          numbers[i + 4],
          numbers[i + 5]
        );
        x = numbers[i + 4];
        y = numbers[i + 5];
      }
    } else if (type === "Z") {
      length += Math.hypot(startX - x, startY - y);
      x = startX;
      y = startY;
    }
  }
  return length;
};

const useDrawOn = (ready, animation) => {
  const [progress, setProgress] = createSignal(1);
  let handle = 0;
  let started = false;
  onCleanup(() => cancelAnimationFrame(handle));
  createEffect(() => {
    if (started || !ready()) return;
    started = true;
    const config = animation();
    const duration = config?.duration ?? 300;
    if (!config || duration <= 0) return;
    setProgress(0);
    const start = performance.now() + (config.delay ?? 0);
    const step = (now) => {
      const elapsed = now - start;
      const t = elapsed <= 0 ? 0 : Math.min(1, elapsed / duration);
      setProgress(t);
      if (t < 1) handle = requestAnimationFrame(step);
    };
    handle = requestAnimationFrame(step);
  });
  return progress;
};

var _tmpl$$1 = /* @__PURE__ */ template(`<svg><g></svg>`, false, true, false), _tmpl$2$1 = /* @__PURE__ */ template(`<svg>`), _tmpl$3$1 = /* @__PURE__ */ template(`<svg><path></svg>`, false, true, false), _tmpl$4$1 = /* @__PURE__ */ template(`<svg><path fill=none></svg>`, false, true, false), _tmpl$5$1 = /* @__PURE__ */ template(`<svg><circle></svg>`, false, true, false);
const CURVES = {
  "linear": curveLinear,
  "smooth": monotoneX,
  "step": curveStep,
  "step-before": stepBefore,
  "step-after": stepAfter
};
const resolveCurve = (curve) => CURVES[curve ?? "linear"] ?? curveLinear;
const VALUE_AXIS_WIDTH = 40;
const AXIS_HEIGHT = 20;
const DEFAULT_STROKE_WIDTH$1 = "0.125rem";
const DEFAULT_POINT_RADIUS$1 = "0.25rem";
const DEFAULT_AREA_OPACITY = 0.25;
const createSeriesChart = (config) => (props) => {
  const legendToken = useToken(Legend, props.children);
  const tooltipToken = useToken(Tooltip, props.children);
  const labelsToken = useToken(Labels, props.children);
  const strokeToken = useToken(config.strokeTokenizer, props.children);
  const pointToken = useToken(config.pointTokenizer, props.children);
  const fillToken = config.fillTokenizer ? useToken(config.fillTokenizer, props.children) : () => null;
  const xAxisToken = useToken(XAxis, props.children);
  const yAxisToken = useToken(YAxis, props.children);
  const gridToken = useToken(Grid, props.children);
  const [size, observePlot] = useChartSize();
  const model = useChartData(() => props.data, props.onSeriesToggle);
  const frame = useChartTween(model.normalised, () => props.animation);
  let plotElement;
  const palette = () => props.palette ?? DEFAULT_PALETTE;
  const isArea = () => config.mode === "area";
  const stacked = () => isArea() && props.stacked === true;
  const curve = () => resolveCurve(strokeToken()?.curve ?? fillToken()?.curve ?? props.curve);
  const geometry = createMemo(() => {
    const {
      width,
      height
    } = size();
    if (width <= 0 || height <= 0) return null;
    const {
      data,
      values
    } = frame();
    const categories = data.categories;
    const visible = model.visibleIn(data);
    if (categories.length === 0) return null;
    const spans = computeSpans(data, values, visible, stacked());
    const domain = computeDomain(spans, props.domain, props.nice !== false);
    const margin = computeMargin({
      hasValueAxis: !!yAxisToken() && !yAxisToken().hide,
      hasCategoryAxis: !!xAxisToken() && !xAxisToken().hide,
      horizontal: false,
      valueAxisWidth: VALUE_AXIS_WIDTH,
      axisHeight: AXIS_HEIGHT
    });
    const plotWidth = Math.max(0, width - margin.left - margin.right);
    const plotHeight = Math.max(0, height - margin.top - margin.bottom);
    if (plotWidth <= 0 || plotHeight <= 0) return null;
    const xScale = createBandScale(categories.length, [0, plotWidth]);
    const yScale = createLinearScale(domain, [plotHeight, 0]);
    const baseline = yScale(0);
    const connect = props.connectNulls !== false;
    const byCategory = /* @__PURE__ */ new Map();
    for (const span of spans) {
      byCategory.set(`${span.seriesIndex}:${span.categoryIndex}`, span);
    }
    const series = visible.map((seriesIndex) => {
      const offset = seriesIndex * categories.length;
      const vertices = categories.map((_, categoryIndex) => {
        const span = byCategory.get(`${seriesIndex}:${categoryIndex}`) ?? {
          from: 0,
          to: 0
        };
        return {
          categoryIndex,
          x: bandCentre(xScale, categoryIndex),
          y: yScale(span.to),
          y0: yScale(stacked() ? span.from : 0),
          value: span.to - span.from,
          defined: connect || data.present[offset + categoryIndex] === 1
        };
      });
      const lineGenerator = line().x((vertex) => vertex.x).y((vertex) => vertex.y).defined((vertex) => vertex.defined).curve(curve());
      const areaGenerator = area().x((vertex) => vertex.x).y0((vertex) => vertex.y0).y1((vertex) => vertex.y).defined((vertex) => vertex.defined).curve(curve());
      return {
        seriesIndex,
        vertices,
        stroke: lineGenerator(vertices) ?? "",
        fill: isArea() ? areaGenerator(vertices) ?? "" : "",
        color: resolveColor(palette(), seriesIndex, data.series[seriesIndex])
      };
    });
    const valueTicks = yScale.ticks(yAxisToken()?.ticks ?? gridToken()?.ticks).map((value) => ({
      position: yScale(value),
      label: yAxisToken()?.format ? yAxisToken().format(value) : formatChartNumber(value)
    }));
    const categoryTicks = categories.map((category, index) => ({
      position: bandCentre(xScale, index),
      label: xAxisToken()?.format ? xAxisToken().format(category) : category
    }));
    warnOnMarkBudget(config.displayName, series.length * (2 + categories.length));
    return {
      margin,
      plotWidth,
      plotHeight,
      series,
      baseline,
      valueTicks,
      categoryTicks,
      categories,
      xScale,
      yScale
    };
  });
  const hoverMode = () => resolveHoverMode(props.interactive, "overlay");
  const resolver = createNearestVertexResolver(() => {
    const current = geometry();
    if (!current) return [];
    return current.series.flatMap((series) => series.vertices.filter((vertex) => vertex.defined).map((vertex) => ({
      seriesIndex: series.seriesIndex,
      categoryIndex: vertex.categoryIndex,
      x: vertex.x + current.margin.left,
      y: vertex.y + current.margin.top
    })));
  }, () => {
    const current = geometry();
    if (!current) return null;
    return {
      left: current.margin.left,
      right: current.margin.left + current.plotWidth,
      top: current.margin.top,
      bottom: current.margin.top + current.plotHeight
    };
  });
  const hover = useChartHover({
    mode: hoverMode,
    resolver: () => resolver,
    plotElement: () => plotElement,
    size,
    toEvent: (hit) => createPointEvent(frame().data.series, frame().data.categories, hit),
    onHover: (event) => props.onPointHover?.(event),
    onClick: (event) => props.onPointClick?.(event)
  });
  const entries = createMemo(() => {
    const {
      data
    } = frame();
    return data.series.map((series, seriesIndex) => ({
      label: series.label ?? `Series ${seriesIndex + 1}`,
      color: resolveColor(palette(), seriesIndex, series),
      seriesIndex,
      visible: model.isSeriesVisible(seriesIndex, data)
    }));
  });
  const showPoint = (seriesIndex, categoryIndex) => {
    const show = pointToken()?.show ?? "hover";
    if (show === "never") return false;
    if (show === "always") return true;
    return hover.isHovered(seriesIndex, categoryIndex);
  };
  const labelAnchors = createMemo(() => {
    const token = labelsToken();
    const current = geometry();
    if (!token || !current || token.show === "never") return [];
    const hovered = hover.hovered();
    const {
      data
    } = frame();
    return current.series.flatMap((series) => series.vertices.reduce((acc, vertex) => {
      if (!vertex.defined) return acc;
      if (token.show === "hover" && !(hovered?.seriesIndex === series.seriesIndex && hovered?.pointIndex === vertex.categoryIndex)) {
        return acc;
      }
      const category = current.categories[vertex.categoryIndex];
      const source = data.series[series.seriesIndex];
      const point = source?.points?.find((candidate) => candidate.type === category) ?? {
        type: category,
        value: vertex.value
      };
      acc.push({
        key: `${series.seriesIndex}:${category}`,
        x: current.margin.left + vertex.x,
        // Sit above the vertex so the label never covers its own point.
        y: current.margin.top + vertex.y - 12,
        text: token.format ? token.format(point, source) : formatChartNumber(vertex.value),
        align: "center",
        seriesIndex: series.seriesIndex,
        pointIndex: vertex.categoryIndex
      });
      return acc;
    }, []));
  });
  const strokeWidth = () => resolveLength(strokeToken()?.width ?? DEFAULT_STROKE_WIDTH$1, 0);
  const pointRadius = () => resolveLength(pointToken()?.radius ?? DEFAULT_POINT_RADIUS$1, 0);
  const reveal = useDrawOn(() => !!geometry(), () => props.animation);
  const revealProps = (path) => {
    if (reveal() >= 1) return {
      "stroke-dasharray": strokeToken()?.dash
    };
    const length = measurePathLength(path);
    return {
      "stroke-dasharray": `${length}`,
      "stroke-dashoffset": `${length * (1 - reveal())}`
    };
  };
  return createComponent(ChartRoot, {
    componentProps: props,
    get componentClass() {
      return config.componentClass;
    },
    get legend() {
      return legendToken();
    },
    get tooltip() {
      return tooltipToken();
    },
    get entries() {
      return entries();
    },
    onToggle: (entry) => model.toggleSeries(entry.seriesIndex),
    get hovered() {
      return hover.hovered();
    },
    plotRef: (element) => {
      plotElement = element;
      observePlot(element);
    },
    get overlayProps() {
      return hover.overlayProps();
    },
    get showOverlay() {
      return hoverMode() === "overlay";
    },
    get children() {
      return [(() => {
        var _el$ = getNextElement(_tmpl$2$1);
        insert(_el$, createComponent(Show, {
          get when() {
            return geometry();
          },
          get children() {
            return [createComponent(ChartGridLines, {
              get margin() {
                return geometry().margin;
              },
              get plotWidth() {
                return geometry().plotWidth;
              },
              get plotHeight() {
                return geometry().plotHeight;
              },
              get valueTicks() {
                return geometry().valueTicks;
              },
              get categoryTicks() {
                return geometry().categoryTicks;
              },
              horizontal: false,
              get valueAxis() {
                return yAxisToken();
              },
              get categoryAxis() {
                return xAxisToken();
              },
              get grid() {
                return gridToken();
              },
              get baseline() {
                return geometry().baseline;
              }
            }), (() => {
              var _el$2 = getNextElement(_tmpl$$1);
              insert(_el$2, createComponent(Index, {
                get each() {
                  return geometry().series;
                },
                children: (series) => [createComponent(Show, {
                  get when() {
                    return isArea();
                  },
                  get children() {
                    var _el$3 = getNextElement(_tmpl$3$1);
                    createRenderEffect((_p$) => {
                      var _v$5 = series().fill, _v$6 = series().color, _v$7 = fillToken()?.opacity ?? DEFAULT_AREA_OPACITY, _v$8 = [styles["area-fill"], fillToken()?.class].filter(Boolean).join(" "), _v$9 = fillToken()?.style;
                      _v$5 !== _p$.e && setAttribute(_el$3, "d", _p$.e = _v$5);
                      _v$6 !== _p$.t && setAttribute(_el$3, "fill", _p$.t = _v$6);
                      _v$7 !== _p$.a && setAttribute(_el$3, "opacity", _p$.a = _v$7);
                      _v$8 !== _p$.o && setAttribute(_el$3, "class", _p$.o = _v$8);
                      _p$.i = style(_el$3, _v$9, _p$.i);
                      return _p$;
                    }, {
                      e: void 0,
                      t: void 0,
                      a: void 0,
                      o: void 0,
                      i: void 0
                    });
                    return _el$3;
                  }
                }), (() => {
                  var _el$4 = getNextElement(_tmpl$4$1);
                  spread(_el$4, mergeProps({
                    get d() {
                      return series().stroke;
                    },
                    get stroke() {
                      return series().color;
                    },
                    get ["stroke-width"]() {
                      return strokeWidth();
                    },
                    get ["class"]() {
                      return [styles["series-stroke"], strokeToken()?.class].filter(Boolean).join(" ");
                    },
                    get style() {
                      return strokeToken()?.style;
                    }
                  }, () => revealProps(series().stroke)), true, false);
                  runHydrationEvents();
                  return _el$4;
                })(), createComponent(Index, {
                  get each() {
                    return series().vertices;
                  },
                  children: (vertex) => createComponent(Show, {
                    get when() {
                      return memo(() => !!vertex().defined)() && showPoint(series().seriesIndex, vertex().categoryIndex);
                    },
                    get children() {
                      var _el$5 = getNextElement(_tmpl$5$1);
                      createRenderEffect((_p$) => {
                        var _v$0 = vertex().x, _v$1 = vertex().y, _v$10 = pointRadius(), _v$11 = series().color, _v$12 = [styles["series-point"], pointToken()?.class].filter(Boolean).join(" "), _v$13 = pointToken()?.style;
                        _v$0 !== _p$.e && setAttribute(_el$5, "cx", _p$.e = _v$0);
                        _v$1 !== _p$.t && setAttribute(_el$5, "cy", _p$.t = _v$1);
                        _v$10 !== _p$.a && setAttribute(_el$5, "r", _p$.a = _v$10);
                        _v$11 !== _p$.o && setAttribute(_el$5, "fill", _p$.o = _v$11);
                        _v$12 !== _p$.i && setAttribute(_el$5, "class", _p$.i = _v$12);
                        _p$.n = style(_el$5, _v$13, _p$.n);
                        return _p$;
                      }, {
                        e: void 0,
                        t: void 0,
                        a: void 0,
                        o: void 0,
                        i: void 0,
                        n: void 0
                      });
                      return _el$5;
                    }
                  })
                })]
              }));
              createRenderEffect(() => setAttribute(_el$2, "transform", `translate(${geometry().margin.left} ${geometry().margin.top})`));
              return _el$2;
            })()];
          }
        }));
        createRenderEffect((_p$) => {
          var _v$ = styles.svg, _v$2 = size().width, _v$3 = size().height, _v$4 = hoverMode() === "none" ? "none" : void 0;
          _v$ !== _p$.e && setAttribute(_el$, "class", _p$.e = _v$);
          _v$2 !== _p$.t && setAttribute(_el$, "width", _p$.t = _v$2);
          _v$3 !== _p$.a && setAttribute(_el$, "height", _p$.a = _v$3);
          _v$4 !== _p$.o && setStyleProperty(_el$, "pointer-events", _p$.o = _v$4);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        });
        return _el$;
      })(), createComponent(Show, {
        get when() {
          return geometry();
        },
        get children() {
          return createComponent(ChartAxisLabels, {
            get margin() {
              return geometry().margin;
            },
            get plotWidth() {
              return geometry().plotWidth;
            },
            get plotHeight() {
              return geometry().plotHeight;
            },
            get valueTicks() {
              return geometry().valueTicks;
            },
            get categoryTicks() {
              return geometry().categoryTicks;
            },
            horizontal: false,
            get valueAxis() {
              return yAxisToken();
            },
            get categoryAxis() {
              return xAxisToken();
            }
          });
        }
      }), createComponent(Show, {
        get when() {
          return labelsToken();
        },
        get children() {
          return createComponent(ChartLabels, {
            get token() {
              return labelsToken();
            },
            get anchors() {
              return labelAnchors();
            }
          });
        }
      })];
    }
  });
};

const Stroke$1 = createTokenComponent();
const Point$1 = createTokenComponent();
const LineChart = createSeriesChart({
  componentClass: styles.line,
  displayName: "Chart.Line",
  mode: "line",
  strokeTokenizer: Stroke$1,
  pointTokenizer: Point$1
});
const Line = Object.assign(LineChart, {
  Stroke: Stroke$1,
  Point: Point$1
});

const Fill = createTokenComponent();
const Stroke = createTokenComponent();
const Point = createTokenComponent();
const AreaChart = createSeriesChart({
  componentClass: styles.area,
  displayName: "Chart.Area",
  mode: "area",
  strokeTokenizer: Stroke,
  pointTokenizer: Point,
  fillTokenizer: Fill
});
const Area = Object.assign(AreaChart, {
  Fill,
  Stroke,
  Point
});

var _tmpl$ = /* @__PURE__ */ template(`<svg><g><!$><!/><!$><!/><!$><!/></svg>`, false, true, false), _tmpl$2 = /* @__PURE__ */ template(`<svg>`), _tmpl$3 = /* @__PURE__ */ template(`<svg><path></svg>`, false, true, false), _tmpl$4 = /* @__PURE__ */ template(`<svg><circle cx=0 cy=0></svg>`, false, true, false), _tmpl$5 = /* @__PURE__ */ template(`<svg><line x1=0 y1=0></svg>`, false, true, false), _tmpl$6 = /* @__PURE__ */ template(`<svg><circle></svg>`, false, true, false);
const Shape = createTokenComponent();
const Web = createTokenComponent();
const Axis = createTokenComponent();
const DEG = Math.PI / 180;
const TAU = Math.PI * 2;
const DEFAULT_LEVELS = 4;
const DEFAULT_FILL_OPACITY = 0.25;
const DEFAULT_STROKE_WIDTH = "0.125rem";
const DEFAULT_POINT_RADIUS = "0.1875rem";
const LABEL_GAP = 12;
const LABEL_RESERVE = 44;
const project = (angle, radius) => ({
  x: Math.sin(angle) * radius,
  y: -Math.cos(angle) * radius
});
const polygonPath = (angles, radius) => {
  if (angles.length === 0) return "";
  return `${angles.map((angle, index) => {
    const {
      x,
      y
    } = project(angle, radius);
    return `${index === 0 ? "M" : "L"}${x},${y}`;
  }).join("")}Z`;
};
const SpiderChart = (props) => {
  const legendToken = useToken(Legend, props.children);
  const tooltipToken = useToken(Tooltip, props.children);
  const labelsToken = useToken(Labels, props.children);
  const shapeToken = useToken(Shape, props.children);
  const webToken = useToken(Web, props.children);
  const axisToken = useToken(Axis, props.children);
  const [size, observePlot] = useChartSize();
  const model = useChartData(() => props.data, props.onSeriesToggle);
  const frame = useChartTween(model.normalised, () => props.animation);
  let plotElement;
  const palette = () => props.palette ?? DEFAULT_PALETTE;
  const geometry = createMemo(() => {
    const {
      width,
      height
    } = size();
    if (width <= 0 || height <= 0) return null;
    const {
      data,
      values
    } = frame();
    const categories = data.categories;
    const visible = model.visibleIn(data);
    if (categories.length < 3) {
      if (categories.length > 0) ;
      return null;
    }
    const outerRadius = Math.min(width, height) / 2 - (axisToken() ? LABEL_RESERVE : 0);
    if (outerRadius <= 0) return null;
    const centre = {
      x: width / 2,
      y: height / 2
    };
    const start = (props.startAngle ?? 0) * DEG;
    const angles = categories.map((_, index) => start + index * TAU / categories.length);
    let dataMax = 0;
    for (const seriesIndex of visible) {
      const offset = seriesIndex * categories.length;
      for (let c = 0; c < categories.length; c++) {
        const value = values[offset + c] ?? 0;
        if (value > dataMax) dataMax = value;
      }
    }
    const max = props.maxValue ?? (dataMax > 0 ? niceDomain(0, dataMax)[1] : 1);
    const radial = createLinearScale([0, max], [0, outerRadius]);
    const series = visible.map((seriesIndex) => {
      const offset = seriesIndex * categories.length;
      const vertices = categories.map((_, categoryIndex) => {
        const raw = values[offset + categoryIndex] ?? 0;
        const radius = radial(Math.max(0, raw));
        const angle = angles[categoryIndex];
        return {
          categoryIndex,
          angle,
          radius,
          value: Math.max(0, raw),
          ...project(angle, radius)
        };
      });
      return {
        seriesIndex,
        vertices,
        d: `${vertices.map((vertex, index) => `${index === 0 ? "M" : "L"}${vertex.x},${vertex.y}`).join("")}Z`,
        color: resolveColor(palette(), seriesIndex, data.series[seriesIndex])
      };
    });
    const levels = webToken()?.levels ?? DEFAULT_LEVELS;
    const rings = Array.from({
      length: levels
    }, (_, index) => {
      const radius = outerRadius * (index + 1) / levels;
      return {
        radius,
        d: polygonPath(angles, radius)
      };
    });
    const spokes = angles.map((angle) => ({
      angle,
      ...project(angle, outerRadius)
    }));
    warnOnMarkBudget("Chart.Spider", series.length * (1 + categories.length));
    return {
      centre,
      outerRadius,
      angles,
      series,
      rings,
      spokes,
      categories,
      max
    };
  });
  const hoverMode = () => resolveHoverMode(props.interactive, "overlay");
  const resolver = createSpiderResolver(() => geometry()?.centre ?? {
    x: 0,
    y: 0
  }, () => {
    const current = geometry();
    if (!current) return [];
    return current.series.flatMap((series) => series.vertices.map((vertex) => ({
      seriesIndex: series.seriesIndex,
      categoryIndex: vertex.categoryIndex,
      angle: vertex.angle,
      radius: vertex.radius
    })));
  }, () => geometry()?.outerRadius ?? 0);
  const hover = useChartHover({
    mode: hoverMode,
    resolver: () => resolver,
    plotElement: () => plotElement,
    size,
    toEvent: (hit) => createPointEvent(frame().data.series, frame().data.categories, hit),
    onHover: (event) => props.onPointHover?.(event),
    onClick: (event) => props.onPointClick?.(event)
  });
  const entries = createMemo(() => {
    const {
      data
    } = frame();
    return data.series.map((series, seriesIndex) => ({
      label: series.label ?? `Series ${seriesIndex + 1}`,
      color: resolveColor(palette(), seriesIndex, series),
      seriesIndex,
      visible: model.isSeriesVisible(seriesIndex, data)
    }));
  });
  const axisLabelToken = createMemo(() => ({
    class: axisToken()?.class
  }));
  const axisLabels = createMemo(() => {
    const token = axisToken();
    const current = geometry();
    if (!token || !current) return [];
    return current.categories.map((category, index) => {
      const angle = current.angles[index];
      const offset = project(angle, current.outerRadius + LABEL_GAP);
      const horizontal = Math.sin(angle);
      return {
        key: category,
        x: current.centre.x + offset.x,
        y: current.centre.y + offset.y,
        text: token.format ? token.format(category) : category,
        // Near the top or bottom the label wants centring; to either
        // side it should grow away from the web.
        align: Math.abs(horizontal) < 0.2 ? "center" : horizontal > 0 ? "start" : "end",
        seriesIndex: -1,
        pointIndex: index
      };
    });
  });
  const valueLabels = createMemo(() => {
    const token = labelsToken();
    const current = geometry();
    if (!token || !current || token.show === "never") return [];
    const hovered = hover.hovered();
    const {
      data
    } = frame();
    return current.series.flatMap((series) => series.vertices.reduce((acc, vertex) => {
      if (token.show === "hover" && !(hovered?.seriesIndex === series.seriesIndex && hovered?.pointIndex === vertex.categoryIndex)) {
        return acc;
      }
      const category = current.categories[vertex.categoryIndex];
      const source = data.series[series.seriesIndex];
      const point = source?.points?.find((candidate) => candidate.type === category) ?? {
        type: category,
        value: vertex.value
      };
      acc.push({
        key: `${series.seriesIndex}:${category}`,
        x: current.centre.x + vertex.x,
        y: current.centre.y + vertex.y - 12,
        text: token.format ? token.format(point, source) : formatChartNumber(vertex.value),
        align: "center",
        seriesIndex: series.seriesIndex,
        pointIndex: vertex.categoryIndex
      });
      return acc;
    }, []));
  });
  const shapeClasses = (seriesIndex) => {
    const list = [styles["spider-shape"]];
    if (hover.hovered()?.seriesIndex === seriesIndex) list.push(styles["is-hovered"]);
    if (shapeToken()?.class) list.push(shapeToken().class);
    return list.join(" ");
  };
  const pointRadius = () => resolveLength(shapeToken()?.pointRadius ?? DEFAULT_POINT_RADIUS, 0);
  return createComponent(ChartRoot, {
    componentProps: props,
    get componentClass() {
      return styles.spider;
    },
    get legend() {
      return legendToken();
    },
    get tooltip() {
      return tooltipToken();
    },
    get entries() {
      return entries();
    },
    onToggle: (entry) => model.toggleSeries(entry.seriesIndex),
    get hovered() {
      return hover.hovered();
    },
    plotRef: (element) => {
      plotElement = element;
      observePlot(element);
    },
    get overlayProps() {
      return hover.overlayProps();
    },
    get showOverlay() {
      return hoverMode() === "overlay";
    },
    get children() {
      return [(() => {
        var _el$ = getNextElement(_tmpl$2);
        insert(_el$, createComponent(Show, {
          get when() {
            return geometry();
          },
          get children() {
            var _el$2 = getNextElement(_tmpl$), _el$3 = _el$2.firstChild, [_el$4, _co$] = getNextMarker(_el$3.nextSibling), _el$5 = _el$4.nextSibling, [_el$6, _co$2] = getNextMarker(_el$5.nextSibling), _el$7 = _el$6.nextSibling, [_el$8, _co$3] = getNextMarker(_el$7.nextSibling);
            insert(_el$2, createComponent(Show, {
              get when() {
                return webToken();
              },
              get children() {
                return createComponent(Index, {
                  get each() {
                    return geometry().rings;
                  },
                  children: (ring) => createComponent(Show, {
                    get when() {
                      return webToken()?.shape !== "circle";
                    },
                    get fallback() {
                      return (() => {
                        var _el$0 = getNextElement(_tmpl$4);
                        createRenderEffect((_p$) => {
                          var _v$8 = ring().radius, _v$9 = [styles["spider-web"], webToken()?.class].filter(Boolean).join(" "), _v$0 = webToken()?.style;
                          _v$8 !== _p$.e && setAttribute(_el$0, "r", _p$.e = _v$8);
                          _v$9 !== _p$.t && setAttribute(_el$0, "class", _p$.t = _v$9);
                          _p$.a = style(_el$0, _v$0, _p$.a);
                          return _p$;
                        }, {
                          e: void 0,
                          t: void 0,
                          a: void 0
                        });
                        return _el$0;
                      })();
                    },
                    get children() {
                      var _el$9 = getNextElement(_tmpl$3);
                      createRenderEffect((_p$) => {
                        var _v$5 = ring().d, _v$6 = [styles["spider-web"], webToken()?.class].filter(Boolean).join(" "), _v$7 = webToken()?.style;
                        _v$5 !== _p$.e && setAttribute(_el$9, "d", _p$.e = _v$5);
                        _v$6 !== _p$.t && setAttribute(_el$9, "class", _p$.t = _v$6);
                        _p$.a = style(_el$9, _v$7, _p$.a);
                        return _p$;
                      }, {
                        e: void 0,
                        t: void 0,
                        a: void 0
                      });
                      return _el$9;
                    }
                  })
                });
              }
            }), _el$4, _co$);
            insert(_el$2, createComponent(Show, {
              get when() {
                return memo(() => !!axisToken())() && axisToken().line !== false;
              },
              get children() {
                return createComponent(Index, {
                  get each() {
                    return geometry().spokes;
                  },
                  children: (spoke) => (() => {
                    var _el$1 = getNextElement(_tmpl$5);
                    createRenderEffect((_p$) => {
                      var _v$1 = spoke().x, _v$10 = spoke().y, _v$11 = [styles["spider-spoke"], axisToken()?.class].filter(Boolean).join(" "), _v$12 = axisToken()?.style;
                      _v$1 !== _p$.e && setAttribute(_el$1, "x2", _p$.e = _v$1);
                      _v$10 !== _p$.t && setAttribute(_el$1, "y2", _p$.t = _v$10);
                      _v$11 !== _p$.a && setAttribute(_el$1, "class", _p$.a = _v$11);
                      _p$.o = style(_el$1, _v$12, _p$.o);
                      return _p$;
                    }, {
                      e: void 0,
                      t: void 0,
                      a: void 0,
                      o: void 0
                    });
                    return _el$1;
                  })()
                });
              }
            }), _el$6, _co$2);
            insert(_el$2, createComponent(Index, {
              get each() {
                return geometry().series;
              },
              children: (series) => [(() => {
                var _el$10 = getNextElement(_tmpl$3);
                createRenderEffect((_p$) => {
                  var _v$13 = series().d, _v$14 = series().color, _v$15 = series().color, _v$16 = resolveLength(shapeToken()?.strokeWidth ?? DEFAULT_STROKE_WIDTH, 0), _v$17 = shapeToken()?.fillOpacity ?? DEFAULT_FILL_OPACITY, _v$18 = shapeClasses(series().seriesIndex), _v$19 = shapeToken()?.style;
                  _v$13 !== _p$.e && setAttribute(_el$10, "d", _p$.e = _v$13);
                  _v$14 !== _p$.t && setAttribute(_el$10, "fill", _p$.t = _v$14);
                  _v$15 !== _p$.a && setAttribute(_el$10, "stroke", _p$.a = _v$15);
                  _v$16 !== _p$.o && setAttribute(_el$10, "stroke-width", _p$.o = _v$16);
                  _v$17 !== _p$.i && setAttribute(_el$10, "fill-opacity", _p$.i = _v$17);
                  _v$18 !== _p$.n && setAttribute(_el$10, "class", _p$.n = _v$18);
                  _p$.s = style(_el$10, _v$19, _p$.s);
                  return _p$;
                }, {
                  e: void 0,
                  t: void 0,
                  a: void 0,
                  o: void 0,
                  i: void 0,
                  n: void 0,
                  s: void 0
                });
                return _el$10;
              })(), createComponent(Show, {
                get when() {
                  return pointRadius() > 0;
                },
                get children() {
                  return createComponent(Index, {
                    get each() {
                      return series().vertices;
                    },
                    children: (vertex) => (() => {
                      var _el$11 = getNextElement(_tmpl$6);
                      createRenderEffect((_p$) => {
                        var _v$20 = vertex().x, _v$21 = vertex().y, _v$22 = pointRadius(), _v$23 = series().color, _v$24 = styles["series-point"];
                        _v$20 !== _p$.e && setAttribute(_el$11, "cx", _p$.e = _v$20);
                        _v$21 !== _p$.t && setAttribute(_el$11, "cy", _p$.t = _v$21);
                        _v$22 !== _p$.a && setAttribute(_el$11, "r", _p$.a = _v$22);
                        _v$23 !== _p$.o && setAttribute(_el$11, "fill", _p$.o = _v$23);
                        _v$24 !== _p$.i && setAttribute(_el$11, "class", _p$.i = _v$24);
                        return _p$;
                      }, {
                        e: void 0,
                        t: void 0,
                        a: void 0,
                        o: void 0,
                        i: void 0
                      });
                      return _el$11;
                    })()
                  });
                }
              })]
            }), _el$8, _co$3);
            createRenderEffect(() => setAttribute(_el$2, "transform", `translate(${geometry().centre.x} ${geometry().centre.y})`));
            return _el$2;
          }
        }));
        createRenderEffect((_p$) => {
          var _v$ = styles.svg, _v$2 = size().width, _v$3 = size().height, _v$4 = hoverMode() === "none" ? "none" : void 0;
          _v$ !== _p$.e && setAttribute(_el$, "class", _p$.e = _v$);
          _v$2 !== _p$.t && setAttribute(_el$, "width", _p$.t = _v$2);
          _v$3 !== _p$.a && setAttribute(_el$, "height", _p$.a = _v$3);
          _v$4 !== _p$.o && setStyleProperty(_el$, "pointer-events", _p$.o = _v$4);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        });
        return _el$;
      })(), createComponent(Show, {
        get when() {
          return axisToken();
        },
        get children() {
          return createComponent(ChartLabels, {
            get token() {
              return axisLabelToken();
            },
            get anchors() {
              return axisLabels();
            }
          });
        }
      }), createComponent(Show, {
        get when() {
          return labelsToken();
        },
        get children() {
          return createComponent(ChartLabels, {
            get token() {
              return labelsToken();
            },
            get anchors() {
              return valueLabels();
            }
          });
        }
      })];
    }
  });
};
const Spider = Object.assign(SpiderChart, {
  Shape,
  Web,
  Axis
});

const Chart = () => [];
const Chart$1 = Object.assign(Chart, {
  Pie,
  Donut,
  Bar,
  Line,
  Area,
  Spider,
  Legend,
  Tooltip,
  Labels,
  XAxis,
  YAxis,
  Grid
});

export { Chart$1 as C };
