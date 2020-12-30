import { Type } from "./type";

export class GenericType extends Type {
    public static CreateGenericFactory(name: string, supertype?: Readonly<Type>, nArgs?: number) {
        return (...generics: Readonly<Type>[]) => {
            if (nArgs != null && generics.length != nArgs) {
                throw Error(`Incorrect number of generic arguments provided: Expected ${nArgs}, got ${generics.length}`);
            }
            return new GenericType(name, generics, supertype);
        }
    }

    private readonly generics: Readonly<Type>[];

    protected constructor(
        name: string,
        generics: Readonly<Type>[],
        supertype?: Readonly<Type>
    ) {
        super(name, supertype);
        this.generics = generics;
    }

    public getGenericArgs(): ReadonlyArray<Readonly<Type>> {
        return this.generics;
    }

    public getHumanReadableName(): string {
        return `${super.getTypeName()}<${this.generics.map(i => i.getTypeName()).join(", ")}>`;
    }

    public baseTypeEquals(rhs: Readonly<Type>): boolean {
        return rhs instanceof GenericType
            && super.baseTypeEquals(rhs);
    }

    public equals(rhs: Readonly<Type>): boolean {
        return rhs instanceof GenericType
            && super.baseTypeEquals(rhs)
            && rhs.getGenericArgs().length === this.generics.length
            && rhs.getGenericArgs().every((arg, i) => this.generics[i].equals(arg));
    }

    public isAssignableTo(rhs: Readonly<Type>): boolean {
        return super.isAssignableTo(rhs)
            && (rhs instanceof GenericType ? (
                rhs.getGenericArgs()
                    .every((type, i) => this.generics[i].isAssignableTo(type))
            ) : true);
    }
}