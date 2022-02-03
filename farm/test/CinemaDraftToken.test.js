const { assert } = require("chai");

const CinemaDraftToken = artifacts.require('CinemaDraftToken');

contract('CinemaDraftToken', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async () => {
        this.cd3d = await CinemaDraftToken.new({ from: minter });
    });


    it('mint', async () => {
        await this.cd3d.transfer(alice, 1000, { from: minter });
        assert.equal((await this.cd3d.balanceOf(alice)).toString(), '1000');
    })
});
