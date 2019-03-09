export class Locales {
    public static parser: any = {
        a: (str: string) => {
            return Locales.parser.find(Locales.A, str);
        },
        find: (array: any[], str: string) => {
            let index = -1;
            let length = 0;

            for (let i = 0, len = array.length, item; i < len; i++) {
                item = array[i];
                if (!str.indexOf(item) && item.length > length) {
                    index = i;
                    length = item.length;
                }
            }
            return { index, length };
        },
        h: (h: number, a: number) => {
            return (h === 12 ? 0 : h) + a * 12;
        },
        mmm: (str: string) => {
            return Locales.parser.find(Locales.MMM, str);
        },
        mmmm: (str: string) => {
            return Locales.parser.find(Locales.MMMM, str);
        },
        pre: (str: string) => {
            return str;
        },
    };

    private static MMMM: string[] = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    private static MMM: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    private static dddd: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    private static ddd: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    private static dd: string[] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    private static A: string[] = ["a.m.", "p.m."];
}
