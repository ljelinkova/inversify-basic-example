import { Weapon } from "./weapon";

export interface Warrior {
    name: string;

    getWeapons(): Weapon[];
}
