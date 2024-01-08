/* global it describe */

import chai from 'chai';
chai.should();
const expect = chai.expect;

import cityModel from "../src/models/city.js";
import bikeModel from "../src/models/bike.js";
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);


describe('city model part 3', () => {
    it('Should return all parking and charging zones with the bikes in them and bike count', async () => {
        const zones = [
            {
                "id": 8,
                "zone_id": 1,
                "descr": "parking",
                "city_id": "STHLM",
                "geometry": {
                    "coordinates": [
                        [
                            [
                                18.023872361393217,
                                59.34086750494353
                            ],
                            [
                                18.022381355857846,
                                59.340724561870616
                            ],
                            [
                                18.022405521264375,
                                59.34059887005105
                            ],
                            [
                                18.0239255252863,
                                59.340696219638204
                            ],
                            [
                                18.023872361393217,
                                59.34086750494353
                            ]
                        ]
                    ],
                    "type": "Polygon"
                }
            },
            {
                "id": 13,
                "zone_id": 1,
                "descr": "parking",
                "city_id": "STHLM",
                "geometry": {
                    "coordinates": [
                        [
                            [
                                18.025058911360304,
                                59.3447479215063
                            ],
                            [
                                18.02523542903245,
                                59.3443802727858
                            ],
                            [
                                18.025683384254364,
                                59.3444719730814
                            ],
                            [
                                18.025287884755357,
                                59.3447852805283
                            ],
                            [
                                18.025058911360304,
                                59.3447479215063
                            ]
                        ]
                    ],
                    "type": "Polygon"
                }
            },
            {
                "id": 14,
                "zone_id": 1,
                "descr": "parking",
                "city_id": "STHLM",
                "geometry": {
                    "coordinates": [
                        [
                            [
                                18.0198140092846,
                                59.347503966241305
                            ],
                            [
                                18.02034932800035,
                                59.347003716304926
                            ],
                            [
                                18.02061974697162,
                                59.347082917950615
                            ],
                            [
                                18.020055660280207,
                                59.34757925558941
                            ],
                            [
                                18.0198140092846,
                                59.347503966241305
                            ]
                        ]
                    ],
                    "type": "Polygon"
                }
            },
            {
                "id": 16,
                "zone_id": 1,
                "descr": "parking",
                "city_id": "STHLM",
                "geometry": {
                    "coordinates": [
                        [
                            [
                                18.046243150706914,
                                59.33942665379021
                            ],
                            [
                                18.046362427006613,
                                59.33929973507509
                            ],
                            [
                                18.046435683317384,
                                59.33931649795147
                            ],
                            [
                                18.04630983273276,
                                59.339444853415955
                            ],
                            [
                                18.046243150706914,
                                59.33942665379021
                            ]
                        ]
                    ],
                    "type": "Polygon"
                }
            },
            {
                "id": 18,
                "zone_id": 1,
                "descr": "parking",
                "city_id": "STHLM",
                "geometry": {
                    "coordinates": [
                        [
                            [
                                18.02785962705582,
                                59.345947215873394
                            ],
                            [
                                18.027625930032997,
                                59.345836575314024
                            ],
                            [
                                18.027802872064598,
                                59.34574636043726
                            ],
                            [
                                18.02802655350041,
                                59.34588423590685
                            ],
                            [
                                18.02785962705582,
                                59.345947215873394
                            ]
                        ]
                    ],
                    "type": "Polygon"
                }
            },
            {
                "id": 20,
                "zone_id": 1,
                "descr": "parking",
                "city_id": "STHLM",
                "geometry": {
                    "coordinates": [
                        [
                            [
                                18.020254519507546,
                                59.34781459902865
                            ],
                            [
                                18.021309766944967,
                                59.34690523803462
                            ],
                            [
                                18.022019490713035,
                                59.346598146049445
                            ],
                            [
                                18.024349439699307,
                                59.347378967169874
                            ],
                            [
                                18.024713464058493,
                                59.34825975068006
                            ],
                            [
                                18.02370023974916,
                                59.34872393780725
                            ],
                            [
                                18.021683129605037,
                                59.348759644246684
                            ],
                            [
                                18.020254519507546,
                                59.34781459902865
                            ]
                        ]
                    ],
                    "type": "Polygon"
                }
            },
            {
                "id": 21,
                "zone_id": 1,
                "descr": "parking",
                "city_id": "STHLM",
                "geometry": {
                    "coordinates": [
                        [
                            [
                                18.052746441229857,
                                59.34248542075392
                            ],
                            [
                                18.052665772362957,
                                59.344153587169444
                            ],
                            [
                                18.043318122878617,
                                59.34425435194299
                            ],
                            [
                                18.04677655556273,
                                59.34085841433844
                            ],
                            [
                                18.052746441229857,
                                59.34248542075392
                            ]
                        ]
                    ],
                    "type": "Polygon"
                }
            },
            {
                "id": 22,
                "zone_id": 1,
                "descr": "parking",
                "city_id": "STHLM",
                "geometry": {
                    "coordinates": [
                        [
                            [
                                18.050805565244417,
                                59.31154751004175
                            ],
                            [
                                18.051404053154755,
                                59.30981076402358
                            ],
                            [
                                18.053678307214795,
                                59.31010750078178
                            ],
                            [
                                18.052874623449668,
                                59.3117787785728
                            ],
                            [
                                18.050805565244417,
                                59.31154751004175
                            ]
                        ]
                    ],
                    "type": "Polygon"
                }
            },
        ];
        const bikes = [
            {
                "id": 1,
                "city_id": "STHLM",
                "status_id": 1,
                "status_descr": "available",
                "charge_perc": 1,
                "coords": [
                    18.03422275762287,
                    59.32123602740293
                ],
                "active": true
            },
            {
                "id": 2,
                "city_id": "STHLM",
                "status_id": 1,
                "status_descr": "available",
                "charge_perc": 1,
                "coords": [
                    18.03391927784685,
                    59.321126346964036
                ],
                "active": true
            },
            {
                "id": 3,
                "city_id": "STHLM",
                "status_id": 1,
                "status_descr": "available",
                "charge_perc": 1,
                "coords": [
                    18.033805472930396,
                    59.32102956981265
                ],
                "active": true
            },
            {
                "id": 4,
                "city_id": "STHLM",
                "status_id": 1,
                "status_descr": "available",
                "charge_perc": 1,
                "coords": [
                    18.033957212818393,
                    59.32102956981265
                ],
                "active": true
            },
            {
                "id": 5,
                "city_id": "STHLM",
                "status_id": 1,
                "status_descr": "available",
                "charge_perc": 1,
                "coords": [
                    18.031094925731168,
                    59.321918238169445
                ],
                "active": true
            },
            {
                "id": 6,
                "city_id": "STHLM",
                "status_id": 1,
                "status_descr": "available",
                "charge_perc": 1,
                "coords": [
                    18.02549,
                    59.34452
                ],
                "active": true
            },
            {
                "id": 7,
                "city_id": "STHLM",
                "status_id": 1,
                "status_descr": "available",
                "charge_perc": 1,
                "coords": [
                    18.031165478356485,
                    59.32193150019506
                ],
                "active": true
            },
            {
                "id": 8,
                "city_id": "STHLM",
                "status_id": 1,
                "status_descr": "available",
                "charge_perc": 1,
                "coords": [
                    18.04636,
                    59.33935
                ],
                "active": true
            },
            {
                "id": 9,
                "city_id": "STHLM",
                "status_id": 1,
                "status_descr": "available",
                "charge_perc": 1,
                "coords": [
                    18.06031041675243,
                    59.331919447811146
                ],
                "active": true
            },
            {
                "id": 10,
                "city_id": "STHLM",
                "status_id": 1,
                "status_descr": "available",
                "charge_perc": 1,
                "coords": [
                    18.056700254822033,
                    59.33236310140697
                ],
                "active": true
            },
            {
                "id": 11,
                "city_id": "STHLM",
                "status_id": 1,
                "status_descr": "available",
                "charge_perc": 1,
                "coords": [
                    18.02779,
                    59.3458
                ],
                "active": true
            },
            {
                "id": 12,
                "city_id": "STHLM",
                "status_id": 1,
                "status_descr": "available",
                "charge_perc": 1,
                "coords": [
                    18.06012336173032,
                    59.33280674920974
                ],
                "active": true
            },
            {
                "id": 13,
                "city_id": "STHLM",
                "status_id": 1,
                "status_descr": "available",
                "charge_perc": 1,
                "coords": [
                    18.0226,
                    59.34722
                ],
                "active": true
            },
            {
                "id": 14,
                "city_id": "STHLM",
                "status_id": 1,
                "status_descr": "available",
                "charge_perc": 1,
                "coords": [
                    18.04805,
                    59.34326
                ],
                "active": true
            },
            {
                "id": 15,
                "city_id": "STHLM",
                "status_id": 1,
                "status_descr": "available",
                "charge_perc": 1,
                "coords": [
                    18.04683,
                    59.34314
                ],
                "active": true
            },
            {
                "id": 16,
                "city_id": "STHLM",
                "status_id": 1,
                "status_descr": "available",
                "charge_perc": 1,
                "coords": [
                    18.05222212079491,
                    59.3112426410689
                ],
                "active": true
            },
            {
                "id": 17,
                "city_id": "STHLM",
                "status_id": 1,
                "status_descr": "available",
                "charge_perc": 1,
                "coords": [
                    18.051684591042402,
                    59.31108436686807
                ],
                "active": true
            },
            {
                "id": 18,
                "city_id": "STHLM",
                "status_id": 1,
                "status_descr": "available",
                "charge_perc": 1,
                "coords": [
                    18.052242795015445,
                    59.31111602176716
                ],
                "active": true
            },
            {
                "id": 19,
                "city_id": "STHLM",
                "status_id": 1,
                "status_descr": "available",
                "charge_perc": 1,
                "coords": [
                    18.05261349059529,
                    59.31031310472224
                ],
                "active": true
            }
        ];
        const exp = [
            {
                "id": 8,
                "zone_id": 1,
                "descr": "parking",
                "city_id": "STHLM",
                "geometry": {
                    "coordinates": [
                        [
                            [
                                18.023872361393217,
                                59.34086750494353
                            ],
                            [
                                18.022381355857846,
                                59.340724561870616
                            ],
                            [
                                18.022405521264375,
                                59.34059887005105
                            ],
                            [
                                18.0239255252863,
                                59.340696219638204
                            ],
                            [
                                18.023872361393217,
                                59.34086750494353
                            ]
                        ]
                    ],
                    "type": "Polygon"
                },
                "bikes": [],
                "bikeCount": 0
            },
            {
                "id": 13,
                "zone_id": 1,
                "descr": "parking",
                "city_id": "STHLM",
                "geometry": {
                    "coordinates": [
                        [
                            [
                                18.025058911360304,
                                59.3447479215063
                            ],
                            [
                                18.02523542903245,
                                59.3443802727858
                            ],
                            [
                                18.025683384254364,
                                59.3444719730814
                            ],
                            [
                                18.025287884755357,
                                59.3447852805283
                            ],
                            [
                                18.025058911360304,
                                59.3447479215063
                            ]
                        ]
                    ],
                    "type": "Polygon"
                },
                "bikes": [
                    {
                        "id": 6,
                        "city_id": "STHLM",
                        "status_id": 1,
                        "status_descr": "available",
                        "charge_perc": 1,
                        "coords": [
                            18.02549,
                            59.34452
                        ],
                        "active": true
                    }
                ],
                "bikeCount": 1
            },
            {
                "id": 14,
                "zone_id": 1,
                "descr": "parking",
                "city_id": "STHLM",
                "geometry": {
                    "coordinates": [
                        [
                            [
                                18.0198140092846,
                                59.347503966241305
                            ],
                            [
                                18.02034932800035,
                                59.347003716304926
                            ],
                            [
                                18.02061974697162,
                                59.347082917950615
                            ],
                            [
                                18.020055660280207,
                                59.34757925558941
                            ],
                            [
                                18.0198140092846,
                                59.347503966241305
                            ]
                        ]
                    ],
                    "type": "Polygon"
                },
                "bikes": [],
                "bikeCount": 0
            },
            {
                "id": 16,
                "zone_id": 1,
                "descr": "parking",
                "city_id": "STHLM",
                "geometry": {
                    "coordinates": [
                        [
                            [
                                18.046243150706914,
                                59.33942665379021
                            ],
                            [
                                18.046362427006613,
                                59.33929973507509
                            ],
                            [
                                18.046435683317384,
                                59.33931649795147
                            ],
                            [
                                18.04630983273276,
                                59.339444853415955
                            ],
                            [
                                18.046243150706914,
                                59.33942665379021
                            ]
                        ]
                    ],
                    "type": "Polygon"
                },
                "bikes": [
                    {
                        "id": 8,
                        "city_id": "STHLM",
                        "status_id": 1,
                        "status_descr": "available",
                        "charge_perc": 1,
                        "coords": [
                            18.04636,
                            59.33935
                        ],
                        "active": true
                    }
                ],
                "bikeCount": 1
            },
            {
                "id": 18,
                "zone_id": 1,
                "descr": "parking",
                "city_id": "STHLM",
                "geometry": {
                    "coordinates": [
                        [
                            [
                                18.02785962705582,
                                59.345947215873394
                            ],
                            [
                                18.027625930032997,
                                59.345836575314024
                            ],
                            [
                                18.027802872064598,
                                59.34574636043726
                            ],
                            [
                                18.02802655350041,
                                59.34588423590685
                            ],
                            [
                                18.02785962705582,
                                59.345947215873394
                            ]
                        ]
                    ],
                    "type": "Polygon"
                },
                "bikes": [
                    {
                        "id": 11,
                        "city_id": "STHLM",
                        "status_id": 1,
                        "status_descr": "available",
                        "charge_perc": 1,
                        "coords": [
                            18.02779,
                            59.3458
                        ],
                        "active": true
                    }
                ],
                "bikeCount": 1
            },
            {
                "id": 20,
                "zone_id": 1,
                "descr": "parking",
                "city_id": "STHLM",
                "geometry": {
                    "coordinates": [
                        [
                            [
                                18.020254519507546,
                                59.34781459902865
                            ],
                            [
                                18.021309766944967,
                                59.34690523803462
                            ],
                            [
                                18.022019490713035,
                                59.346598146049445
                            ],
                            [
                                18.024349439699307,
                                59.347378967169874
                            ],
                            [
                                18.024713464058493,
                                59.34825975068006
                            ],
                            [
                                18.02370023974916,
                                59.34872393780725
                            ],
                            [
                                18.021683129605037,
                                59.348759644246684
                            ],
                            [
                                18.020254519507546,
                                59.34781459902865
                            ]
                        ]
                    ],
                    "type": "Polygon"
                },
                "bikes": [
                    {
                        "id": 13,
                        "city_id": "STHLM",
                        "status_id": 1,
                        "status_descr": "available",
                        "charge_perc": 1,
                        "coords": [
                            18.0226,
                            59.34722
                        ],
                        "active": true
                    }
                ],
                "bikeCount": 1
            },
            {
                "id": 21,
                "zone_id": 1,
                "descr": "parking",
                "city_id": "STHLM",
                "geometry": {
                    "coordinates": [
                        [
                            [
                                18.052746441229857,
                                59.34248542075392
                            ],
                            [
                                18.052665772362957,
                                59.344153587169444
                            ],
                            [
                                18.043318122878617,
                                59.34425435194299
                            ],
                            [
                                18.04677655556273,
                                59.34085841433844
                            ],
                            [
                                18.052746441229857,
                                59.34248542075392
                            ]
                        ]
                    ],
                    "type": "Polygon"
                },
                "bikes": [
                    {
                        "id": 14,
                        "city_id": "STHLM",
                        "status_id": 1,
                        "status_descr": "available",
                        "charge_perc": 1,
                        "coords": [
                            18.04805,
                            59.34326
                        ],
                        "active": true
                    },
                    {
                        "id": 15,
                        "city_id": "STHLM",
                        "status_id": 1,
                        "status_descr": "available",
                        "charge_perc": 1,
                        "coords": [
                            18.04683,
                            59.34314
                        ],
                        "active": true
                    }
                ],
                "bikeCount": 2
            },
            {
                "id": 22,
                "zone_id": 1,
                "descr": "parking",
                "city_id": "STHLM",
                "geometry": {
                    "coordinates": [
                        [
                            [
                                18.050805565244417,
                                59.31154751004175
                            ],
                            [
                                18.051404053154755,
                                59.30981076402358
                            ],
                            [
                                18.053678307214795,
                                59.31010750078178
                            ],
                            [
                                18.052874623449668,
                                59.3117787785728
                            ],
                            [
                                18.050805565244417,
                                59.31154751004175
                            ]
                        ]
                    ],
                    "type": "Polygon"
                },
                "bikes": [
                    {
                        "id": 16,
                        "city_id": "STHLM",
                        "status_id": 1,
                        "status_descr": "available",
                        "charge_perc": 1,
                        "coords": [
                            18.05222212079491,
                            59.3112426410689
                        ],
                        "active": true
                    },
                    {
                        "id": 17,
                        "city_id": "STHLM",
                        "status_id": 1,
                        "status_descr": "available",
                        "charge_perc": 1,
                        "coords": [
                            18.051684591042402,
                            59.31108436686807
                        ],
                        "active": true
                    },
                    {
                        "id": 18,
                        "city_id": "STHLM",
                        "status_id": 1,
                        "status_descr": "available",
                        "charge_perc": 1,
                        "coords": [
                            18.052242795015445,
                            59.31111602176716
                        ],
                        "active": true
                    },
                    {
                        "id": 19,
                        "city_id": "STHLM",
                        "status_id": 1,
                        "status_descr": "available",
                        "charge_perc": 1,
                        "coords": [
                            18.05261349059529,
                            59.31031310472224
                        ],
                        "active": true
                    }
                ],
                "bikeCount": 4
            },
        ]
        sinon.stub(cityModel, '_chargeParkZones').returns(zones);
        sinon.stub(bikeModel, 'getAll').returns(bikes);

        const res = await cityModel.chargeParkZones();

        expect(res).to.deep.equal(exp);
        sinon.restore();
    });
});
