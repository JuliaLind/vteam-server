import express from "express";

const CACHE_LIFETIME = 30 * 1000; // 30 seconds in milliseconds

/**
 * Manages client and bike connections with caching.
 */
const clientManager = {
    /** @type {Array<express.Response>} */
    clients: [],

    /** 
     * @type {Object<string, {data: any, res: express.Response | null, timestamp: number | null}>} 
     */
    cachedBikeData: {},

    /**
     * Adds a new client to the clients array.
     * @param {express.Response} client - The client to add.
     */
    addClient(client) {
        this.clients.push(client);
    },

    /**
     * Removes a client from the clients array.
     * @param {express.Response} client - The client to remove.
     */
    removeClient(client) {
        this.clients = this.clients.filter(c => c !== client);
    },

    /**
     * Initializes a new bike entry in the cache.
     * @param {Number} bikeId - The bike ID.
     * @param {express.Response} res - The bike connection response to add.
     */
    addBike(bikeId, res) {
        this.cachedBikeData[bikeId] = {
            res: res,
            data: null,
            timestamp: null
        };
    },

    /**
     * Removes a bike's res key (and value) from the cache object
     * @param {Number} bikeId - Id of the bike for which to set res to null
     */
    removeBike(bikeId) {
        this.cachedBikeData[bikeId].res = null
    },

    /**
     * Updates bike data in the cache and writes to database if necessary.
     * @param {Number} bikeId - The bike ID.
     * @param {any} dbData - Data to update database with.
     * @param {any} cachedData - Data to cache.
     * @param {Function} updateBike - Function to write data to the database.
     */
    async updateBikeData(bikeId, cachedData, dbData, updateBike) {
        const cacheEntry = this.cachedBikeData[bikeId];

        // Kolla om det finns en timestamp eller om cachen har gått ut
        const isCacheExpired = !cacheEntry.timestamp || (Date.now() - cacheEntry.timestamp > CACHE_LIFETIME);

        if (isCacheExpired) {
            // Om cachen är utgången eller inte finns --> uppdatera databasen
            await updateBike(
                dbData.id,
                dbData.status,
                dbData.charge,
                dbData.coords
            );

            // Uppdatera cachen med ny data och tidsstämpel
            this.cachedBikeData[bikeId] = {
                ...cacheEntry,
                data: cachedData,
                timestamp: Date.now()
            };
        } else {
            // Annars uppdatera endast cachad data
            this.cachedBikeData[bikeId].data = cachedData;
        }
    },

    /**
     * Broadcasts a message to all clients.
     * @param {Object} message - The message to broadcast.
     */
    broadcastToClients(message) {
        this.clients.forEach(client => client.write(`data: ${JSON.stringify(message)}\n\n`));
    },


    /**
     * Broadcasts a message to a specific bike.
     * @param {Number} bikeId - The ID of the bike to which the message should be broadcast.
     * @param {Object} message - The message to broadcast.
     */
    broadcastToBike(bikeId, message) {
        const bike = this.cachedBikeData[bikeId];
        
        if (bike && bike.res) {
            bike.res.write(`data: ${JSON.stringify(message)}\n\n`);
        }
    }
};

export default clientManager;
