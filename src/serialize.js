import * as tileGL from "tile-gl";
import { addTileCoords } from "./tile-coords.js";

export function initSerializer(userParams) {
  const serialize = tileGL.initSerializer(userParams);

  function wrapSerialize(source, tileCoords) {
    return serialize(source, tileCoords)
      .then(tile => addTileCoords(tile, tileCoords));
  }

  return wrapSerialize;
}
