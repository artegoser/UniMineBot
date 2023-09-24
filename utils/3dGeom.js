function generate3DCubeBy2Points(pointA, pointB) {
  const { minX, minY, minZ, maxX, maxY, maxZ } = getMaxAndMin(pointA, pointB);

  const points = [];
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      for (let z = minZ; z <= maxZ; z++) {
        points.push({ x, y, z });
      }
    }
  }
  return points;
}

function Volume(pointA, pointB) {
  const { min, max } = getMaxAndMin(pointA, pointB);

  return (max.x - min.x) * (max.y - min.y) * (max.z - min.z);
}

function getMaxAndMin(pointA, pointB) {
  const minX = Math.min(pointA.x, pointB.x);
  const minY = Math.min(pointA.y, pointB.y);
  const minZ = Math.min(pointA.z, pointB.z);

  const maxX = Math.max(pointA.x, pointB.x);
  const maxY = Math.max(pointA.y, pointB.y);
  const maxZ = Math.max(pointA.z, pointB.z);

  return {
    min: { x: minX, y: minY, z: minZ },
    max: { x: maxX, y: maxY, z: maxZ },
  };
}

module.exports = { generate3DCubeBy2Points, Volume, getMaxAndMin };
