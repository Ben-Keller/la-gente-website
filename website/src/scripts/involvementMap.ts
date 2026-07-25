import * as d3 from 'd3';
import { feature } from 'topojson-client';
import world from 'world-atlas/countries-110m.json';

interface MapOrganization {
  index: number;
  name: string;
  place: string;
  coordinates: [number, number];
  image: string;
}

const SOUTH_AMERICA_IDS = new Set([32, 68, 76, 152, 170, 218, 254, 328, 600, 604, 740, 858, 862]);
const MARKER_OFFSETS: Record<number, [number, number]> = {
  1: [-18, 10],
  2: [22, -9],
  5: [16, -10],
  7: [16, -13],
  9: [18, 18],
};

export function initializeInvolvementMap(): void {
  const atlas = document.querySelector<HTMLElement>('.involvement-atlas');
  const mapSurface = atlas?.querySelector<HTMLElement>('.involvement-map');
  const svgElement = document.querySelector<SVGSVGElement>('#peru-involvement-map');
  const tooltipElement = document.querySelector<HTMLElement>('.map-tooltip');
  if (!atlas || !mapSurface || !svgElement || !tooltipElement) return;

  const mapData: MapOrganization[] = JSON.parse(atlas.dataset.organizations ?? '[]');
  const terrainUrl = atlas.dataset.terrain;
  const svg = d3.select(svgElement);
  const tooltip = d3.select(tooltipElement);
  const countries = feature(world as any, (world as any).objects.countries) as any;
  const regionalCountries = {
    type: 'FeatureCollection',
    features: countries.features.filter((country: any) => SOUTH_AMERICA_IDS.has(Number(country.id))),
  };
  const peru = regionalCountries.features.find((country: any) => Number(country.id) === 604);
  if (!peru) return;

  const projection = d3.geoMercator().fitExtent([[150, 72], [610, 688]], peru);
  const path = d3.geoPath(projection);
  const peruCenter = path.centroid(peru);
  const defs = svg.append('defs');
  const mask = defs.append('radialGradient').attr('id', 'atlas-feather');
  mask.append('stop').attr('offset', '48%').attr('stop-color', '#fff').attr('stop-opacity', 1);
  mask.append('stop').attr('offset', '82%').attr('stop-color', '#fff').attr('stop-opacity', .48);
  mask.append('stop').attr('offset', '100%').attr('stop-color', '#fff').attr('stop-opacity', 0);
  defs.append('mask')
    .attr('id', 'regional-fade')
    .append('rect')
    .attr('width', 760)
    .attr('height', 760)
    .attr('fill', 'url(#atlas-feather)');

  svg.append('g')
    .attr('mask', 'url(#regional-fade)')
    .selectAll('path')
    .data(regionalCountries.features)
    .join('path')
    .attr('class', (country: any) => Number(country.id) === 604 ? 'map-country map-country--peru' : 'map-country map-country--neighbor')
    .attr('d', path as any);

  const terrainClip = defs.append('clipPath').attr('id', 'peru-terrain-clip');
  terrainClip.append('path').datum(peru).attr('d', path as any);
  const terrainNorthWest = projection([-82, 2]);
  const terrainSouthEast = projection([-68, -20]);
  if (terrainUrl && terrainNorthWest && terrainSouthEast) {
    svg.append('image')
      .attr('class', 'map-terrain')
      .attr('href', terrainUrl)
      .attr('x', terrainNorthWest[0])
      .attr('y', terrainNorthWest[1])
      .attr('width', terrainSouthEast[0] - terrainNorthWest[0])
      .attr('height', terrainSouthEast[1] - terrainNorthWest[1])
      .attr('preserveAspectRatio', 'none')
      .attr('clip-path', 'url(#peru-terrain-clip)');
  }
  svg.append('path').datum(peru).attr('class', 'map-peru-outline').attr('d', path as any);

  const projected = mapData.map((organization) => {
    const point = projection(organization.coordinates);
    const offset = MARKER_OFFSETS[organization.index] ?? [0, 0];
    return { ...organization, x: (point?.[0] ?? 0) + offset[0], y: (point?.[1] ?? 0) + offset[1] };
  });

  const marker = svg.append('g')
    .attr('class', 'map-points')
    .selectAll<SVGGElement, MapOrganization & { x: number; y: number }>('g')
    .data(projected)
    .join('g')
    .attr('class', 'map-marker')
    .attr('role', 'button')
    .attr('tabindex', 0)
    .attr('aria-label', (item) => `${item.name}, ${item.place}`)
    .attr('transform', (item) => `translate(${item.x},${item.y})`);

  marker.each(function(item) {
    const group = d3.select(this);
    const visual = group.append('g').attr('class', 'map-marker__visual');
    const clipId = `map-thumbnail-${item.index}`;
    defs.append('clipPath').attr('id', clipId).append('circle').attr('r', 16);
    visual.append('circle').attr('class', 'map-marker__shadow').attr('r', 19);
    visual.append('image')
      .attr('class', 'map-marker__image')
      .attr('href', item.image)
      .attr('x', -16).attr('y', -16).attr('width', 32).attr('height', 32)
      .attr('preserveAspectRatio', 'xMidYMid slice')
      .attr('clip-path', `url(#${clipId})`);
    visual.append('circle').attr('class', 'map-marker__border').attr('r', 16);
  });

  const showTooltip = (event: MouseEvent, item: MapOrganization) => {
    tooltip.classed('is-visible', true)
      .html(`<strong>${item.name}</strong><span>${item.place}</span>`)
      .style('left', `${Math.min(72, Math.max(8, event.offsetX / 7.6))}%`)
      .style('top', `${Math.min(78, Math.max(8, event.offsetY / 7.6))}%`);
  };
  const selectOrganization = (item: MapOrganization) => {
    window.dispatchEvent(new CustomEvent('la-gente:organization-select', { detail: { index: item.index } }));
    marker.classed('is-active', (candidate) => candidate.index === item.index);
  };

  marker
    .on('mouseenter', function(event: MouseEvent, item) {
      d3.select(this).raise();
      showTooltip(event, item);
    })
    .on('mousemove', showTooltip)
    .on('mouseleave', () => tooltip.classed('is-visible', false))
    .on('click', (_event, item) => selectOrganization(item))
    .on('keydown', (event: KeyboardEvent, item) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectOrganization(item);
      }
    });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let animationFrame = 0;
  let lightX = 50;
  let lightY = 45;
  let lightOpacity = 0;
  const renderLight = () => {
    mapSurface.style.setProperty('--map-light-x', `${lightX.toFixed(1)}%`);
    mapSurface.style.setProperty('--map-light-y', `${lightY.toFixed(1)}%`);
    mapSurface.style.setProperty('--map-light-opacity', lightOpacity.toFixed(3));
    animationFrame = 0;
  };
  const requestLightRender = () => {
    if (!animationFrame) animationFrame = requestAnimationFrame(renderLight);
  };

  atlas.addEventListener('pointermove', (event) => {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    const rect = mapSurface.getBoundingClientRect();
    const normalizedX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const normalizedY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    const pointerX = (event.clientX - rect.left) / rect.width;
    const pointerY = (event.clientY - rect.top) / rect.height;
    const peruX = peruCenter[0] / 760;
    const peruY = peruCenter[1] / 760;
    const distanceFromPeru = Math.hypot((pointerX - peruX) / .5, (pointerY - peruY) / .5);
    const fullIntensityRadius = .4;
    const outerFalloffRadius = 1.5;
    lightOpacity = distanceFromPeru <= fullIntensityRadius
      ? 1
      : Math.max(0, 1 - (distanceFromPeru - fullIntensityRadius) / (outerFalloffRadius - fullIntensityRadius));
    if (lightOpacity === 0) {
      requestLightRender();
      return;
    }
    lightX = 50 + Math.max(-1, Math.min(1, normalizedX)) * 7.5;
    lightY = 45 + Math.max(-1, Math.min(1, normalizedY)) * 6;
    requestLightRender();
  }, { passive: true });
  atlas.addEventListener('pointerleave', () => {
    lightOpacity = 0;
    requestLightRender();
  });
}
