'use strict';
const { Contract } = require('fabric-contract-api');

class testToken extends Contract {

    async initLedger(ctx) {
        const totalSupply = 10000 * Math.pow(10, 10);
        const balances = {};
        balances[ctx.clientIdentity.getID()] = totalSupply;
        await ctx.stub.putState('balances', Buffer.from(JSON.stringify(balances)));
    }

    async balanceOf(ctx, owner) {
        const balances = JSON.parse(await ctx.stub.getState('balances'));
        return balances[owner];
    }

    async transfer(ctx, to, value) {
        const from = ctx.clientIdentity.getID();
        const balances = JSON.parse(await ctx.stub.getState('balances'));
        if (balances[from] < value) {
            throw new Error('Need more funds');
        }
        balances[to] = (balances[to] || 0) + value;
        balances[from] -= value;
        await ctx.stub.putState('balances', Buffer.from(JSON.stringify(balances)));
        return true;
    }
}
module.exports = testToken;
