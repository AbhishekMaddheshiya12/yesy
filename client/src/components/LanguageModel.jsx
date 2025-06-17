import React, { useState } from "react";
import { Box, Button, Modal, Backdrop, Fade, IconButton } from "@mui/material";
import Options from "./Options";
import { Edit } from "@mui/icons-material";

const LanguageModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <Edit
          sx={{
            color: "white",
            mr: 3,
            height: "20px",
            width: "20px",
            marginTop: "6px",
          }}
        />
      </IconButton>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
          sx: { backdropFilter: "blur(5px)" },
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 4,
              width: { xs: "90%", sm: 400 },
              outline: "none",
            }}
          >
            <Options />
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default LanguageModal;
