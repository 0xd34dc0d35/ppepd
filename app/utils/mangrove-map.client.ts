let runtime: Promise<any> | undefined

export function loadMangroveMapRuntime() {
  if (!runtime) {
    runtime = Promise.all([import('maplibre-gl'), import('pmtiles')]).then(([maplibre, pmtiles]) => {
      const protocol = new pmtiles.Protocol()
      maplibre.default.addProtocol('pmtiles', protocol.tile)
      return { maplibre: maplibre.default, PMTiles: pmtiles.PMTiles, protocol }
    }).catch((error) => { runtime = undefined; throw error })
  }
  return runtime
}
