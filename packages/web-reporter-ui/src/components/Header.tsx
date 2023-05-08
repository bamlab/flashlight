import React from "react";
import IconButton from "@mui/material/IconButton";
import MoreIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const Header = ({ saveToZIPCallBack }: { saveToZIPCallBack: () => void }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSaveAsZIP = () => {
    saveToZIPCallBack();
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        id="export-menu-button"
        aria-controls={open ? "export-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        className="text-neutral-300"
        style={{
          float: "right",
        }}
      >
        <MoreIcon fontSize="inherit" />
      </IconButton>
      <Menu
        id="export"
        aria-labelledby="export-menu-button"
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
        <MenuItem onClick={handleSaveAsZIP}>
          <ListItemIcon>
            <FileDownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Save all as ZIP</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
