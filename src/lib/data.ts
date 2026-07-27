import { generatedData } from "../generated";
import { orderPartiesByAxis } from "./axis";

export const data = generatedData;
export const partiesByAxis = orderPartiesByAxis(data.parties, data.axisPositions);

export function getParty(partyId: string) {
  return data.parties.find((party) => party.party_id === partyId);
}

export function getPartyScope(partyId: string) {
  return data.partyFinancialScopes.find((scope) => scope.party_id === partyId);
}

export function getPartyRecords(partyId: string) {
  return data.financingRecords.filter((record) => record.party_id === partyId);
}

export function getSource(sourceId: string) {
  return data.sources.find((source) => source.source_id === sourceId);
}
