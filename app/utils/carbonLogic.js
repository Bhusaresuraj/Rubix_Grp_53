// constants based on 2026 Indian Ministry of Coal standards
export const EMISSION_FACTORS = {
  diesel: 2.68,      // kg CO2 per liter
  electricity: 0.82, // kg CO2 per kWh
  explosives: 0.18   // kg CO2 per kg (ANFO)
};

export const SINK_FACTORS = {
  neem: 25.0 / 1000,   // converting kg to tons per year
  bamboo: 18.2 / 1000, 
  teak: 20.5 / 1000
};

export const calculateTotalEmissions = (d, e, x) => {
  const kg = (d * EMISSION_FACTORS.diesel) + 
             (e * EMISSION_FACTORS.electricity) + 
             (x * EMISSION_FACTORS.explosives);
  return (kg / 1000); // returns total in Metric Tons
};