import chai, { expect } from 'chai'
import { solidity, MockProvider, createFixtureLoader, deployContract } from 'ethereum-waffle'
import { Contract } from 'ethers'
import { bigNumberify } from 'ethers/utils'
import { MaxUint256 } from 'ethers/constants'
import { v2Fixture } from './shared/fixtures'

chai.use(solidity)

const overrides = {
  gasLimit: 9999999
}

describe('Cd3dRouter', () => {
  const provider = new MockProvider({
    hardfork: 'istanbul',
    mnemonic: 'horn horn horn horn horn horn horn horn horn horn horn horn',
    gasLimit: 9999999
  })
  const [wallet] = provider.getWallets()
  const loadFixture = createFixtureLoader(provider, [wallet])

  let token0: Contract
  let token1: Contract
  let weth: Contract
  let router: Contract
  beforeEach(async function() {
    const fixture = await loadFixture(v2Fixture)
    token0 = fixture.token0
    token1 = fixture.token1
    weth = fixture.WETH
    router = fixture.router
  })


  it('quote', async () => {
    expect(await router.quote(bigNumberify(1), bigNumberify(100), bigNumberify(200))).to.eq(bigNumberify(2))
    expect(await router.quote(bigNumberify(2), bigNumberify(200), bigNumberify(100))).to.eq(bigNumberify(1))
    await expect(router.quote(bigNumberify(0), bigNumberify(100), bigNumberify(200))).to.be.revertedWith(
      'Cd3dLibrary: INSUFFICIENT_AMOUNT'
    )
    await expect(router.quote(bigNumberify(1), bigNumberify(0), bigNumberify(200))).to.be.revertedWith(
      'Cd3dLibrary: INSUFFICIENT_LIQUIDITY'
    )
    await expect(router.quote(bigNumberify(1), bigNumberify(100), bigNumberify(0))).to.be.revertedWith(
      'Cd3dLibrary: INSUFFICIENT_LIQUIDITY'
    )
  })

  it('getAmountOut', async () => {
    expect(await router.getAmountOut(bigNumberify(2), bigNumberify(100), bigNumberify(100))).to.eq(bigNumberify(1))
    await expect(router.getAmountOut(bigNumberify(0), bigNumberify(100), bigNumberify(100))).to.be.revertedWith(
      'Cd3dLibrary: INSUFFICIENT_INPUT_AMOUNT'
    )
    await expect(router.getAmountOut(bigNumberify(2), bigNumberify(0), bigNumberify(100))).to.be.revertedWith(
      'Cd3dLibrary: INSUFFICIENT_LIQUIDITY'
    )
    await expect(router.getAmountOut(bigNumberify(2), bigNumberify(100), bigNumberify(0))).to.be.revertedWith(
      'Cd3dLibrary: INSUFFICIENT_LIQUIDITY'
    )
  })

  it('getAmountIn', async () => {
    expect(await router.getAmountIn(bigNumberify(1), bigNumberify(100), bigNumberify(100))).to.eq(bigNumberify(2))
    await expect(router.getAmountIn(bigNumberify(0), bigNumberify(100), bigNumberify(100))).to.be.revertedWith(
      'Cd3dLibrary: INSUFFICIENT_OUTPUT_AMOUNT'
    )
    await expect(router.getAmountIn(bigNumberify(1), bigNumberify(0), bigNumberify(100))).to.be.revertedWith(
      'Cd3dLibrary: INSUFFICIENT_LIQUIDITY'
    )
    await expect(router.getAmountIn(bigNumberify(1), bigNumberify(100), bigNumberify(0))).to.be.revertedWith(
      'Cd3dLibrary: INSUFFICIENT_LIQUIDITY'
    )
  })

  it('getAmountsOutETH', async () => {
    try{
      await router.addLiquidityETH(
        token1.address,
        bigNumberify(10000),
        bigNumberify(10000),
        100,
        wallet.address,
        MaxUint256
      )
    } catch (e){
      console.log('error', e);
    }

    const path = [weth.address, token1.address]
    console.log('path', path);
    expect(await router.getAmountsOut(bigNumberify(2), path)).to.deep.eq([bigNumberify(2), bigNumberify(1)])
  })

  it('getAmountsOut', async () => {
    await token0.approve(router.address, MaxUint256)
    await token1.approve(router.address, MaxUint256)

      await router.addLiquidity(
        token0.address,
        token1.address,
        bigNumberify(10000),
        bigNumberify(10000),
        0,
        0,
        wallet.address,
        MaxUint256
      )


    console.log('path', token0.address);
    await expect(router.getAmountsOut(bigNumberify(2), [token0.address])).to.be.revertedWith(
      'Cd3dLibrary: INVALID_PATH'
    )
    const path = [token0.address, token1.address]
    console.log('path', path);
    expect(await router.getAmountsOut(bigNumberify(2), path)).to.deep.eq([bigNumberify(2), bigNumberify(1)])
  })

  it('getAmountsIn', async () => {
    await token0.approve(router.address, MaxUint256)
    await token1.approve(router.address, MaxUint256)
    await router.addLiquidity(
      token0.address,
      token1.address,
      bigNumberify(10000),
      bigNumberify(10000),
      0,
      0,
      wallet.address,
      MaxUint256
    )

    await expect(router.getAmountsIn(bigNumberify(1), [token0.address])).to.be.revertedWith(
      'Cd3dLibrary: INVALID_PATH'
    )
    const path = [token0.address, token1.address]
    expect(await router.getAmountsIn(bigNumberify(1), path)).to.deep.eq([bigNumberify(2), bigNumberify(1)])
  })

})


