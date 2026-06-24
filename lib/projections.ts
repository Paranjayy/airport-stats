import { geoMercator } from "d3-geo";

export const indiaProjection = geoMercator()
  .center([82, 22])
  .scale(1050)
  .translate([480, 300]);
