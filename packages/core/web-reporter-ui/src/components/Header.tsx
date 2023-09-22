import React, { FunctionComponent } from "react";
import MoreIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

export type MenuOption = {
  label: string;
  icon: JSX.Element;
  onClick: () => void;
};

type HeaderProps = {
  menuOptions: MenuOption[];
};

export const Header: FunctionComponent<HeaderProps> = ({ menuOptions }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  if (menuOptions.length === 0) {
    return null;
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        id="report-menu-button"
        aria-controls={open ? "report-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        style={{
          float: "right",
        }}
      >
        <MoreIcon fontSize="inherit" className="text-neutral-300" />
      </IconButton>
      <Menu
        id="report-menu"
        aria-labelledby="report-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {menuOptions.map((option: MenuOption) => (
          <MenuItem
            key={option.label}
            onClick={() => {
              option.onClick();
              handleClose();
            }}
          >
            <ListItemIcon>{option.icon}</ListItemIcon>
            <ListItemText>{option.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
