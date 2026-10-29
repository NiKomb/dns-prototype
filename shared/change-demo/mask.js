// Rounded holes are painted black into one SVG mask: overlaps form a union.
// The original outline is clipped afterwards, so scrolling never invents corners.
const number = value => Number(value.toFixed(3));
export function targetOutline(target) {
  const rect = target.getBoundingClientRect(), style = getComputedStyle(target);
  const scaleX = target.offsetWidth ? rect.width / target.offsetWidth : 1;
  const scaleY = target.offsetHeight ? rect.height / target.offsetHeight : 1;
  const length = (value, extent, scale) => value.endsWith('%') ? parseFloat(value) * extent / 100 : parseFloat(value) * scale;
  const radii = ['borderTopLeftRadius','borderTopRightRadius','borderBottomRightRadius','borderBottomLeftRadius'].map(key => {
    const [x, y = x] = style[key].split(/\s+/);
    return [length(x, rect.width, scaleX), length(y, rect.height, scaleY)];
  });
  const [tl,tr,br,bl] = radii;
  const ratio = Math.min(1, rect.width / (tl[0] + tr[0]), rect.width / (bl[0] + br[0]), rect.height / (tl[1] + bl[1]), rect.height / (tr[1] + br[1]));
  for (const radius of radii) {radius[0] *= ratio; radius[1] *= ratio;}
  return {left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom, radii};
}
function roundedPath({left:x, top:y, right:r, bottom:b, radii:[tl,tr,br,bl]}) {
  const point = (x,y) => `${number(x)} ${number(y)}`;
  const arc = (radius,x,y) => radius[0] && radius[1] ? `A${point(...radius)} 0 0 1 ${point(x,y)}` : `L${point(x,y)}`;
  return `M${point(x+tl[0],y)}H${number(r-tr[0])}${arc(tr,r,y+tr[1])}V${number(b-br[1])}${arc(br,r-br[0],b)}H${number(x+bl[0])}${arc(bl,x,b-bl[1])}V${number(y+tl[1])}${arc(tl,x+tl[0],y)}Z`;
}
export function unionMask(rects, width, height) {
  const clips = rects.map((r,i) => `<clipPath id="v${i}"><rect x="${number(r.left)}" y="${number(r.top)}" width="${number(r.width)}" height="${number(r.height)}"/></clipPath>`).join('');
  const holes = rects.map((r,i) => `<path d="${roundedPath(r.outline)}" fill="black" clip-path="url(#v${i})"/>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs>${clips}<mask id="cutouts" maskUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}"><rect width="100%" height="100%" fill="white"/>${holes}</mask></defs><rect width="100%" height="100%" fill="white" mask="url(#cutouts)"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
