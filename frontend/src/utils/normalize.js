export function normalizeCar(car) {
  return {
    ...car,
    images: car.images?.map((img) => img.image_url || img) || [],
    features: typeof car.features === 'string'
      ? car.features.split(',').map((f) => f.trim()).filter(Boolean)
      : car.features || [],
    bodyType: car.body_type || car.bodyType || '',
    engineSize: car.engine_size || car.engineSize || 0,
    horsepower: car.horsepower || 0,
    createdAt: car.created_at || car.createdAt || new Date().toISOString(),
    seller: car.seller || { id: 0, name: 'Nepoznat', phone: '' },
  }
}

export function normalizeCars(cars) {
  return cars.map(normalizeCar)
}
