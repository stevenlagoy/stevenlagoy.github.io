import { Type } from './Type.js';

export class Move {
    accuracy: Number;
    name:String;
    power: Number;
    pp: Number;
    type: Type;
    constructor(accuracy: Number, name: String, power: Number, pp: Number, type: Type) {
        this.accuracy = accuracy;
        this.name = name;
        this.power = power;
        this.pp = pp;
        this.type = type;
    }
}