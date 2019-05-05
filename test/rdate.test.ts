import { expect } from "chai";
import "mocha";
import RDate from "../src";

describe("construnctor", () => {
    it("should return correct Date from string", () => {
        expect(new RDate("2019-01-01").date).to.eql(new Date(2019, 0, 1));
    });
    it("should return correct Date from date", () => {
        expect(new RDate(new Date(2019, 0, 1)).date).to.eql(new Date(2019, 0, 1));
    });
    it("should return correct Date from array number", () => {
        expect(new RDate([1397, 10, 11]).date).to.eql(new Date(2019, 0, 1));
    });
});

describe("startOfMonth", () => {
    it("should return start of the month gerogian", () => {
        const d = new RDate("2019-01-15").startOfMonth();
        expect(d.date).to.eql(new Date(2019, 0, 1));
    });

    it("should return start of the month jalali", () => {
        const d = new RDate([1397, 1, 15]).startOfMonthJalali();
        expect(d.date).to.eql(new RDate([1397, 1, 1]).date);
    });
});

describe("endOfMonth", () => {
    it("should return end of the month georgian", () => {
        const d = new RDate("2019-01-15").endOfMonth();
        expect(d.date.toLocaleDateString()).to.be.equal(new Date(2019, 0, 31).toLocaleDateString());
    });

    it("should return end of the month jalali", () => {
        const d = new RDate([1397, 1, 15]).endOfMonthJalali();
        expect(d.date).to.eql(new RDate([1397, 1, 31]).date);
    });
});

describe("format", () => {
    it("should return formated gerogian date", () => {
        const d = new RDate("2019-01-15");
        expect(d.format("MM/DD/YYYY")).to.be.equal("01/15/2019");
    });

    it("should return formated jalali date", () => {
        const d = new RDate([1397, 1, 1]);
        expect(d.formatJalali("YYYY/MM/DD")).to.be.equal("1397/01/01");
    });
});

describe("days Of Week", ()=> {
    it("return day of week", () => {
        const d = new RDate("2019-05-01").dayOfWeek();
        expect(d).to.be.equal(3);
    });
    it("return day of jalali week", () => {
        const d = new RDate("2019-05-01").dayOfWeekJalali();
        expect(d).to.be.equal(5);
    });
});

describe (" leap year ", () => {
    it("is leap year ", () => {
        const d = new RDate().isLeapYear(2012);
        expect(d).to.be.equal(true)
    });
    it("is not leap year ", () => {
        const d = new RDate().isLeapYear(2019);
        expect(d).to.be.equal(false)
    })

    it("is leap year by date ", () => {
        const d = new RDate().isLeapYear(new Date("2012-02-25"));
        expect(d).to.be.equal(true)
    });
    it("is not leap year by date ", () => {
        const d = new RDate().isLeapYear(new Date("2019-02-25"));
        expect(d).to.be.equal(false)
    })

    it("is jalai leap year ", () => {
        const d = new RDate().isLeapYearJalali(1403);
        expect(d).to.be.equal(true)
    });
    it("is not jalali leap year ", () => {
        const d = new RDate().isLeapYearJalali(1398);
        expect(d).to.be.equal(false)
    })

    it("is jalai leap year by date ", () => {
        const d = new RDate().isLeapYearJalali(new Date("2025-02-25"));
        expect(d).to.be.equal(true)
    });
    it("is not jalali leap year by date ", () => {
        const d = new RDate().isLeapYearJalali(new Date("2019-02-25"));
        expect(d).to.be.equal(false)
    })
})
describe("parse date", () => {
    it("should parse jalaali date", () => {
        const d = new RDate().parseJalaali("1389-10-12");
        expect(d.formatJalali("YYYY/MM/DD")).to.be.equal("1389/10/12")
    })
    it("should parse geo date", () => {
        const d = new RDate().parse("2019-01-12");
        expect(d.format("YYYY/MM/DD")).to.be.equal("2019/01/12")
    })
})

describe("parse date with format", () => {
    it("should pars jalaali without time", () => {
        const d = new RDate().parse("10-05-02", "YY/DD/MM");
        expect(d.format("YYYY/MM/DD")).to.be.equal("2010/02/05")
    })
    it("should pars jalaali to geo with time", () => {
        const d = new RDate().parse("2019/05/02 12:50", "YYYY/MM/DD HH:mm");
        expect(d.format("YYYY/MM/DD HH:mm")).to.be.equal("2019/05/02 12:50")
    })

    it("should pars geo to jalaali with time", () => {
        const d = new RDate().parseJalaali("89-02-12 12:05", "YY-MM-DD HH:mm");
        expect(d.formatJalali("YYYY/MM/DD hh:mm")).to.be.equal("1389/02/12 12:05")
    })
    it("should pars geo to jalaali without time", () => {
        const d = new RDate().parseJalaali("98-02-12", "YY-MM-DD");
        expect(d.formatJalali("YYYY/MM/DD")).to.be.equal("1398/02/12")
    })
})
