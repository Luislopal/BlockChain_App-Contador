// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Contador {
    
    uint8 public valor = 0;
    
    event Tic(string msg, uint8 out);
        
    function incr() public {
        valor++;
        emit Tic("Actualizado", valor);
    }
    
    function set(uint8 _valor) public {
        valor = _valor;
        emit Tic("Actualizado", valor);
    }

    receive() external payable { 
        revert(); 
    }
}