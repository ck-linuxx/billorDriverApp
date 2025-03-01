export interface ILocation {
  latitude: number;
  longitude: number;
  address: string;
}

export interface IMap {
  pickupLocation: ILocation;
  dropOffLocation: ILocation;
  route: string;
}

export interface IAdditionalInformation {
  description: string;
  weight: string;
  type: string;
}

export interface ILoad {
  id: string;
  name: string;
  status: string;
  additionalInformation: IAdditionalInformation;
  map: IMap;
  relevantActions: string[];
}

export interface ILoadsData {
  loads: ILoad[];
}
