pragma solidity >=0.5.0;

interface ICd3dCallee {
    function cd3dCall(address sender, uint amount0, uint amount1, bytes calldata data) external;
}
