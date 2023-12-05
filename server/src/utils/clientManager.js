/**
 * Client manager module for managing connections and broadcasting messages.
 * @module clientManager
 */

import express from "express";

/**
 * Manages client and bike connections.
 */
const clientManager = {
    /** @type {Array<express.Response>} */
    clients: [],

    /** @type {Array<express.Response>} */
    bikes: [],

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
     * Adds a new bike to the bikes array.
     * @param {express.Response} bike - The bike connection to add.
     */
    addBike(bike) {
        this.bikes.push(bike);
    },

    /**
     * Removes a bike from the bikes array.
     * @param {express.Response} bike - The bike to remove.
     */
    removeBike(bike) {
        this.bikes = this.bikes.filter(b => b !== bike);
    },

    /**
     * Retrieves the current list of bikes.
     * @returns {Array<express.Response>} The current list of bikes.
     */
    getBikes() {
        return this.bikes;
    },

    /**
     * Retrieves the current list of clients.
     * @returns {Array<express.Response>} The current list of clients.
     */
    getClients() {
        return this.clients;
    },

    /**
     * Broadcasts a message to all clients.
     * @param {Object} message - The message to broadcast.
     */
    broadcastToClients(message) {
        this.clients.forEach(client => client.write(`data: ${JSON.stringify(message)}\n\n`));
    },

    /**
     * Broadcasts a message to all bikes.
     * @param {Object} message - The message to broadcast.
     */
    broadcastToBikes(message) {
        this.bikes.forEach(bike => bike.write(`data: ${JSON.stringify(message)}\n\n`));
    }
};

export default clientManager;
