const Router = artifacts.require("Cd3dRouter.sol")
const WETH = artifacts.require("WETH.sol")
const { config } = require('./migration-config');

module.exports = async function (deployer, network, addresses) {
  let weth;
  const FACTORY_ADDRESS = config[network].factoryAddress;

  if (network !== 'development') {
    weth = await WETH.at(config[network].WETHAddress);
  } else {
    await deployer.deploy(WETH);
    weth = await WETH.deployed();
  }

  console.log('create router', FACTORY_ADDRESS, weth.address);

  await deployer.deploy(Router, FACTORY_ADDRESS, weth.address);
};
