import { antiMeridianSplit } from "./unwrap-tileset.js";

export function initTilesetPainter(layer, context, fbSize) {
  const { mapCoords, mapShift } = layer.uniformSetters;

  return (layer.type === "background") ? paintBackground : paintTileset;

  function paintBackground({ zoom, pixRatio = 1.0, cameraScale = 1.0 }) {
    layer.setStyles(zoom, pixRatio, cameraScale);
    layer.paint();
  }

  function paintTileset({ tileset, zoom, pixRatio = 1.0, cameraScale = 1.0 }) {
    if (!tileset || !tileset.length) return;
    layer.setStyles(zoom, pixRatio, cameraScale);

    // Set mapCoords
    const { x, y, z } = tileset[0];
    const numTiles = 1 << z;
    const xw = x - Math.floor(x / numTiles) * numTiles;
    const extent = 512; // TODO: don't assume this!!
    mapCoords([xw, y, z, extent]);

    // Draw tiles. Split into subsets if they are repeated across antimeridian
    antiMeridianSplit(tileset).forEach(subset => drawSubset(subset, pixRatio));
  };

  function drawSubset(tileset, pixRatio = 1) {
    const { 0: { x, y }, translate, scale: rawScale } = tileset;
    const scale = rawScale * pixRatio;

    const [dx, dy] = [x, y].map((c, i) => (c + translate[i]) * scale);
    mapShift([dx, dy, scale]);

    tileset.forEach(tile => drawTileBox(tile, translate, scale));
  }

  function drawTileBox(box, translate, scale) {
    const { x, y, tile } = box;
    const data = layer.getData(tile);
    if (!data) return;

    const [x0, y0] = [x, y].map((c, i) => (c + translate[i]) * scale);
    clipRect(x0, y0, scale, scale);

    context.draw(data.buffers);
  }

  function clipRect(x, y, w, h) {
    const yflip = fbSize.height - y - h;
    context.clipRect(x, yflip, w, h);
  }
}
