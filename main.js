const { app, Tray, Menu, nativeImage } = require("electron");
const fs = require("fs");
const cp = require("child_process");

let tray;

app.whenReady().then(() => {
  const offIcon = nativeImage.createFromPath("/usr/share/icons/server_off.png");
  const onIcon = nativeImage.createFromPath("/usr/share/icons/server_on.png");
  const statusFilePath = "/etc/server-status";
  const wakeCommand = "/home/david/.bin/wakehome";
  const shutdownCommand = "/home/david/.bin/shutdownhome";
  const restartCommand = "/home/david/.bin/reboothome";
  const timeout = 5000;

  tray = new Tray(offIcon);

  const startServer = () => {
    cp.spawn(wakeCommand);
  };

  const stopServer = () => {
    cp.spawn(shutdownCommand);
  };

  const restartServer = () => {
    cp.spawn(restartCommand);
  };

  const checkStatus = () => {
    fs.readFile(statusFilePath, "utf-8", (err, data) => {
      if (err) {
        tray.setImage(offIcon);
      } else {
        if (data === "UP") {
          tray.setImage(onIcon);
        } else {
          tray.setImage(offIcon);
        }
      }
    });
  };

  setInterval(() => {
    checkStatus();
  }, timeout);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Start server",
      type: "normal",
      click: startServer,
    },
    {
      label: "Stop server",
      type: "normal",
      click: stopServer,
    },
    {
      label: "Restart server",
      type: "normal",
      click: restartServer,
    },
    {
      label: "",
      type: "separator",
    },
    {
      label: "Quit",
      type: "normal",
      click: () => {
        app.exit(0);
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip("Server manager");
  tray.setTitle("Server manager");
});
