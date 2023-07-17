import React, { useState } from "react";
import styled from "styled-components";

function Navbar() {
  // Angenommen, du hast den Benutzernamen und das Benutzerfoto vom eingeloggten Benutzer
  const username = "Max Mustermann";
  const userPhoto = "https://example.com/user-photo.jpg";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <Nav>
      <Logo>Logo</Logo>
      <NavLinks>
        <NavLink>Home</NavLink>
        <NavLink>About</NavLink>
        <NavLink>Services</NavLink>
        <NavLink>Contact</NavLink>
      </NavLinks>
      <UserInfo>
        <NewButton>NEU</NewButton>
        <UserName>{username}</UserName>
        <UserButton onClick={toggleDropdown}>
          <UserPhoto src={userPhoto} alt="User Photo" />
        </UserButton>
        {isDropdownOpen && (
          <Dropdown>
            <DropdownItem>Einstellungen</DropdownItem>
            <DropdownItem>Logout</DropdownItem>
          </Dropdown>
        )}
      </UserInfo>
    </Nav>
  );
}

export default Navbar;

const Nav = styled.nav`
  background-color: #f2f2f2;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.a`
  font-size: 20px;
  font-weight: bold;
  text-decoration: none;
  color: #333;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
`;

const NavLink = styled.a`
  margin-left: 10px;
  text-decoration: none;
  color: #333;

  &:hover {
    text-decoration: underline;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;
const UserName = styled.span`
  margin-right: 10px;
`;

const NewButton = styled.button`
  margin-right: 10px;
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
`;

const UserButton = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
`;

const UserPhoto = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 2;
`;

const DropdownItem = styled.div`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;
