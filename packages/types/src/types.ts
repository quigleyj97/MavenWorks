import { GenericType } from "./generic";
import { Type } from "./type";

/**
 * Default built-in type definitions.
 *
 * @export
 * @class Types
 */
export class Types {
    /** The top type, aka "Any".
     *
     * This may represent any value, and any value may be assigned to it.
     *
     * @static
     * @memberof Types
     */
    public static Unknown = Type.CreateType("Unknown");

    /** A generic number type.
     *
     * @static
     * @memberof Types
     */
    public static Number = Type.CreateType("Number", Types.Unknown);
    /** A type for an integer.
     *
     * In JS, values of this type should be BigInts.
     *
     * @static
     * @memberof Types
     */
    public static Integer = Type.CreateType("Integer", Types.Number);
    /** A double-precision floating-point type.
     *
     * @static
     * @memberof Types
     */
    public static Float = Type.CreateType("Float", Types.Number);
    /**
     * A decimal type.
     *
     * This is useful for avoiding floating-point errors in decimal math, eg
     * financial pricing data. In JS, values of this type are Decimal.js
     * instances. cf. https://github.com/MikeMcl/decimal.js/
     *
     * @static
     * @memberof Types
     */
    public static Decimal = Type.CreateType("Decimal", Types.Number);
    /**
     * A string type.
     *
     * @static
     * @memberof Types
     */
    public static String = Type.CreateType("String", Types.Unknown);

    /**
     * An Object type, representing values that are not considered 'primitives'.
     *
     * @static
     * @memberof Types
     */
    public static Object = Type.CreateType("Object", Types.Unknown);

    /**
     * A Date type, representing a calendar date with no associated time.
     *
     * @static
     * @memberof Types
     */
    public static Date = Type.CreateType("Date", Types.Object);

    /**
     * A DateTime type, representing a combined calendar date and time-of-day.
     *
     * @static
     * @memberof Types
     */
    public static DateTime = Type.CreateType("DateTime", Types.Object);

    /**
     * A Time type, representing a time-of-day (but not a calendar date).
     *
     * @static
     * @memberof Types
     */
    public static Time = Type.CreateType("Time", Types.Object);

    /**
     * A generic factory to create Array types.
     *
     * @static
     * @memberof Types
     */
    public static Array = GenericType.CreateGenericFactory("Array", Types.Object, 1);

    /**
     * A generic factory to create Map types.
     *
     * @static
     * @memberof Types
     */
    public static Map = GenericType.CreateGenericFactory("Map", Types.Object, 2);
}