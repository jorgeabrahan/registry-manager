export const formatHNL = (value = 0) => {
  return value.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' });
}
