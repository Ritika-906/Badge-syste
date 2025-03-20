// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventBadgeSystem {
    struct Badge {
        uint id;
        string name;
        string description;
        address owner;
        bool forSale;
        uint price;
    }

    uint private nextBadgeId = 1;
    mapping(uint => Badge) public badges;
    mapping(address => uint[]) public ownedBadges;
    
    event BadgeCreated(uint badgeId, string name, address owner);
    event BadgeTransferred(uint badgeId, address from, address to);
    event BadgeListedForSale(uint badgeId, uint price);
    event BadgeBought(uint badgeId, address buyer);

    function createBadge(string memory _name, string memory _description) public {
        badges[nextBadgeId] = Badge(nextBadgeId, _name, _description, msg.sender, false, 0);
        ownedBadges[msg.sender].push(nextBadgeId);
        emit BadgeCreated(nextBadgeId, _name, msg.sender);
        nextBadgeId++;
    }

    function transferBadge(uint _badgeId, address _to) public {
        require(badges[_badgeId].owner == msg.sender, "Not the badge owner");
        badges[_badgeId].owner = _to;
        ownedBadges[_to].push(_badgeId);
        emit BadgeTransferred(_badgeId, msg.sender, _to);
    }

    function listBadgeForSale(uint _badgeId, uint _price) public {
        require(badges[_badgeId].owner == msg.sender, "Not the badge owner");
        badges[_badgeId].forSale = true;
        badges[_badgeId].price = _price;
        emit BadgeListedForSale(_badgeId, _price);
    }

    function buyBadge(uint _badgeId) public payable {
        require(badges[_badgeId].forSale, "Badge not for sale");
        require(msg.value >= badges[_badgeId].price, "Insufficient payment");

        address previousOwner = badges[_badgeId].owner;
        payable(previousOwner).transfer(msg.value);

        badges[_badgeId].owner = msg.sender;
        badges[_badgeId].forSale = false;
        badges[_badgeId].price = 0;

        ownedBadges[msg.sender].push(_badgeId);
        emit BadgeBought(_badgeId, msg.sender);
    }

    function getOwnedBadges(address _owner) public view returns (uint[] memory) {
        return ownedBadges[_owner];
    }
}
