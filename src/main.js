import preamble from "./preamble.glsl";
import simpleScale from "./scale.glsl";
import mercatorScale from "./merc-scale.glsl";
import { initGL as initTileGL } from "tile-gl";
import { initTilesetPainter } from "./paint-tileset.js";

export function initGL(userParams) {
  const {
    context, framebuffer,
    projScale = false,
  } = userParams;

  const scaleCode = (projScale) ? mercatorScale : simpleScale;

  const tileContext = initTileGL({
    context, framebuffer,
    preamble: preamble + scaleCode,
    extraAttributes: { tileCoords: { numComponents: 3 } },
  });

  // Replace initPainter method with a multi-tile program
  const initPainter = tileContext.initPainter;
  tileContext.initPainter = function(style) {
    const layer = initPainter(style);
    const painter = (layer)
      ? initTilesetPainter(layer, context, framebuffer.size)
      : () => null;
    const { id, type, source, minzoom = 0, maxzoom = 24 } = style;
    return Object.assign(painter, { id, type, source, minzoom, maxzoom });
  };

  return tileContext;
}
