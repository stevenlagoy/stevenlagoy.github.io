import { Encounter } from './Encounter.js';

export class Route {
    routeName: string;
    routeNumber: number;
    encounters: Encounter[];
    constructor(routeName: string, routeNumber: number, encounters: Encounter[]) {
        this.routeName   = routeName;
        this.routeNumber = routeNumber;
        this.encounters  = encounters;
    }
}