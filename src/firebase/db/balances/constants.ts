export const BALANCE_SUCCESS = {
  getYearBalances: (year: string) => `Balances del año ${year} obtenidos con exito.`,
  getYearsBalances: `Balances de todos los años obtenidos con exito.`
}

export const BALANCE_ERRORS = {
  getYearBalances: (year: string) => `Error al obtener las balances del año ${year}.`,
  getYearsBalances: `Error al obtener las balances de todos los años.`
}
