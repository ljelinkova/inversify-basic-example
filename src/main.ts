import SERVICE_IDENTIFIER from "./constants/identifiers";
import {
    container,
    warriorModule,
    weaponModule
} from "./config/ioc_config";
import { Warrior } from "./interfaces/warrior";

container.load(warriorModule);
container.load(weaponModule);

// Composition root
let warrior = container.get<Warrior>(SERVICE_IDENTIFIER.WARRIOR);
let weapons = warrior.getWeapons();

console.log("Available weapons for " + warrior.name);
for (let weapon of weapons) {
    console.log(weapon.name);
}
