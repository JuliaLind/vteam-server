export const usersExt = [
    {
        user: {
            id: 4,
            email: "jdoniso4@alibaba.com",
            balance: 261.93,
            active: true,
        },
        card: {
            card_nr: "5362 1630 1011 0910",
            card_type: 2,
            card_type_descr: "Mastercard",
        },
        payments: [
            {
                id: 2,
                user_id: 4,
                date: new Date("2023-10-07 12:30"),
                ref: "***0910",
                amount: 200,
            },
            {
                id: 4,
                user_id: 4,
                date: new Date("2023-10-08 10:10"),
                ref: "***0910",
                amount: 250,
            },
            {
                id: 12,
                user_id: 4,
                date: new Date("2023-10-11 12:00"),
                ref: "***0910",
                amount: 1900,
            },
        ]
    },
    {
        user: {
            id: 5,
            email: "bcroft7@qq.com",
            balance: -372.87,
            active: false,
        },
        card: {
            card_nr: "4508 1325 6002 5300",
            card_type: 1,
            card_type_descr: "Visa"
        },
        payments: [
            {
                id: 1,
                user_id: 5,
                date: new Date("2023-10-07 12:00"),
                ref: "***5300",
                amount: 871.34,
            },
            {
                id: 3,
                user_id: 5,
                date: new Date("2023-10-08 10:00"),
                ref: "***5300",
                amount: 200,
            },

        ]
    },
    {
        user: {
            id: 6,
            email: "afolonind@statcounter.com",
            balance: -128.53,
            active: true,
        },
        card: {
            card_nr: "4844 9104 5482 3920",
            card_type: 3,
            card_type_descr: "American Express"
        },
        payments: [
            {
                id: 7,
                user_id: 6,
                date: new Date("2023-10-08 18:10"),
                ref: "***3920",
                amount: 41,
            },
            {
                id: 8,
                user_id: 6,
                date: new Date("2023-10-08 18:55"),
                ref: "***3920",
                amount: 80,
            },
            {
                id: 9,
                user_id: 6,
                date: new Date("2023-10-09 18:55"),
                ref: "***3920",
                amount: 90,
            },
            {
                id: 10,
                user_id: 6,
                date: new Date("2023-10-09 19:05"),
                ref: "***3920",
                amount: 151,
            },
            {
                id: 13,
                user_id: 6,
                date: new Date("2023-10-14 11:41"),
                ref: "***3920",
                amount: 1900,
            }
        ]
    },
    {
        user: {
            id: 7,
            email: "another_one@user.com",
            balance: -1200.31,
            active: false,
        },
        card: {
            card_nr: "4844 9104 3434 3920",
            card_type: 3,
            card_type_descr: "American Express"
        },
        payments: [
            {
                id: 5,
                user_id: 7,
                date: new Date("2023-10-08 10:15"),
                ref: "***3920",
                amount: 189.31,
            },
            {
                id: 6,
                user_id: 7,
                date: new Date("2023-10-08 16:10"),
                ref: "***3920",
                amount: 35,
            },
            {
                id: 11,
                user_id: 7,
                date: new Date("2023-10-11 11:05"),
                ref: "***3920",
                amount: 51,
            },
        ]
    }
];