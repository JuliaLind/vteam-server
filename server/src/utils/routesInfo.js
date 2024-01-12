const routesInfo = {
    admin: [
        {
            endpoint: "/bikes/:id/activate",
            method: "PUT",
            description: "Activate chosen bike",
            request: {
                headers: {
                    "x-access-token": "Admin JWT Token",
                    "x-api-key": "API Key",
                },
                params: {
                    id: "Bike ID"
                },
                body: {}
            },
            response: {
                status: 200,
                description: "Updated bike object",
                body: {
                    "id": 1,
                    "city_id": "STHLM",
                    "status_id": 1,
                    "status_descr": "available",
                    "charge_perc": 1,
                    "coords": [
                        18.05767,
                        59.33464
                    ],
                    "active": true
                }
            }
        },
        {
            endpoint: "/bikes/:id/deactivate",
            method: "PUT",
            description: "Deactivate a bike",
            request: {
                headers: {
                    "x-access-token": "Admin JWT Token",
                    "x-api-key": "API Key",
                },
                params: {
                    id: "Bike ID"
                },
                body: {}
            },
            response: {
                status: 200,
                description: "Updated bike object",
                body: {
                    "bike": {
                        "id": 1,
                        "city_id": "STHLM",
                        "status_id": 1,
                        "status_descr": "available",
                        "charge_perc": 1,
                        "coords": [
                            18.05767,
                            59.33464
                        ],
                        "active": false
                    }
                }
            }
        },
        {
            endpoint: "/bikes/:bikeId/status/:statusId",
            method: "PUT",
            description: "Update a bike's status",
            request: {
                headers: {
                    "x-access-token": "Admin JWT Token",
                    "x-api-key": "API Key",
                },
                params: {
                    bikeId: "Bike ID",
                    statusID: "New bike status ID",
                },
                body: {}
            },
            response: {
                status: 200,
                description: "Updated bike object",
                body: {
                    "id": 1,
                    "city_id": "STHLM",
                    "status_id": 4,
                    "status_descr": "maintenance required",
                    "charge_perc": 1,
                    "coords": [
                        18.05767,
                        59.33464
                    ],
                    "active": false
                }
            }
        },
        {
            endpoint: "/bikes/:id/change/city",
            method: "PUT",
            description: "Update a bike's city",
            request: {
                headers: {
                    "x-access-token": "Admin JWT Token",
                    "x-api-key": "API Key",
                },
                params: {
                    id: "Bike ID"
                },
                body: {
                    city_id: "New city ID."
                }
            },
            response: {
                status: 200,
                description: "Updated bike object.",
                body: {
                    "id": 1,
                    "city_id": "GBG",
                    "status_id": 1,
                    "status_descr": "available",
                    "charge_perc": 1,
                    "coords": [
                        18.05767,
                        59.33464
                    ],
                    "active": false
                }
            }
        },
        {
            endpoint: "/feed",
            method: "GET",
            description: "Connect admin client to feed",
            request: {
                headers: {},
                params: {},
                body: {}
            },
            response: {
                status: null,
                description: "No response.",
                body: null
            }
        },
        {
            endpoint: "/simulate",
            method: "GET",
            description: "Start simulation",
            request: {
                headers: {
                    "x-access-token": "Admin JWT Token",
                    "x-api-key": "API Key",
                },
                params: {},
                body: {}
            },
            response: {
                status: null,
                description: "No response.",
                body: null
            }
        },
        {
            endpoint: "/transactions",
            method: "POST",
            description: "Admin get one user's transactions",
            request: {
                headers: {
                    "x-access-token": "Admin JWT Token",
                    "x-api-key": "API Key",
                },
                params: {},
                body: {
                    user_id: "User ID"
                }
            },
            response: {
                status: 200,
                description: "Array of transaction objects",
                body: [
                    {
                        "id": 1,
                        "user_id": 1,
                        "date": "2024-01-12T19:41:00.000Z",
                        "ref": "***1111",
                        "amount": 500
                    }
                ]
            }
        },
        {
            endpoint: "/transactions/limit/:limit/offset/:offset",
            method: "POST",
            description: "Admin get one user's transactions paginated",
            request: {
                headers: {
                    "x-access-token": "Admin JWT Token",
                    "x-api-key": "API Key",
                },
                params: {
                    limit: "Number of transactions.",
                    offset: "Starting point in data set."
                },
                body: {
                    user_id: "User ID"
                }
            },
            response: {
                status: 200,
                description: "Array of transaction objects.",
                body: [
                    {
                        "id": 1,
                        "user_id": 1,
                        "date": "2024-01-12T19:41:00.000Z",
                        "ref": "***1111",
                        "amount": 500
                    }
                ]
            }
        },
        {
            endpoint: "/transactions/all",
            method: "GET",
            description: "Admin get all user transactions",
            request: {
                headers: {
                    "x-access-token": "Admin JWT Token",
                    "x-api-key": "API Key",
                },
                params: {},
                body: {}
            },
            response: {
                status: 200,
                description: "Array of transaction objects.",
                body: [
                    {
                        "id": 1,
                        "user_id": 1,
                        "date": "2024-01-12T19:41:00.000Z",
                        "ref": "***1111",
                        "amount": 500
                    }
                ]
            }
        },
        {
            endpoint: "/transactions/all/limit/:limit/offset/:offset",
            method: "GET",
            description: "Admin get all user transactions paginated",
            request: {
                headers: {
                    "x-access-token": "Admin JWT Token",
                    "x-api-key": "API Key",
                },
                params: {
                    limit: "Number of transactions.",
                    offset: "Starting point in data set."
                },
                body: {}
            },
            response: {
                status: 200,
                description: "Array of transaction objects.",
                body: [
                    {
                        "id": 1,
                        "user_id": 1,
                        "date": "2024-01-12T19:41:00.000Z",
                        "ref": "***1111",
                        "amount": 500
                    }
                ]
            }
        },
        {
            endpoint: "/trips",
            method: "POST",
            description: "Admin get one user's trips",
            request: {
                headers: {
                    "x-access-token": "Admin JWT Token",
                    "x-api-key": "API Key",
                },
                params: {},
                body: {
                    user_id: "User ID"
                }
            },
            response: {
                status: 200,
                description: "Array of trip objects",
                body: [
                    {
                        "id": 11,
                        "user_id": 1,
                        "bike_id": 1,
                        "start_time": "2024-01-05T15:16:00.000Z",
                        "end_time": "2024-01-05T15:22:00.000Z",
                        "start_pos": [
                            13.51464,
                            59.37884
                        ],
                        "end_pos": [
                            13.5148,
                            59.37663
                        ],
                        "start_cost": 10,
                        "var_cost": 17.68,
                        "park_cost": 100,
                        "total_cost": 127.68
                    }
                ]
            }
        },
        {
            endpoint: "/trips/limit/:limit/offset/:offset",
            method: "POST",
            description: "Admin get one user's trips paginated",
            request: {
                headers: {
                    "x-access-token": "Admin JWT Token",
                    "x-api-key": "API Key",
                },
                params: {
                    limit: "Number of trips.",
                    offset: "Starting point in data set."
                },
                body: {
                    user_id: "User ID"
                }
            },
            response: {
                status: 200,
                description: "Array of trip objects.",
                body: [
                    {
                        "id": 11,
                        "user_id": 1,
                        "bike_id": 1,
                        "start_time": "2024-01-05T15:16:00.000Z",
                        "end_time": "2024-01-05T15:22:00.000Z",
                        "start_pos": [
                            13.51464,
                            59.37884
                        ],
                        "end_pos": [
                            13.5148,
                            59.37663
                        ],
                        "start_cost": 10,
                        "var_cost": 17.68,
                        "park_cost": 100,
                        "total_cost": 127.68
                    }
                ]
            }
        },
        {
            endpoint: "/trips/all",
            method: "GET",
            description: "Admin get all user trips",
            request: {
                headers: {
                    "x-access-token": "Admin JWT Token",
                    "x-api-key": "API Key",
                },
                params: {},
                body: {}
            },
            response: {
                status: 200,
                description: "Array of trip objects.",
                body: [
                    {
                        "id": 11,
                        "user_id": 1,
                        "bike_id": 1,
                        "start_time": "2024-01-05T15:16:00.000Z",
                        "end_time": "2024-01-05T15:22:00.000Z",
                        "start_pos": [
                            13.51464,
                            59.37884
                        ],
                        "end_pos": [
                            13.5148,
                            59.37663
                        ],
                        "start_cost": 10,
                        "var_cost": 17.68,
                        "park_cost": 100,
                        "total_cost": 127.68
                    }
                ]
            }
        },
        {
            endpoint: "/trips/all/limit/:limit/offset/:offset",
            method: "GET",
            description: "Admin get all user trips paginated",
            request: {
                headers: {
                    "x-access-token": "Admin JWT Token",
                    "x-api-key": "API Key",
                },
                params: {
                    limit: "Number of trips.",
                    offset: "Starting point in data set."
                },
                body: {}
            },
            response: {
                status: 200,
                description: "Array of trip objects.",
                body: [
                    {
                        "id": 11,
                        "user_id": 1,
                        "bike_id": 1,
                        "start_time": "2024-01-05T15:16:00.000Z",
                        "end_time": "2024-01-05T15:22:00.000Z",
                        "start_pos": [
                            13.51464,
                            59.37884
                        ],
                        "end_pos": [
                            13.5148,
                            59.37663
                        ],
                        "start_cost": 10,
                        "var_cost": 17.68,
                        "park_cost": 100,
                        "total_cost": 127.68
                    }
                ]
            }
        },
        {
            endpoint: "/users",
            method: "GET",
            description: "Get all users",
            request: {
                headers: {
                    "x-access-token": "Admin JWT Token",
                    "x-api-key": "API Key",
                },
                params: {},
                body: {}
            },
            response: {
                status: 200,
                description: "Array of user objects",
                body: [
                    {
                        "id": 1000,
                        "email": "example@example.org",
                        "balance": 500,
                        "active": true
                    }
                ]
            }
        },
        {
            endpoint: "/users/limit/:limit/offset/:offset",
            method: "GET",
            description: "Get users paginated",
            request: {
                headers: {
                    "x-access-token": "Admin JWT Token",
                    "x-api-key": "API Key",
                },
                params: {
                    limit: "Number of users.",
                    offset: "Starting point in data set."
                },
                body: {}
            },
            response: {
                status: 200,
                description: "Array of user objects.",
                body: [
                    {
                        "id": 1000,
                        "email": "example@example.org",
                        "balance": 500,
                        "active": true
                    }
                ]
            }
        },
        {
            endpoint: "/users/:id",
            method: "GET",
            description: "Get one user",
            request: {
                headers: {
                    "x-access-token": "Admin JWT Token",
                    "x-api-key": "API Key",
                },
                params: {
                    id: "User ID"
                },
                body: {}
            },
            response: {
                status: 200,
                description: "User object",
                body: {
                    "id": 1000,
                    "email": "example@example.org",
                    "balance": 500,
                    "active": true
                }
            }
        },
        {
            endpoint: "/users/search/:search",
            method: "GET",
            description: "Search for users",
            request: {
                headers: {
                    "x-access-token": "Admin JWT Token",
                    "x-api-key": "API Key",
                },
                params: {
                    search: "Search word."
                },
                body: {}
            },
            response: {
                status: 200,
                description: "Array of user objects",
                body: [
                    {
                        "id": 1000,
                        "email": "example@example.org",
                        "balance": 500,
                        "active": true
                    }
                ]
            }
        },
        {
            endpoint: "/users/invoice",
            method: "PUT",
            description: "Charge customers with negative balance",
            request: {
                headers: {
                    "x-access-token": "Admin JWT Token",
                    "x-api-key": "API Key",
                },
                params: {},
                body: {}
            },
            response: {
                status: 200,
                description: "Summary object",
                body: {
                    "invoiced_users": 5021,
                    "invoiced_amount": 1384057.02
                }
            }
        },
        {
            endpoint: "/users/:id/status",
            method: "PUT",
            description: "Update a customer's status",
            request: {
                headers: {
                    "x-access-token": "Admin JWT Token",
                    "x-api-key": "API Key",
                },
                params: {
                    id: "User ID"
                },
                body: {
                    active: "New active status - true or false."
                }
            },
            response: {
                status: 200,
                description: "User object",
                body: {
                    "id": 1000,
                    "email": "example@example.org",
                    "balance": 500,
                    "active": false
                }
            }
        },
        {
            endpoint: "/users/:id/email",
            method: "PUT",
            description: "Update a customer's email",
            request: {
                headers: {
                    "x-access-token": "Admin JWT Token",
                    "x-api-key": "API Key",
                },
                params: {
                    id: "User ID"
                },
                body: {
                    email: "New user email."
                }
            },
            response: {
                status: 200,
                description: "User object",
                body: {
                    "id": 1000,
                    "email": "example@example.org",
                    "balance": 500,
                    "active": true
                }
            }
        },
    ],
    user: [
        {
            endpoint: "/balance",
            method: "POST",
            description: "Get user's balance",
            request: {
                headers: {
                    "x-access-token": "User JWT Token",
                    "x-api-key": "API Key",
                },
                params: {},
                body: {}
            },
            response: {
                status: 200,
                description: "User balance",
                body: {
                    balance: 500
                }
            }
        },
        {
            endpoint: "/bikes/rent/:bikeId",
            method: "POST",
            description: "Rent a bike",
            request: {
                headers: {
                    "x-access-token": "User JWT Token",
                    "x-api-key": "API Key",
                },
                params: {
                    bikeId: "Bike ID"
                },
                body: {}
            },
            response: {
                status: 200,
                description: "Trip ID",
                body: {
                    trip_id: 1
                }
            }
        },
        {
            endpoint: "/bikes/return/:tripId",
            method: "POST",
            description: "Return a bike",
            request: {
                headers: {
                    "x-access-token": "User JWT Token",
                    "x-api-key": "API Key",
                },
                params: {
                    bikeId: "Trip ID"
                },
                body: {}
            },
            response: {
                status: 200,
                description: "Trip ID",
                body: {
                    trip_id: 1
                }
            }
        },
        {
            endpoint: "/card",
            method: "POST",
            description: "Get user card details",
            request: {
                headers: {
                    "x-access-token": "User JWT Token",
                    "x-api-key": "API Key",
                },
                params: {},
                body: {}
            },
            response: {
                status: 200,
                description: "User card detail object",
                body: {
                    "card_nr": "1111 2222 3333 4444",
                    "card_type": 2,
                    "card_type_descr": "Mastercard"
                }
            }
        },
        {
            endpoint: "/card",
            method: "PUT",
            description: "Update user card details",
            request: {
                headers: {
                    "x-access-token": "User JWT Token",
                    "x-api-key": "API Key",
                },
                params: {},
                body: {
                    card_nr: "2222 3333 4444 5555",
                    card_type: 1,
                }
            },
            response: {
                status: 200,
                description: "User card detail object",
                body: {
                    "card_nr": "2222 3333 4444 5555",
                    "card_type": 1,
                    "card_type_descr": "Visa"
                }
            }
        },
        {
            endpoint: "/cities/:id/bikes",
            method: "GET",
            description: "Get available bikes for chosen city",
            request: {
                headers: {
                    "x-access-token": "User JWT Token",
                    "x-api-key": "API Key",
                },
                params: {
                    id: "City ID."
                },
                body: {}
            },
            response: {
                status: 200,
                description: "Array of bike objects.",
                body: [
                    {
                        "id": 2,
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
                ]
            }
        },
        {
            endpoint: "/payment",
            method: "POST",
            description: "Prepay money to user bike account",
            request: {
                headers: {
                    "x-access-token": "User JWT Token",
                    "x-api-key": "API Key",
                },
                params: {},
                body: {
                    amount: "Amount to add."
                }
            },
            response: {
                status: 200,
                description: "Receipt object.",
                body: {
                    "id": 3176,
                    "user_id": 3,
                    "date": "2024-01-06T10:17:42.000Z",
                    "ref": "***5555",
                    "amount": 100,
                    "balance": 100
                }
            }
        },
        {
            endpoint: "/transactions",
            method: "POST",
            description: "Get one user's transactions",
            request: {
                headers: {
                    "x-access-token": "Admin JWT Token",
                    "x-api-key": "API Key",
                },
                params: {},
                body: {}
            },
            response: {
                status: 200,
                description: "Array of transaction objects",
                body: [
                    {
                        "id": 1,
                        "user_id": 1,
                        "date": "2024-01-12T19:41:00.000Z",
                        "ref": "***1111",
                        "amount": 500
                    }
                ]
            }
        },
        {
            endpoint: "/transactions/limit/:limit/offset/:offset",
            method: "POST",
            description: "Get one user's transactions paginated",
            request: {
                headers: {
                    "x-access-token": "Admin JWT Token",
                    "x-api-key": "API Key",
                },
                params: {
                    limit: "Number of transactions.",
                    offset: "Starting point in data set."
                },
                body: {}
            },
            response: {
                status: 200,
                description: "Array of transaction objects.",
                body: [
                    {
                        "id": 1,
                        "user_id": 1,
                        "date": "2024-01-12T19:41:00.000Z",
                        "ref": "***1111",
                        "amount": 500
                    }
                ]
            }
        },
        {
            endpoint: "/trips",
            method: "POST",
            description: "Get one user's trips",
            request: {
                headers: {
                    "x-access-token": "Admin JWT Token",
                    "x-api-key": "API Key",
                },
                params: {},
                body: {}
            },
            response: {
                status: 200,
                description: "Array of trip objects",
                body: [
                    {
                        "id": 11,
                        "user_id": 1,
                        "bike_id": 1,
                        "start_time": "2024-01-05T15:16:00.000Z",
                        "end_time": "2024-01-05T15:22:00.000Z",
                        "start_pos": [
                            13.51464,
                            59.37884
                        ],
                        "end_pos": [
                            13.5148,
                            59.37663
                        ],
                        "start_cost": 10,
                        "var_cost": 17.68,
                        "park_cost": 100,
                        "total_cost": 127.68
                    }
                ]
            }
        },
        {
            endpoint: "/trips/limit/:limit/offset/:offset",
            method: "POST",
            description: "Get one user's trips paginated",
            request: {
                headers: {
                    "x-access-token": "Admin JWT Token",
                    "x-api-key": "API Key",
                },
                params: {
                    limit: "Number of trips.",
                    offset: "Starting point in data set."
                },
                body: {}
            },
            response: {
                status: 200,
                description: "Array of trip objects.",
                body: [
                    {
                        "id": 11,
                        "user_id": 1,
                        "bike_id": 1,
                        "start_time": "2024-01-05T15:16:00.000Z",
                        "end_time": "2024-01-05T15:22:00.000Z",
                        "start_pos": [
                            13.51464,
                            59.37884
                        ],
                        "end_pos": [
                            13.5148,
                            59.37663
                        ],
                        "start_cost": 10,
                        "var_cost": 17.68,
                        "park_cost": 100,
                        "total_cost": 127.68
                    }
                ]
            }
        },
    ],
    bikes: [
        {
            endpoint: "/instructions",
            method: "GET",
            description: "Connect bike to instructions feed",
            request: {
                headers: {
                    "x-api-key": "API Key",
                    "bike_id": "Bike ID"
                },
                params: {},
                body: {}
            },
            response: {
                status: null,
                description: "No response",
                body: null
            }
        },
        {
            endpoint: "/status",
            method: "GET",
            description: "Get all statuses a bike can have",
            request: {
                headers: {
                    "x-api-key": "API Key",
                },
                params: {},
                body: {}
            },
            response: {
                status: 200,
                description: "Array of bike status objects.",
                body: [
                    {
                        "id": 1,
                        "descr": "available"
                    },
                    {
                        "id": 2,
                        "descr": "rented"
                    },
                    {
                        "id": 3,
                        "descr": "in maintenance"
                    },
                    {
                        "id": 4,
                        "descr": "maintenance required"
                    },
                    {
                        "id": 5,
                        "descr": "rented maintenance required"
                    }
                ]
            }
        },
        {
            endpoint: "",
            method: "GET",
            description: "Get all bikes",
            request: {
                headers: {
                    "x-api-key": "API Key",
                },
                params: {},
                body: {}
            },
            response: {
                status: 200,
                description: "Array of bike objects.",
                body: [
                    {
                        "id": 1,
                        "city_id": "STHLM",
                        "status_id": 1,
                        "status_descr": "available",
                        "charge_perc": 1,
                        "coords": [
                            18.05767,
                            59.33464
                        ],
                        "active": false
                    }
                ]
            }
        },
        {
            endpoint: "/:id",
            method: "PUT",
            description: "Update a bike",
            request: {
                headers: {
                    "x-api-key": "API Key",
                },
                params: {
                    id: "Bike ID"
                },
                body: {
                    id: "Bike ID",
                    city_id: "City ID",
                    status_id: "Bike status",
                    charge_perc: "Float 0-1",
                    coords: "Array of longitude and latitude coordinates",
                    speed: "Bike speed."
                }
            },
            response: {
                status: 204,
                description: "Only response status.",
                body: null
            }
        },
        {
            endpoint: "/:id/zones",
            method: "GET",
            description: "Get city zones for a bike",
            request: {
                headers: {
                    "x-api-key": "API Key",
                },
                params: {
                    id: "Bike ID"
                },
                body: {}
            },
            response: {
                status: 200,
                description: "Zone object.",
                body: {
                    "city_id": "STHLM",
                    "geometry": {
                        "coordinates": [
                            [
                                [
                                    18.077863369208444,
                                    59.3026425264305
                                ],
                                [
                                    18.09815091103826,
                                    59.30699055672042
                                ],
                                [
                                    18.099732642276024,
                                    59.31601507540503
                                ],
                                [
                                    18.08037278179529,
                                    59.31906196189343
                                ],
                                [
                                    18.076010672122433,
                                    59.32087040616561
                                ],
                                [
                                    18.077593736164708,
                                    59.32370892367982
                                ],
                                [
                                    18.075797098176494,
                                    59.32919220588397
                                ],
                                [
                                    18.077930090748197,
                                    59.33178569456575
                                ],
                                [
                                    18.100791529590367,
                                    59.330692347580595
                                ],
                                [
                                    18.10890312372635,
                                    59.33393279121245
                                ],
                                [
                                    18.103138846212957,
                                    59.34228175774038
                                ],
                                [
                                    18.09275121649287,
                                    59.346306697299184
                                ],
                                [
                                    18.069911787579287,
                                    59.34689032798022
                                ],
                                [
                                    18.05345141862708,
                                    59.35499041709903
                                ],
                                [
                                    18.04498209014813,
                                    59.35246862857877
                                ],
                                [
                                    18.03963827622566,
                                    59.35509208487899
                                ],
                                [
                                    18.035844879372235,
                                    59.355067630956945
                                ],
                                [
                                    18.018856861582805,
                                    59.35102595097108
                                ],
                                [
                                    18.008383886213068,
                                    59.34198506380844
                                ],
                                [
                                    17.995217972094878,
                                    59.33625467746916
                                ],
                                [
                                    17.994858129940837,
                                    59.33076859571398
                                ],
                                [
                                    18.001153031824316,
                                    59.32216273527965
                                ],
                                [
                                    18.016160710469045,
                                    59.31704369834036
                                ],
                                [
                                    18.02910510590955,
                                    59.31537034239837
                                ],
                                [
                                    18.052367899989406,
                                    59.307620745841746
                                ],
                                [
                                    18.077863369208444,
                                    59.3026425264305
                                ]
                            ]
                        ],
                        "type": "Polygon"
                    },
                    "speed_limit": 20,
                    "zones": [
                        {
                            "zone_id": 3,
                            "geometry": {
                                "coordinates": [
                                    [
                                        [
                                            18.068502264333716,
                                            59.3231730630483
                                        ],
                                        [
                                            18.068886979457517,
                                            59.322819894077384
                                        ],
                                        [
                                            18.06967157839128,
                                            59.32255030139359
                                        ],
                                        [
                                            18.071048629582293,
                                            59.32269735221334
                                        ],
                                        [
                                            18.07223353409472,
                                            59.32241958901943
                                        ],
                                        [
                                            18.072809974128347,
                                            59.322092805885234
                                        ],
                                        [
                                            18.074042915309633,
                                            59.321921243481995
                                        ],
                                        [
                                            18.07479548979822,
                                            59.32297511313732
                                        ],
                                        [
                                            18.075019974791076,
                                            59.32345725774388
                                        ],
                                        [
                                            18.07548660710907,
                                            59.32483958049377
                                        ],
                                        [
                                            18.075321027899122,
                                            59.32558447555283
                                        ],
                                        [
                                            18.072581444612837,
                                            59.32786513518903
                                        ],
                                        [
                                            18.068156053750755,
                                            59.32645985525002
                                        ],
                                        [
                                            18.066771209451673,
                                            59.32563818712248
                                        ],
                                        [
                                            18.06773457939849,
                                            59.32510831583147
                                        ],
                                        [
                                            18.067072262560714,
                                            59.32410230557625
                                        ],
                                        [
                                            18.068502264333716,
                                            59.3231730630483
                                        ]
                                    ]
                                ],
                                "type": "Polygon"
                            },
                            "speed_limit": 0
                        },
                        {
                            "zone_id": 3,
                            "geometry": {
                                "coordinates": [
                                    [
                                        [
                                            18.02443762781263,
                                            59.340943446232956
                                        ],
                                        [
                                            18.02386921372411,
                                            59.34279843846576
                                        ],
                                        [
                                            18.021633451645016,
                                            59.343957757162485
                                        ],
                                        [
                                            18.017010350396873,
                                            59.34455672298341
                                        ],
                                        [
                                            18.015797733676123,
                                            59.34310759398775
                                        ],
                                        [
                                            18.016366147763335,
                                            59.34173569489417
                                        ],
                                        [
                                            18.019662949474537,
                                            59.34069224157918
                                        ],
                                        [
                                            18.020345046379305,
                                            59.3405183295765
                                        ],
                                        [
                                            18.02443762781263,
                                            59.340943446232956
                                        ]
                                    ]
                                ],
                                "type": "Polygon"
                            },
                            "speed_limit": 0
                        },
                        {
                            "zone_id": 3,
                            "geometry": {
                                "coordinates": [
                                    [
                                        [
                                            18.087630304900017,
                                            59.31352271604169
                                        ],
                                        [
                                            18.085062718830812,
                                            59.31208754951439
                                        ],
                                        [
                                            18.088608432926236,
                                            59.31035590926638
                                        ],
                                        [
                                            18.09297944254385,
                                            59.30910782557865
                                        ],
                                        [
                                            18.093010009045656,
                                            59.31214994931858
                                        ],
                                        [
                                            18.087630304900017,
                                            59.31352271604169
                                        ]
                                    ]
                                ],
                                "type": "Polygon"
                            },
                            "speed_limit": 0
                        },
                        {
                            "zone_id": 3,
                            "geometry": {
                                "coordinates": [
                                    [
                                        [
                                            18.070900400099447,
                                            59.34135449650614
                                        ],
                                        [
                                            18.070082169123253,
                                            59.34052001802971
                                        ],
                                        [
                                            18.070211363487715,
                                            59.33806038325082
                                        ],
                                        [
                                            18.073570416967385,
                                            59.33726974853127
                                        ],
                                        [
                                            18.075917447923473,
                                            59.340333355564354
                                        ],
                                        [
                                            18.070900400099447,
                                            59.34135449650614
                                        ]
                                    ]
                                ],
                                "type": "Polygon"
                            },
                            "speed_limit": 0
                        },
                        {
                            "zone_id": 3,
                            "geometry": {
                                "coordinates": [
                                    [
                                        [
                                            18.054639270868762,
                                            59.34306399153684
                                        ],
                                        [
                                            18.053052742589585,
                                            59.342616475914014
                                        ],
                                        [
                                            18.052833329105,
                                            59.34159233143461
                                        ],
                                        [
                                            18.053356545877733,
                                            59.341101763896035
                                        ],
                                        [
                                            18.05497683007667,
                                            59.34065422241727
                                        ],
                                        [
                                            18.056681504079194,
                                            59.34117922239969
                                        ],
                                        [
                                            18.054639270868762,
                                            59.34306399153684
                                        ]
                                    ]
                                ],
                                "type": "Polygon"
                            },
                            "speed_limit": 0
                        },
                        {
                            "zone_id": 3,
                            "geometry": {
                                "coordinates": [
                                    [
                                        [
                                            18.04562079866426,
                                            59.3413307381133
                                        ],
                                        [
                                            18.039390235082152,
                                            59.33983941132573
                                        ],
                                        [
                                            18.04101781087479,
                                            59.33813403131535
                                        ],
                                        [
                                            18.04375162958982,
                                            59.33709649588337
                                        ],
                                        [
                                            18.0441076617941,
                                            59.33721322020142
                                        ],
                                        [
                                            18.043624475231184,
                                            59.337563390749466
                                        ],
                                        [
                                            18.044794295331684,
                                            59.33803027919828
                                        ],
                                        [
                                            18.042747110155148,
                                            59.3394892642404
                                        ],
                                        [
                                            18.04656174091926,
                                            59.34048782232284
                                        ],
                                        [
                                            18.04562079866426,
                                            59.3413307381133
                                        ]
                                    ]
                                ],
                                "type": "Polygon"
                            },
                            "speed_limit": 0
                        },
                        {
                            "zone_id": 3,
                            "geometry": {
                                "coordinates": [
                                    [
                                        [
                                            18.051585630540217,
                                            59.314839311684125
                                        ],
                                        [
                                            18.047583711517888,
                                            59.31452853154846
                                        ],
                                        [
                                            18.045648000687095,
                                            59.31307448674937
                                        ],
                                        [
                                            18.0459959936465,
                                            59.312130989303085
                                        ],
                                        [
                                            18.0473879654798,
                                            59.31146497534337
                                        ],
                                        [
                                            18.051194138461028,
                                            59.31200888772014
                                        ],
                                        [
                                            18.052955852812886,
                                            59.312874689474995
                                        ],
                                        [
                                            18.051585630540217,
                                            59.314839311684125
                                        ]
                                    ]
                                ],
                                "type": "Polygon"
                            },
                            "speed_limit": 0
                        }
                    ]
                }
            }
        },
    ],
    card: [
        {
            endpoint: "/types",
            method: "GET",
            description: "Get all charge card types",
            request: {
                headers: {
                    "x-api-key": "API Key",
                },
                params: {},
                body: {}
            },
            response: {
                status: 200,
                description: "Array of card type objects.",
                body: [
                    {
                        "id": 1,
                        "name": "Visa"
                    },
                    {
                        "id": 2,
                        "name": "Mastercard"
                    },
                    {
                        "id": 3,
                        "name": "American Express"
                    }
                ]
            }
        },
    ],
    cities: [
        {
            endpoint: "",
            method: "GET",
            description: "Get all cities",
            request: {
                headers: {
                    "x-api-key": "API Key",
                },
                params: {},
                body: {}
            },
            response: {
                status: 200,
                description: "Array of city objects.",
                body: [
                    {
                        "id": "GBG",
                        "name": "Göteborg",
                        "speed_limit": 20,
                        "geometry": {
                            "coordinates": [
                                [
                                    [
                                        11.944333910956516,
                                        57.67919611123858
                                    ],
                                    [
                                        11.967995787555992,
                                        57.67458273107127
                                    ],
                                    [
                                        12.007998739155909,
                                        57.67849715197991
                                    ],
                                    [
                                        12.024993457155574,
                                        57.700996871231666
                                    ],
                                    [
                                        12.028811527258256,
                                        57.72496783561451
                                    ],
                                    [
                                        11.987762696696421,
                                        57.73566592553405
                                    ],
                                    [
                                        11.941092586496723,
                                        57.73859683290104
                                    ],
                                    [
                                        11.904357849897309,
                                        57.72226446708444
                                    ],
                                    [
                                        11.891669922003103,
                                        57.70220684386706
                                    ],
                                    [
                                        11.90421986760262,
                                        57.6840410615994
                                    ],
                                    [
                                        11.925005715003266,
                                        57.675094561128674
                                    ],
                                    [
                                        11.944333910956516,
                                        57.67919611123858
                                    ]
                                ]
                            ],
                            "type": "Polygon"
                        }
                    }
                ]
            }
        },
        {
            endpoint: "/:id",
            method: "GET",
            description: "Get one city by ID",
            request: {
                headers: {
                    "x-api-key": "API Key",
                },
                params: {
                    id: "City ID"
                },
                body: {}
            },
            response: {
                status: 200,
                description: "City object.",
                body: {
                    "id": "GBG",
                    "name": "Göteborg",
                    "speed_limit": 20,
                    "geometry": {
                        "coordinates": [
                            [
                                [
                                    11.944333910956516,
                                    57.67919611123858
                                ],
                                [
                                    11.967995787555992,
                                    57.67458273107127
                                ],
                                [
                                    12.007998739155909,
                                    57.67849715197991
                                ],
                                [
                                    12.024993457155574,
                                    57.700996871231666
                                ],
                                [
                                    12.028811527258256,
                                    57.72496783561451
                                ],
                                [
                                    11.987762696696421,
                                    57.73566592553405
                                ],
                                [
                                    11.941092586496723,
                                    57.73859683290104
                                ],
                                [
                                    11.904357849897309,
                                    57.72226446708444
                                ],
                                [
                                    11.891669922003103,
                                    57.70220684386706
                                ],
                                [
                                    11.90421986760262,
                                    57.6840410615994
                                ],
                                [
                                    11.925005715003266,
                                    57.675094561128674
                                ],
                                [
                                    11.944333910956516,
                                    57.67919611123858
                                ]
                            ]
                        ],
                        "type": "Polygon"
                    }
                }
            }
        },
        {
            endpoint: "/:id/bikes",
            method: "GET",
            description: "Get all bikes of a city",
            request: {
                headers: {
                    "x-api-key": "API Key",
                },
                params: {
                    id: "City ID"
                },
                body: {}
            },
            response: {
                status: 200,
                description: "Array of bike objects.",
                body: [
                    {
                        "id": 1,
                        "city_id": "STHLM",
                        "status_id": 1,
                        "status_descr": "available",
                        "charge_perc": 1,
                        "coords": [
                            18.05767,
                            59.33464
                        ],
                        "active": false
                    },
                ]
            }
        },
        {
            endpoint: "/:id/zones",
            method: "GET",
            description: "Get all zones of a city",
            request: {
                headers: {
                    "x-api-key": "API Key",
                },
                params: {
                    id: "City ID"
                },
                body: {}
            },
            response: {
                status: 200,
                description: "Array of zone objects.",
                body: [
                    {
                        "id": 1,
                        "zone_id": 3,
                        "descr": "forbidden",
                        "city_id": "STHLM",
                        "geometry": {
                            "coordinates": [
                                [
                                    [
                                        18.068502264333716,
                                        59.3231730630483
                                    ],
                                    [
                                        18.068886979457517,
                                        59.322819894077384
                                    ],
                                    [
                                        18.06967157839128,
                                        59.32255030139359
                                    ],
                                    [
                                        18.071048629582293,
                                        59.32269735221334
                                    ],
                                    [
                                        18.07223353409472,
                                        59.32241958901943
                                    ],
                                    [
                                        18.072809974128347,
                                        59.322092805885234
                                    ],
                                    [
                                        18.074042915309633,
                                        59.321921243481995
                                    ],
                                    [
                                        18.07479548979822,
                                        59.32297511313732
                                    ],
                                    [
                                        18.075019974791076,
                                        59.32345725774388
                                    ],
                                    [
                                        18.07548660710907,
                                        59.32483958049377
                                    ],
                                    [
                                        18.075321027899122,
                                        59.32558447555283
                                    ],
                                    [
                                        18.072581444612837,
                                        59.32786513518903
                                    ],
                                    [
                                        18.068156053750755,
                                        59.32645985525002
                                    ],
                                    [
                                        18.066771209451673,
                                        59.32563818712248
                                    ],
                                    [
                                        18.06773457939849,
                                        59.32510831583147
                                    ],
                                    [
                                        18.067072262560714,
                                        59.32410230557625
                                    ],
                                    [
                                        18.068502264333716,
                                        59.3231730630483
                                    ]
                                ]
                            ],
                            "type": "Polygon"
                        },
                        "speed_limit": 0
                    },
                ]
            }
        },
        {
            endpoint: "/zones/stations/bikes",
            method: "GET",
            description: "Get stations and zones with bikes located at each",
            request: {
                headers: {
                    "x-api-key": "API Key",
                },
                params: {},
                body: {}
            },
            response: {
                status: 200,
                description: "Array of stations and zones.",
                body: [
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
                                "id": 2,
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
                    }
                ]
            }
        },
    ],
    login: [
        {
            endpoint: "/admin",
            method: "POST",
            description: "Login admin",
            request: {
                headers: {
                    "x-api-key": "API Key",
                },
                params: {},
                body: {
                    username: "Admin username",
                    password: "Admin password"
                }
            },
            response: {
                status: null,
                description: "Object with admin data and JWT token.",
                body: {
                    data: {
                        type: "success",
                        message: "User logged in",
                        user: {
                            id: "Admin ID",
                            role: "admin"
                        },
                        token: "Admin JWT token"
                    }
                }
            }
        },
        {
            endpoint: "/user",
            method: "POST",
            description: "Login user",
            request: {
                headers: {
                    "x-api-key": "API Key",
                },
                params: {},
                body: {
                    token: "GitHub token"
                }
            },
            response: {
                status: null,
                description: "Object with user data and JWT token.",
                body: {
                    data: {
                        type: "success",
                        message: "User logged in",
                        user: {
                            id: "User ID",
                            email: "User email"
                        },
                        token: "User JWT token"
                    }
                }
            }
        },
    ],
    pricelist: [
        {
            endpoint: "",
            method: "GET",
            description: "Get price list",
            request: {
                headers: {
                    "x-api-key": "API Key",
                },
                params: {},
                body: {}
            },
            response: {
                status: null,
                description: "Array with price objects.",
                body: [
                    {
                        "id": "PARK_HIGH",
                        "amount": 100
                    },
                    {
                        "id": "PARK_LOW",
                        "amount": 5
                    },
                    {
                        "id": "START_HIGH",
                        "amount": 10
                    },
                    {
                        "id": "START_LOW",
                        "amount": 5
                    },
                    {
                        "id": "VAR",
                        "amount": 3
                    }
                ]
            }
        },
    ],
    zones: [
        {
            endpoint: "",
            method: "GET",
            description: "Get all zones",
            request: {
                headers: {
                    "x-api-key": "API Key",
                },
                params: {},
                body: {}
            },
            response: {
                status: 200,
                description: "Array with zone objects.",
                body: [
                    {
                        "id": 1,
                        "zone_id": 3,
                        "descr": "forbidden",
                        "city_id": "STHLM",
                        "geometry": {
                            "coordinates": [
                                [
                                    [
                                        18.068502264333716,
                                        59.3231730630483
                                    ],
                                    [
                                        18.068886979457517,
                                        59.322819894077384
                                    ],
                                    [
                                        18.06967157839128,
                                        59.32255030139359
                                    ],
                                    [
                                        18.071048629582293,
                                        59.32269735221334
                                    ],
                                    [
                                        18.07223353409472,
                                        59.32241958901943
                                    ],
                                    [
                                        18.072809974128347,
                                        59.322092805885234
                                    ],
                                    [
                                        18.074042915309633,
                                        59.321921243481995
                                    ],
                                    [
                                        18.07479548979822,
                                        59.32297511313732
                                    ],
                                    [
                                        18.075019974791076,
                                        59.32345725774388
                                    ],
                                    [
                                        18.07548660710907,
                                        59.32483958049377
                                    ],
                                    [
                                        18.075321027899122,
                                        59.32558447555283
                                    ],
                                    [
                                        18.072581444612837,
                                        59.32786513518903
                                    ],
                                    [
                                        18.068156053750755,
                                        59.32645985525002
                                    ],
                                    [
                                        18.066771209451673,
                                        59.32563818712248
                                    ],
                                    [
                                        18.06773457939849,
                                        59.32510831583147
                                    ],
                                    [
                                        18.067072262560714,
                                        59.32410230557625
                                    ],
                                    [
                                        18.068502264333716,
                                        59.3231730630483
                                    ]
                                ]
                            ],
                            "type": "Polygon"
                        },
                        "speed_limit": 0
                    },
                ]
            }
        },
    ]
};

export default routesInfo;
