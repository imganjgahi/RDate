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

    public dayOfWeek(): number {
        return datefns.getDay(this.date);
    }

    public dayOfWeekJalali(): number {
        let day = datefns.getDay(this.date);
        if (day > 0 && day < 5) {
            day += 2;
        } else if (day == 0) {
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

    private setYearStr(fullYear: number, year: string) {
        return fullYear.toString().substr(0, 2) + year;
    }

    private parseFormat(date: any, format: string, type: string): number[] {
        const yearArray = ["YYYY", "YYY", "YY"];
        const monthArray = ["MM", "M"];
        const dayArray = ["DD", "D"];
        const hourArray = ["HH", "hh", "h"];
        const minuteArray = ["mm", "m"];
        const secondArray = ["ss", "s"];

        let y: string = "";
        let m: string = "";
        let d: string = "";
        let h: string = "";
        let min: string = "";
        let sec: string = "";

        yearArray.forEach((year) => {
            const yIndex = format.indexOf(year);
            y === "" ? (y = yIndex > -1 ? date.substring(yIndex, yIndex + year.length) : "") : y;
        });
        monthArray.forEach((month) => {
            const mIndex = format.indexOf(month);
            m === "" ? (m = mIndex > -1 ? date.substring(mIndex, mIndex + month.length) : "") : m;
        });
        dayArray.forEach((day) => {
            const dIndex = format.indexOf(day);
            d === "" ? (d = dIndex > -1 ? date.substring(dIndex, dIndex+ day.length) : "") : d;
        });
        hourArray.forEach((hour) => {
            const hIndex = format.indexOf(hour);
            h === "" ? (h = hIndex > -1 ? date.substring(hIndex, hIndex+ hour.length) : "") : h;
        });
        minuteArray.forEach((minute) => {
            const minuteIndex = format.indexOf(minute);
            min === "" ? (min = minuteIndex > -1 ? date.substring(minuteIndex, minuteIndex+ minute.length) : "") : min;
        });
        secondArray.forEach((second) => {
            const secIndex = format.indexOf(second);
            sec === "" ? (sec = secIndex > -1 ? date.substring(secIndex, secIndex+ second.length) : "") : sec;
        });

        if (y === "" || m === "" || d === "") {
            throw "invalid date";
        }
        if (y.length < 4) {
            if (type === "jal") {
                const d = new Date(Date.now());
                const j = jalaali.toJalaali(+d.getFullYear(), +d.getMonth(), +d.getDay());
                y = this.setYearStr(j.jy, y);
            }
            if (type === "geo") {
                const d = new Date(Date.now());
                y = this.setYearStr(d.getFullYear(), y);
            }
        }
        return [+y, +m, +d, +h, +min, +sec];
    }

    public parse(date: string, format: string = "YYYY-MM-DD hh:mm:ss"): RDate {
        const [y, m, d, h, min, sec] = this.parseFormat(date, format, "geo");
        return new RDate(new Date(y, (m-1), d, h, min, sec));
    }

    public parseJalaali(date: string, format: string = "YYYY-MM-DD hh:mm:ss"): RDate {
        const [y, m, d, h, min, sec] = this.parseFormat(date, format, "jal");
        const x = jalaali.toGregorian(y, m, d);
        const outPut = new RDate(new Date(x.gy, (x.gm-1), x.gd, h, min, sec));
        return outPut;
    }
    public format(frmt: string): string {
        return datefns.format(this.date, frmt);
    }

    public isLeapYear(date: Date | number): boolean {
        if (typeof date === "number") {
            return datefns.isLeapYear(new Date(date, 2, 2));

        }
        return datefns.isLeapYear(date);
    }

    public isLeapYearJalali(date: Date | number): boolean {
        if(typeof date === "number"){
            return jalaali.isLeapJalaaliYear(date)
        }
       const jd= jalaali.toJalaali(date)
        return jalaali.isLeapJalaaliYear(jd.jy)
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
