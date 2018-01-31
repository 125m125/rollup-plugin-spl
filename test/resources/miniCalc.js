//? if (OTHER)
import other from "./other";

export default function op(a, b) {
    //? if(PLUS) 
    return a + b;
    //? if (MINUS)
    return a - b;
    //? if (OTHER)
    return other(a, b);
}