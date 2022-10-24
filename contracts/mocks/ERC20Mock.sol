// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


// mock class using ERC20
contract ERC20Mock is ERC20 {
    
    constructor() ERC20("FUJI", "FUJI20") {}

    function mint(address _recipient, uint256 _amount) public {
        _mint(_recipient, _amount);
    }
}


contract ERC20MockBase is ERC20Mock {
    using SafeMath for uint;

    function transfer(address _recipient, uint256 _amount) public virtual override returns (bool) {
        if (_recipient == address(0)) {
            _burn(msg.sender, _amount);

        } else {
            _transfer(_msgSender(), _recipient, _amount);
        }
        return true;
    }

    // Mocks a _transfer function with recipient address(0) allowed
    function transferFrom(address _sender, address _recipient, uint256 _amount)
        public virtual override returns (bool)
    {
        if (_recipient == address(0)) {
            _burn(_sender, _amount);

        } else {
            _transfer(_sender, _recipient, _amount);
            _approve(
                _sender,
                _msgSender(),
                allowance(_sender, _msgSender()).sub(_amount, "ERC20: transfer amount exceeds allowance")
            );
        }

        return true;
    }
}


contract ERC20MockBurnable is ERC20Mock, ERC20Burnable {

}
