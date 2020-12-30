import { GenericType } from "./generic";
import { Type } from "./type";

export class Types {
    public static Unknown = Type.CreateType("Unknown");

    public static Number = Type.CreateType("Number", Types.Unknown);
    public static Integer = Type.CreateType("Integer", Types.Number);
    public static Float = Type.CreateType("Float", Types.Number);
    public static String = Type.CreateType("String", Types.Unknown);
    public static Decimal = Type.CreateType("Decimal", Types.Number);

    public static Object = Type.CreateType("Object", Types.Unknown);

    public static Date = Type.CreateType("Date", Types.Object);
    public static DateTime = Type.CreateType("DateTime", Types.Object);
    public static Time = Type.CreateType("Time", Types.Object);

    public static Array = GenericType.CreateGenericFactory("Array", Types.Object, 1);
    public static Map = GenericType.CreateGenericFactory("Map", Types.Object, 2);
}