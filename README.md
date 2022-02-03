# DraftStream-BackEnd-Solidity

### forked from PancakeSwap

## 1. Deploy Core

yarn build

cd ..

sol-merger ./core/build/Cd3dFactory.sol ./build/

Deploy on Remix and verify

INIT_CODE_PAIR_HASH

## 2. Deploy Periphery

yarn build

cd ..

Replace INIT_CODE_PAIR_HASH with Cd3dFactory`s INIT_CODE_PAIR_HASH in contracts/libs/Cd3dLibrary.col

sol-merger ./core/build/Cd3dRouter.sol ./build/

Deploy on Remix and verify with Cd3dFactory address and INIT_CODE_PAIR_HASH

## 3. Deploy Farm

yarn compile

yarn migrate (CddxToken, SyrupBar)

Replace votes with SyrupBar`s address in contracts/libs/PancakeVoteProxy.col

yarn migrate (MasterChef)

sol-merger .\farm\contracts\MasterChef.sol .\build\
sol-merger .\farm\contracts\SyrupBar.sol .\build\

**********************

CinemaDraft Token has applied fees.

You must exclude the following addresses from applying fees

MasterChef
SyrupBar


example:
await this.cd3d.setExcludedFromFee(this.chef.address, true, { from: minter });
await this.cd3d.setExcludedFromFee(this.syrupBar.address, true, { from: minter });

