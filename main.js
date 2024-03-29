const { app, Tray, Menu, nativeImage } = require("electron");
const nf = require("node-fetch");
const cp = require("child_process");
const fs = require("fs");

let tray;

app.whenReady().then(() => {
  const offIcon = nativeImage.createFromPath("/usr/share/icons/server_off.png");
  const onIcon = nativeImage.createFromPath("/usr/share/icons/server_on.png");
  const configFile = "/home/david/.bin/server-manager.json";
  const wakeCommand = "/home/david/.bin/wakehome";
  const shutdownCommand = "/home/david/.bin/shutdownhome";
  const restartCommand = "/home/david/.bin/reboothome";
  const timeout = 5000;

  const configData = fs.readFileSync(configFile);
  const configStr = configData.toString('utf8');
  const config = JSON.parse(configStr);

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
    nf(config.address)
      .then((res) => res.text())
      .then((text) => {
        if (text === "online\n") {
          tray.setImage(onIcon);
        } else {
          tray.setImage(offIcon);
        }
      })
      .catch(() => {
        tray.setImage(offIcon);
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

  checkStatus();
});
