import { injectable } from "inversify";

import { Weapon } from "../../interfaces/weapon";

@injectable()
export class Shuriken implements Weapon {
    public name: string;
    public constructor() {
        this.name = "Shuriken";
    }
}
