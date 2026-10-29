// Align a caption to a target edge, compensating for the target's rounded corner.
// Clipping creates a straight edge, so clipped corners have no compensation.
export function annotationCandidates(target, width, height, compensation, gap = 12) {
  const {left, top, right, bottom, outline} = target;
  const corners = outline.radii.map(([x, y], index) => {
    const originalX = index === 0 || index === 3 ? outline.left : outline.right;
    const originalY = index < 2 ? outline.top : outline.bottom;
    const visibleX = index === 0 || index === 3 ? left : right;
    const visibleY = index < 2 ? top : bottom;
    return originalX === visibleX && originalY === visibleY ? [x * compensation, y * compensation] : [0, 0];
  });
  const [tl, tr, br, bl] = corners;
  return [
    {left:left + bl[0], top:bottom + gap},
    {left:right - br[0] - width, top:bottom + gap},
    {left:right + gap, top:top + tr[1]},
    {left:right + gap, top:bottom - br[1] - height},
    {left:left - width - gap, top:top + tl[1]},
    {left:left - width - gap, top:bottom - bl[1] - height},
    {left:left + tl[0], top:top - height - gap},
    {left:right - tr[0] - width, top:top - height - gap},
  ];
}
