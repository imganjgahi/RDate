import * as datefns from "date-fns";
import * as jalaali from "jalaali-js";
import { Locales } from "./locale";

class RDate {
    public static parse(dateString: string, formatString: string): RDate | null {
        const locale = new Locales();
        const dString = Locales.parser.pre(dateString);
        let offset = 0;
        let keys;
        let i;
        let token;
        let length;
        let p;
        let str;
        let result;
        let dateObj;
        const re = /(MMMM?|A)|(YYYY)|(SSS)|(MM|DD|HH|hh|mm|ss)|(YY|M|D|H|h|m|s|SS)|(S)|(.)/g;
        const exp: any = { 2: /^\d{1,4}/, 3: /^\d{1,3}/, 4: /^\d\d/, 5: /^\d\d?/, 6: /^\d/ };
        const last = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const dt: any = { Y: 1970, M: 1, D: 1, H: 0, m: 0, s: 0, S: 0 };

        // tslint:disable-next-line: no-conditional-assignment
        while ((keys = re.exec(formatString))) {
            for (i = 0, length = 1, token = ""; !token; ) {
                token = keys[++i];
            }
            p = token.charAt(0);
            str = dString.slice(offset);
            if (i < 2) {
                result = Locales.parser[token].call(locale, str, formatString);
                dt[p] = result.index;
                if (p === "M") {
                    dt[p]++;
                }
                length = result.length;
            } else if (i < 7) {
                result = (str.match(exp[i]) || [""])[0];
                // tslint:disable-next-line: no-bitwise
                dt[p] = (p === "S" ? (result + "000").slice(0, -token.length) : result) | 0;
                length = result.length;
            } else if (p !== " " && p !== str[0]) {
                return null;
            }
            if (!length) {
                return null;
            }
            offset += length;
        }
        if (offset !== dString.length || !result) {
            return null;
        }
        dt.Y += dt.Y < 70 ? 2000 : dt.Y < 100 ? 1900 : 0;
        dt.H = dt.H || Locales.parser.h(dt.h || 0, dt.A || 0);

        dateObj = new Date(dt.Y, dt.M - 1, dt.D, dt.H, dt.m, dt.s, dt.S);
        // tslint:disable-next-line: no-bitwise
        last[1] += datefns.isLeapYear(dateObj) ? 1 : 0 | 0;
        if (dt.M < 1 || dt.M > 12 || dt.D < 1 || dt.D > last[dt.M - 1] || dt.H > 23 || dt.m > 59 || dt.s > 59) {
            return null;
        }
        return new RDate(dateObj);
    }

    public static parseJalaali(dateString: string, formatString: string): RDate | null {
        
        return null;
    }

    public date: Date;
    constructor(input: number[] | string | Date = new Date()) {
        if (Array.isArray(input)) {
            const gd = jalaali.toGregorian(input[0], input[1], input[2]);
            this.date = new Date(gd.gy, gd.gm - 1, gd.gd);
        } else if (typeof input === "string") {
            this.date = datefns.parse(input);
        } else {
            this.date = input;
        }
    }

    public addDays(days: number): RDate {
        return new RDate(datefns.addDays(this.date, days));
    }

    public subDays(days: number): RDate {
        return new RDate(datefns.subDays(this.date, days));
    }

    public addMonths(months: number): RDate {
        return new RDate(datefns.addMonths(this.date, months));
    }

    public subMonths(months: number): RDate {
        return new RDate(datefns.subMonths(this.date, months));
    }

    public addYears(years: number): RDate {
        return new RDate(datefns.addYears(this.date, years));
    }

    public subYears(years: number): RDate {
        return new RDate(datefns.subYears(this.date, years));
    }

    public startOfMonth(): RDate {
        return new RDate(datefns.startOfMonth(this.date));
    }

    public endOfMonth(): RDate {
        return new RDate(datefns.endOfMonth(this.date));
    }

    public startOfMonthJalali(): RDate {
        const [jy, jm, _] = this.getJalali();
        return new RDate([jy, jm, 1]);
    }

    public endOfMonthJalali(): RDate {
        const [jy, jm, _] = this.getJalali();
        const ml = jalaali.jalaaliMonthLength(jy, jm);
        return new RDate([jy, jm, ml]);
    }

    public isAfter(date: Date): boolean {
        return datefns.isAfter(this.date, date);
    }

    public isBefore(date: Date): boolean {
        return datefns.isBefore(this.date, date);
    }

    public format(frmt: string): string {
        return datefns.format(this.date, frmt);
    }

    public formatJalali(frmt: string): string {
        const [jy, jm, jd] = this.getJalali();
        frmt = frmt.replace("YYYY", `${jy}`);
        frmt = frmt.replace("YYY", `${jy}`);
        frmt = frmt.replace("YY", `${jy}`.slice(2));
        frmt = frmt.replace("MM", this.zeroLeading(`${jm}`));
        frmt = frmt.replace("M", `${jm}`);
        frmt = frmt.replace("DD", this.zeroLeading(`${jd}`));
        frmt = frmt.replace("D", `${jd}`);

        const hour = this.date.getHours();
        const minute = this.date.getMinutes();
        const second = this.date.getSeconds();

        frmt = frmt.replace("hh", this.zeroLeading(`${hour}`));
        frmt = frmt.replace("h", `${hour}`);

        frmt = frmt.replace("mm", this.zeroLeading(`${minute}`));
        frmt = frmt.replace("m", `${minute}`);

        frmt = frmt.replace("ss", this.zeroLeading(`${second}`));
        frmt = frmt.replace("s", `${second}`);
        return frmt;
    }

    private getJalali(): number[] {
        const jd = jalaali.toJalaali(this.date);
        return [jd.jy, jd.jm, jd.jd];
    }

    private zeroLeading(str: string) {
        if (str && str.length === 1) {
            return `0${str}`;
        }
        return str;
    }
}

export default RDate;
