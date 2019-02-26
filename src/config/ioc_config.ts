import "reflect-metadata";

import { Container, ContainerModule, interfaces } from "inversify";
import { Katana } from "../entities/weapons/katana";
import { Shuriken } from "../entities/weapons/shuriken";
import { Ninja } from "../entities/warriors/ninja";
import SERVICE_IDENTIFIER from "../constants/identifiers";

export let container = new Container();

export const warriorModule = new ContainerModule(bind => {
    console.log("");
});

export const weaponModule = new ContainerModule(bind => {
    bindContributionProvider(bind, SERVICE_IDENTIFIER.WEAPON);
    bind(SERVICE_IDENTIFIER.WARRIOR).to(Ninja);
    bind(SERVICE_IDENTIFIER.WEAPON).to(Katana);
    bind(SERVICE_IDENTIFIER.WEAPON).to(Shuriken);
});

export interface ContributionProvider<T extends object> {

    getContributions(recursive?: boolean): T[];
}

class ContainerBasedContributionProvider<T extends object> implements ContributionProvider<T> {

    protected services: T[] | undefined;

    constructor(
        protected readonly serviceIdentifier: interfaces.ServiceIdentifier<T>,
        protected readonly icontainer: interfaces.Container
    ) { }

    public getContributions(recursive?: boolean): T[] {
        if (this.services === undefined) {
            const currentServices: T[] = [];
            let currentContainer: interfaces.Container | null = this.icontainer;
            while (currentContainer !== null) {
                if (currentContainer.isBound(this.serviceIdentifier)) {
                    try {
                        currentServices.push(...currentContainer.getAll(this.serviceIdentifier));
                    } catch (error) {
                        console.error(error);
                    }
                }
                // tslint:disable-next-line:no-null-keyword
                currentContainer = recursive === true ? currentContainer.parent : null;
            }
            this.services = currentServices;
        }
        return this.services;
    }
}

export type Bindable = interfaces.Bind | interfaces.Container;
export namespace Bindable {
    export function isContainer(arg: Bindable): arg is interfaces.Container {
        return typeof arg !== "function"
            // https://github.com/theia-ide/theia/issues/3204#issue-371029654
            // In InversifyJS `4.14.0` containers no longer have a property `guid`.
            && ("guid" in arg || "parent" in arg);
    }
}

export function bindContributionProvider(bindable: Bindable, id: symbol): void {
    const bindingToSyntax =
        (Bindable.isContainer(bindable) ?
            bindable.bind(SERVICE_IDENTIFIER.CONTRIBUTION_PROVIDER) : bindable(SERVICE_IDENTIFIER.CONTRIBUTION_PROVIDER));
    bindingToSyntax
        .toDynamicValue(ctx => new ContainerBasedContributionProvider(id, ctx.container))
        .inSingletonScope().whenTargetNamed(id);
}
