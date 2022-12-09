const { app, Tray, Menu, nativeImage } = require('electron')

let tray;

app.whenReady().then(() => {
  const icon = nativeImage.createFromPath("/usr/share/icons/server_off.png");
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    { label: "Item1", type: "radio" },
    { label: "Item2", type: "radio" },
    { label: "Item3", type: "radio", checked: true },
    { label: "Item4", type: "radio" },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip("This is my application");
  tray.setTitle("This is my title");
});
