export class Type {
    public static CreateType(name: string, extendsType?: Readonly<Type>) {
        return new Type(name, extendsType);
    }

    /** Maximum number of parents to check to determine assignability */
    public static readonly SUBTYPE_CHECK_DEPTH_LIMIT = 10;

    private readonly name: string;
    private readonly extends?: Readonly<Type>;
    
    protected constructor(name: string, extendsType?: Readonly<Type>) {
        this.name = name;
        this.extends = extendsType;
    }

    public getSuperType(): Readonly<Type> | undefined {
        return this.extends;
    }

    /** Return a human-readable string representing this type */
    public getHumanReadableName(): string {
        return this.name;
    }

    /** Return the base type name */
    public getTypeName(): string {
        return this.name;
    }

    public get [Symbol.toStringTag](): string {
        return "Type<" + this.getHumanReadableName() + ">"
    }

    /** Determine if two types have the same base type */
    public baseTypeEquals(rhs: Readonly<Type>) {
        return this.getTypeName() == rhs.getTypeName();
    }

    public equals(rhs: Readonly<Type>) {
        return this.baseTypeEquals(rhs);
    }

    /** Determine if this type is assignable to another type
     * 
     * Types should use structural typing if they represent structures, and
     * nominal typing if they represent atomic data elements. The default
     * implementation 
     */
    public isAssignableTo(rhs: Readonly<Type>) {
        let supertype: Readonly<Type> | undefined = this;
        let typeDepth = 0;

        while (supertype != null && typeDepth < Type.SUBTYPE_CHECK_DEPTH_LIMIT) {
            if (supertype.baseTypeEquals(rhs)) {
                return true;
            }
            supertype = supertype.getSuperType();
        }
        return false;
    }
}