// @flow
import { app, Menu, shell, BrowserWindow, dialog } from 'electron';
import fileToRender from './tools/fileToRender';
const VERSION_CODE = '1.1.1'

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu() {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
      this.setupDevelopmentEnvironment();
    }

    const template = process.platform === 'darwin'
      ? this.buildDarwinTemplate()
      : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment() {
    this.mainWindow.openDevTools();
    this.mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu
        .buildFromTemplate([{
          label: 'Inspect element',
          click: () => {
            this.mainWindow.inspectElement(x, y);
          }
        }])
        .popup(this.mainWindow);
    });
  }

  buildDarwinTemplate() {
    const subMenuAbout = {
      label: '&File',
      submenu: [
        {
          label: '&Open',
          accelerator: 'Ctrl+O',
          click: () => {
            dialog.showOpenDialog(
              {
                title: 'Open Poll CSV file',
                filters: [
                  {name: 'CSV', extensions: ['csv']},
                ],
              },
              async callback => {
                let [ filename ] = callback
                // sending data to load
                this.mainWindow.webContents.send(
                  'LOAD_DATA',
                  await fileToRender(filename)
                );
              }
            )
          }
        },
        { type: 'separator' },
        {
          label: '&Print',
          accelerator: 'Ctrl+P',
          click: () => {
            this.mainWindow.webContents.print()
          }
        },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'Command+Q', click: () => { app.quit(); } }
      ]
    };
    const subMenuEdit = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
        { label: 'Select All', accelerator: 'Command+A', selector: 'selectAll:' }
      ]
    };
    const subMenuViewDev = {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'Command+R', click: () => { this.mainWindow.webContents.reload(); } },
        { label: 'Toggle Full Screen', accelerator: 'Ctrl+Command+F', click: () => { this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen()); } },
        { label: 'Toggle Developer Tools', accelerator: 'Alt+Command+I', click: () => { this.mainWindow.toggleDevTools(); } }
      ]
    };
    const subMenuViewProd = {
      label: 'View',
      submenu: [
        { label: 'Toggle Full Screen', accelerator: 'Ctrl+Command+F', click: () => { this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen()); } }
      ]
    };
    const subMenuWindow = {
      label: 'Window',
      submenu: [
        { label: 'Minimize', accelerator: 'Command+M', selector: 'performMiniaturize:' },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' }
      ]
    };
    const subMenuHelp = {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            this.mainWindow.webContents.send(
              'GOTO',
              '/about'
            );
          }
        }, {
          label: 'Version ' + VERSION_CODE,
          enabled: false,
        }
      ]
    };

    const subMenuView = process.env.NODE_ENV === 'development'
      ? subMenuViewDev
      : subMenuViewProd;

    return [
      subMenuAbout,
      subMenuEdit,
      subMenuView,
      subMenuWindow,
      subMenuHelp
    ];
  }

  buildDefaultTemplate() {
    const templateDefault = [{
      label: '&File',
      submenu: [{
        label: '&Open',
        accelerator: 'Ctrl+O',
        click: () => {
          dialog.showOpenDialog(
            {
              title: 'Open Poll CSV file',
              filters: [
                {name: 'CSV', extensions: ['csv']},
              ],
            },
            async callback => {
              let [ filename ] = callback
              // sending data to load
              this.mainWindow.webContents.send(
                'LOAD_DATA',
                await fileToRender(filename)
              );
            }
          )
        }
      },
      { type: 'separator' },
      {
        label: '&Print',
        accelerator: 'Ctrl+P',
        click: () => {
          this.mainWindow.webContents.print()
        }
      },
      { type: 'separator' },
      {
        label: '&Close',
        accelerator: 'Ctrl+W',
        click: () => {
          this.mainWindow.close();
        }
      }]
    }, {
      label: '&View',
      submenu: (process.env.NODE_ENV === 'development') ? [{
        label: '&Reload',
        accelerator: 'Ctrl+R',
        click: () => {
          this.mainWindow.webContents.reload();
        }
      }, {
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click: () => {
          this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
        }
      }, {
        label: 'Toggle &Developer Tools',
        accelerator: 'Alt+Ctrl+I',
        click: () => {
          this.mainWindow.toggleDevTools();
        }
      }] : [{
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click: () => {
          this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
        }
      }]
    }, {
      label: 'Help',
      submenu: [{
        label: 'About',
        click: () => {
          this.mainWindow.webContents.send(
            'GOTO',
            '/about'
          );
        }
      }, {
        label: 'Version ' + VERSION_CODE,
        enabled: false,
      }]
    }];

    return templateDefault;
  }
}
