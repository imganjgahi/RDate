import * as datefns from "date-fns";
import * as jalaali from "jalaali-js";

class RDate {
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

    public dayOfWeek() : number {
        return datefns.getDay(this.date);
    }

    public dayOfWeekJalali() : number {
        let day= datefns.getDay(this.date);
        if( day > 0 && day < 5 )
        {
            day += 2;
        } else if(day == 0) {
            day = 1;
        } else {
            day = 0;
        }
        return day;
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
