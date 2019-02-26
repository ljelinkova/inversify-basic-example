import { inject, injectable, named } from "inversify";

import SERVICE_IDENTIFIER from "../../constants/identifiers";
import { Warrior } from "../../interfaces/warrior";
import { Weapon } from "../../interfaces/weapon";
import { ContributionProvider } from "../../config/ioc_config";

@injectable()
export class Ninja implements Warrior {

    public name: string;

    private weaponsProvider: ContributionProvider<Weapon>;

    public constructor(
        @inject(SERVICE_IDENTIFIER.CONTRIBUTION_PROVIDER) @named(SERVICE_IDENTIFIER.WEAPON) weaponsProvider: ContributionProvider<Weapon>
    ) {
        this.name = "Ninja";
        this.weaponsProvider = weaponsProvider;
    }

    public getWeapons(): Weapon[] {
        return this.weaponsProvider.getContributions();
    }
}
