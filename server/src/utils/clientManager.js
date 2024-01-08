// eslint-disable-next-line no-unused-vars
import express from "express";

/**
 * Manages client and bike connections with caching.
 */
const clientManager = {
    /** @type {Array<express.Response>} */
    clients: [],

    /** 
     * @type {Object<string, {res: express.Response | null}>} 
     */
    cachedBikeData: {},

    /**
     * Adds a new client to the clients array.
     * @param {express.Response} client - The client to add.
     *
     * @returns {void}
     */
    addClient(client) {
        this.clients.push(client);
    },

    /**
     * Removes a client from the clients array.
     * @param {express.Response} client - The client to remove.
     *
     * @returns {void}
     */
    removeClient(client) {
        this.clients = this.clients.filter(c => c !== client);
    },

    /**
     * Initializes a new bike entry in the cache.
     * @param {Number} bikeId - The bike ID.
     * @param {express.Response} res - The bike connection response to add.
     *
     * @returns {void}
     */
    addBike(bikeId, res) {
        this.cachedBikeData[bikeId] = {
            res: res
        };
    },

    /**
     * Removes a bike's res key (and value) from the cache object
     * @param {Number} bikeId - Id of the bike for which to set res to null
     *
     * @returns {void}
     */
    removeBike(bikeId) {
        this.cachedBikeData[bikeId].res = null
    },

    /**
     * Broadcasts a message to all clients.
     * @param {Object} message - The message to broadcast.
     *
     * @returns {void}
     */
    broadcastToClients(message) {
        message = JSON.stringify(message)
        this.clients.forEach(client => client.write(`data: ${message}\n\n`));
    },


    /**
     * Broadcasts a message to a specific bike.
     * @param {Number} bikeId - The ID of the bike to which the message should be broadcast.
     * @param {Object} message - The message to broadcast.
     *
     * @returns {void}
     */
    broadcastToBikes(bikeId, message) {
        message = JSON.stringify(message)

        if (bikeId === -1) {
            Object.values(this.cachedBikeData).forEach(bike => {
                bike.res?.write(`data: ${message}\n\n`);
            });
            return;
        }

        this.cachedBikeData[bikeId]?.res?.write(`data: ${message}\n\n`);
    }
};

export default clientManager;
