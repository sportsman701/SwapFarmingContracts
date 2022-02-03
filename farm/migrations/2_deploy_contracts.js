const CinemaDraftToken = artifacts.require("CinemaDraftToken.sol");
const CddxToken = artifacts.require("CddxToken.sol");
const SyrupBar = artifacts.require("SyrupBar.sol");
const MasterChef = artifacts.require("MasterChef.sol");
const Timelock = artifacts.require("Timelock.sol");

module.exports = async function(deployer, network, addresses) {

    ////////////////////////////////////////////////////////////////////
    // Migrate Step 1
    //
    // // Deploy CddxToken
    // await deployer.deploy(CddxToken);
    // const cddxToken = await CddxToken.deployed();

    // Deploy Cd3dToken
    await deployer.deploy(CinemaDraftToken);
    const cd3dToken = await CinemaDraftToken.deployed();

    // // Deploy SyrupBar
    // await deployer.deploy(SyrupBar, cd3dToken.address);
    // const syrupBar = await SyrupBar.deployed();
    //
    // // Deploy CddxToken
    // await deployer.deploy(Timelock, addresses[0], '28800');
    // const timelock = await Timelock.deployed();
    //
    // ////////////////////////////////////////////////////////////////////
    // // Migrate Step 2
    //
    // // Deploy MasterChef
    // await deployer.deploy(MasterChef, cd3dToken.address, syrupBar.address, addresses[0], '40000000000000000000', '0');
    // const masterChef = await MasterChef.deployed();
    //
    // // Transfer ownership
    // await cd3dToken.transferOwnership(masterChef.address);
    // await syrupBar.transferOwnership(masterChef.address);
    // await masterChef.transferOwnership(timelock.address);
};
