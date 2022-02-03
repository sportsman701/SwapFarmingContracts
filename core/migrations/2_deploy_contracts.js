const Cd3dFactory = artifacts.require("Cd3dFactory.sol");
const Cd3dERC20 = artifacts.require("Cd3dERC20.sol");
const Cd3dToken1 = artifacts.require("Cd3dToken1.sol");
const Cd3dToken2 = artifacts.require("Cd3dToken2.sol");

module.exports = async function (deployer, network, addresses) {
  
  // Deploy Cd3dERC20
  await deployer.deploy(Cd3dERC20);
  const cd3dERC20 = await Cd3dERC20.deployed();
  
  // Deploy Cd3dFactory
  await deployer.deploy(Cd3dFactory, addresses[0]);
  const cd3dFactory = await Cd3dFactory.deployed();

  let token1Address, token2Address;

  if (network === 'mainnet') {
    token1Address = '';
    token2Address = '';
  } else {
    await deployer.deploy(Cd3dToken1);
    await deployer.deploy(Cd3dToken2);
    const token1 = await Cd3dToken1.deployed();
    const token2 = await Cd3dToken2.deployed();
    token1Address = token1.address;
    token2Address = token2.address;
  }
  await cd3dFactory.createPair(token1Address , token2Address);
};
