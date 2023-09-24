function generate3DCubeBy2Points(pointA, pointB) {
  const minX = Math.min(pointA[0], pointB[0]);
  const minY = Math.min(pointA[1], pointB[1]);
  const minZ = Math.min(pointA[2], pointB[2]);

  const maxX = Math.max(pointA[0], pointB[0]);
  const maxY = Math.max(pointA[1], pointB[1]);
  const maxZ = Math.max(pointA[2], pointB[2]);

  const points = [];
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      for (let z = minZ; z <= maxZ; z++) {
        const point = { x, y, z };
        points.push(point);
      }
    }
  }
  return points;
}

module.exports = { generate3DCubeBy2Points };
