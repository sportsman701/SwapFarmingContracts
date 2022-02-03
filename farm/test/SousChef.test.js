const { expectRevert, time } = require('@openzeppelin/test-helpers');
const CinemaDraftToken = artifacts.require('CinemaDraftToken');
const MasterChef = artifacts.require('MasterChef');
const SyrupBar = artifacts.require('SyrupBar');
const SousChef = artifacts.require('SousChef');
const MockBEP20 = artifacts.require('libs/MockBEP20');

contract('SousChef', ([alice, bob, carol, dev, minter]) => {
  beforeEach(async () => {
    this.syrup = await MockBEP20.new('LPToken', 'LP1', '1000000', {
      from: minter,
    });
    this.chef = await SousChef.new(this.syrup.address, '40', '300', '400', {
      from: minter,
    });
  });

  it('sous chef now', async () => {
    await this.syrup.transfer(bob, '1000', { from: minter });
    await this.syrup.transfer(carol, '1000', { from: minter });
    await this.syrup.transfer(alice, '1000', { from: minter });
    assert.equal((await this.syrup.balanceOf(bob)).toString(), '1000');

    await this.syrup.approve(this.chef.address, '1000', { from: bob });
    await this.syrup.approve(this.chef.address, '1000', { from: alice });
    await this.syrup.approve(this.chef.address, '1000', { from: carol });

    await this.chef.deposit('10', { from: bob });
    assert.equal(
      (await this.syrup.balanceOf(this.chef.address)).toString(),
      '10'
    );

    await time.advanceBlockTo('309');

    await this.chef.deposit('30', { from: alice });
    assert.equal(
      (await this.syrup.balanceOf(this.chef.address)).toString(),
      '40'
    );
    assert.equal(
      (await this.chef.pendingReward(bob, { from: bob })).toString(),
      '40'
    );

    await time.advanceBlockTo('310');
    assert.equal(
      (await this.chef.pendingReward(bob, { from: bob })).toString(),
      '40'
    );
    assert.equal(
      (await this.chef.pendingReward(alice, { from: alice })).toString(),
      '0'
    );

    await this.chef.deposit('40', { from: carol });
    assert.equal(
      (await this.syrup.balanceOf(this.chef.address)).toString(),
      '80'
    );
    await time.advanceBlockTo('312');
    //  bob 10, alice 30, carol 40
    assert.equal(
      (await this.chef.pendingReward(bob, { from: bob })).toString(),
      '55'
    );
    assert.equal(
      (await this.chef.pendingReward(alice, { from: alice })).toString(),
      '45'
    );
    assert.equal(
      (await this.chef.pendingReward(carol, { from: carol })).toString(),
      '20'
    );

    await this.chef.deposit('20', { from: alice }); // 305 bob 10, alice 50, carol 40
    await this.chef.deposit('30', { from: bob }); // 306  bob 40, alice 50, carol 40

    assert.equal(
      (await this.chef.pendingReward(bob, { from: bob })).toString(),
      '64'
    );
    assert.equal(
      (await this.chef.pendingReward(alice, { from: alice })).toString(),
      '80'
    );

    await time.advanceBlockTo('315');
    assert.equal(
      (await this.chef.pendingReward(bob, { from: bob })).toString(),
      '76'
    );
    assert.equal(
      (await this.chef.pendingReward(alice, { from: alice })).toString(),
      '95'
    );

    await this.chef.withdraw('20', { from: alice }); // 308 bob 40, alice 30, carol 40
    await this.chef.withdraw('30', { from: bob }); // 309  bob 10, alice 30, carol 40

    await time.advanceBlockTo('318');
    assert.equal(
      (await this.chef.pendingReward(bob, { from: bob })).toString(),
      '108'
    );
    assert.equal(
      (await this.chef.pendingReward(alice, { from: alice })).toString(),
      '136'
    );
    assert.equal(
      (await this.syrup.balanceOf(this.chef.address)).toString(),
      '80'
    );

    await time.advanceBlockTo('408');
    assert.equal(
      (await this.chef.pendingReward(bob, { from: bob })).toString(),
      '518'
    );
    assert.equal(
      (await this.chef.pendingReward(alice, { from: alice })).toString(),
      '1366'
    );
    assert.equal(
      (await this.chef.pendingReward(carol, { from: alice })).toString(),
      '1755'
    );

    await time.advanceBlockTo('428');
    assert.equal(
      (await this.chef.pendingReward(bob, { from: bob })).toString(),
      '518'
    );
    assert.equal(
      (await this.chef.pendingReward(alice, { from: alice })).toString(),
      '1366'
    );
    assert.equal(
      (await this.chef.pendingReward(carol, { from: alice })).toString(),
      '1755'
    );

    await this.chef.withdraw('10', { from: bob });
    await this.chef.withdraw('30', { from: alice });
    await expectRevert(this.chef.withdraw('50', { from: carol }), 'not enough');
    await this.chef.deposit('30', { from: carol });
    await time.advanceBlockTo('458');
    assert.equal(
      (await this.chef.pendingReward(bob, { from: bob })).toString(),
      '518'
    );
    assert.equal(
      (await this.chef.pendingReward(alice, { from: alice })).toString(),
      '1366'
    );
    assert.equal(
      (await this.chef.pendingReward(carol, { from: alice })).toString(),
      '1755'
    );
    await this.chef.withdraw('70', { from: carol });
    assert.equal((await this.chef.addressLength()).toString(), '3');
  });

  it('try syrup', async () => {
    this.cd3d = await CinemaDraftToken.new({ from: minter });
    this.syrup = await SyrupBar.new(this.cd3d.address, { from: minter });
    this.lp1 = await MockBEP20.new('LPToken', 'LP1', '1000000', {
      from: minter,
    });
    this.chef = await MasterChef.new(
      this.cd3d.address,
      this.syrup.address,
      dev,
      '1000',
      '300',
      { from: minter }
    );
    //await this.cd3d.transferOwnership(this.chef.address, { from: minter });
    await this.syrup.transferOwnership(this.chef.address, { from: minter });
    await this.lp1.transfer(bob, '2000', { from: minter });
    await this.lp1.transfer(alice, '2000', { from: minter });
    await this.cd3d.transfer(this.chef.address, 10000000, { from: minter });
    await this.cd3d.setExcludedFromFee(this.chef.address, true, { from: minter });

    await this.lp1.approve(this.chef.address, '1000', { from: alice });
    await this.cd3d.approve(this.chef.address, '1000', { from: alice });

    await this.chef.add('1000', this.lp1.address, true, { from: minter });
    await this.chef.deposit(1, '20', { from: alice });
    await time.advanceBlockTo('500');
    await this.chef.deposit(1, '0', { from: alice });
    await this.chef.add('1000', this.lp1.address, true, { from: minter });

    await this.chef.enterStaking('10', { from: alice });
    await time.advanceBlockTo('510');
    await this.chef.enterStaking('10', { from: alice });

    this.chef2 = await SousChef.new(this.syrup.address, '40', '600', '800', {
      from: minter,
    });
    await this.syrup.approve(this.chef2.address, '10', { from: alice });
    await time.advanceBlockTo('590');
    this.chef2.deposit('10', { from: alice }); //520
    await time.advanceBlockTo('610');
    assert.equal(
      (await this.syrup.balanceOf(this.chef2.address)).toString(),
      '10'
    );
    assert.equal(
      (await this.chef2.pendingReward(alice, { from: alice })).toString(),
      '400'
    );
  });

  it('emergencyWithdraw', async () => {
    await this.syrup.transfer(alice, '1000', { from: minter });
    assert.equal((await this.syrup.balanceOf(alice)).toString(), '1000');

    await this.syrup.approve(this.chef.address, '1000', { from: alice });
    await this.chef.deposit('10', { from: alice });
    assert.equal((await this.syrup.balanceOf(alice)).toString(), '990');
    await this.chef.emergencyWithdraw({ from: alice });
    assert.equal((await this.syrup.balanceOf(alice)).toString(), '1000');
    assert.equal(
      (await this.chef.pendingReward(alice, { from: alice })).toString(),
      '0'
    );
  });
});
