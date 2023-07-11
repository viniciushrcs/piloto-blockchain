import React from "react";
import {HeaderContainer, Logo } from "./Header.style";
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Logo
        src="https://www.rnp.br/arquivos/MicrosoftTeams-image%20%2816%29.png?VersionId=.l2nzOP37Nmt3EXh4ug2Uocdyh_vF9SA"
        alt="Logo RNP"
      />
      <nav>
        <IconButton component={Link} to="/">
          <HomeIcon sx={{color: '#035f7e'}} />
        </IconButton>
        <IconButton component={Link} to="/history">
          <SettingsIcon sx={{color: '#035f7e'}} />
        </IconButton>
      </nav>
    </HeaderContainer>
  );
};

export default Header;
